import prisma from "../lib/prisma.js";
import { randomUUID } from "node:crypto";

type SubmittedAnswer = {
  questionId: string;
  answerId?: string | null;
  responseTimeMs: number;
};

type OpenTdbQuestion = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type OpenTdbResponse = {
  response_code: number;
  results: OpenTdbQuestion[];
};

type RuntimeQuestionRecord = {
  categoryId: string;
  correctAnswerId: string;
  expiresAt: number;
};

const OPEN_TDB_CATEGORY_BY_NAME: Record<string, number> = {
  science: 17,
  history: 23,
  geography: 22,
};

const RUNTIME_QUESTION_TTL_MS = 60 * 60 * 1000;
const runtimeQuestionMap = new Map<string, RuntimeQuestionRecord>();

function purgeExpiredRuntimeQuestions() {
  const now = Date.now();
  for (const [questionId, record] of runtimeQuestionMap.entries()) {
    if (record.expiresAt <= now) {
      runtimeQuestionMap.delete(questionId);
    }
  }
}

function decodeOpenTdbValue(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function getLocalQuestions(categoryId: string, limit: number) {
  const questions = await prisma.question.findMany({
    where: { categoryId },
    include: { answers: true },
  });

  return shuffle(questions)
    .slice(0, Math.max(1, limit))
    .map((question) => ({
      ...question,
      answers: shuffle(question.answers).map((answer) => ({
        id: answer.id,
        text: answer.text,
        isCorrect: answer.isCorrect,
      })),
    }));
}

function shuffle<T>(items: T[]): T[] {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export const resolvers = {
  Query: {
    getCategories: async () => {
      const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { questions: true },
          },
        },
      });

      return categories.map((category) => ({
        ...category,
        questionCount: category._count.questions,
      }));
    },

    getQuestions: async (
      _root: unknown,
      { categoryId, limit = 10 }: { categoryId: string; limit?: number }
    ) => {
      purgeExpiredRuntimeQuestions();

      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new Error("Category not found.");
      }

      const openTdbCategory = OPEN_TDB_CATEGORY_BY_NAME[category.name.toLowerCase()];
      const normalizedLimit = Math.min(Math.max(1, limit), 50);
      if (!openTdbCategory) {
        return getLocalQuestions(categoryId, normalizedLimit);
      }

      const search = new URLSearchParams({
        amount: String(normalizedLimit),
        category: String(openTdbCategory),
        type: "multiple",
        encode: "url3986",
      });

      try {
        const response = await fetch(`https://opentdb.com/api.php?${search.toString()}`);
        if (!response.ok) {
          return getLocalQuestions(categoryId, normalizedLimit);
        }

        const payload = (await response.json()) as OpenTdbResponse;
        if (payload.response_code !== 0 || !payload.results.length) {
          return getLocalQuestions(categoryId, normalizedLimit);
        }

        const questionExpiresAt = Date.now() + RUNTIME_QUESTION_TTL_MS;

        return payload.results.map((item) => {
          const questionId = randomUUID();
          const options = shuffle([
            {
              text: decodeOpenTdbValue(item.correct_answer),
              isCorrect: true,
            },
            ...item.incorrect_answers.map((answer) => ({
              text: decodeOpenTdbValue(answer),
              isCorrect: false,
            })),
          ]).map((answer) => ({
            id: randomUUID(),
            text: answer.text,
            isCorrect: answer.isCorrect,
          }));

          const correctAnswer = options.find((answer) => answer.isCorrect);
          if (!correctAnswer) {
            throw new Error("Could not generate question answers.");
          }

          runtimeQuestionMap.set(questionId, {
            categoryId,
            correctAnswerId: correctAnswer.id,
            expiresAt: questionExpiresAt,
          });

          return {
            id: questionId,
            text: decodeOpenTdbValue(item.question),
            categoryId,
            answers: options,
          };
        });
      } catch {
        return getLocalQuestions(categoryId, normalizedLimit);
      }
    },

    getLeaderboard: async (
      _root: unknown,
      { categoryId, limit = 10 }: { categoryId: string; limit?: number }
    ) => {
      const bestScores = await prisma.$queryRaw<
        { id: string; userId: string; points: number; createdAt: Date; rank: number }[]
      >`
        WITH best_scores AS (
          SELECT DISTINCT ON ("userId")
            "id", "userId", "points", "createdAt"
          FROM "Score"
          WHERE "categoryId" = ${categoryId}
          ORDER BY "userId", "points" DESC, "createdAt" ASC
        ),
        ranked AS (
          SELECT
            *,
            ROW_NUMBER() OVER (ORDER BY "points" DESC, "createdAt" ASC) AS rank
          FROM best_scores
        )
        SELECT * FROM ranked
        ORDER BY rank ASC
        LIMIT ${limit}
      `;

      const userIds = bestScores.map((entry) => entry.userId);
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
      });
      const userMap = new Map(users.map((u) => [u.id, u]));

      return bestScores.map((entry) => ({
        rank: Number(entry.rank),
        user: userMap.get(entry.userId),
        points: entry.points,
        createdAt: entry.createdAt.toISOString(),
      }));
    },

    userByUsername: async (_root: unknown, { username }: { username: string }) => {
      return prisma.user.findUnique({ where: { username } });
    },
  },

  Mutation: {
    createUser: async (_root: unknown, { username }: { username: string }) => {
      const normalized = username.trim();
      if (!normalized) {
        throw new Error("Username cannot be empty.");
      }

      return prisma.user.create({
        data: { username: normalized },
      }).catch(async (error: unknown) => {
        const message = error instanceof Error ? error.message : "";
        if (!message.includes("Unique constraint")) {
          throw error;
        }

        const existing = await prisma.user.findUnique({ where: { username: normalized } });
        if (!existing) {
          throw error;
        }

        return existing;
      });
    },

    submitScore: async (
      _root: unknown,
      {
        userId,
        categoryId,
        answers,
      }: { userId: string; categoryId: string; answers: SubmittedAnswer[] }
    ) => {
      if (!answers.length) {
        throw new Error("At least one answer is required.");
      }

      purgeExpiredRuntimeQuestions();

      const [user, category] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.category.findUnique({ where: { id: categoryId } }),
      ]);

      if (!user) {
        throw new Error("User not found.");
      }

      if (!category) {
        throw new Error("Category not found.");
      }

      let totalResponseTimeMs = 0;
      let correctAnswers = 0;

      for (const entry of answers) {
        const clampedResponseTime = Math.min(Math.max(entry.responseTimeMs, 0), 15000);
        totalResponseTimeMs += clampedResponseTime;

        const runtimeQuestion = runtimeQuestionMap.get(entry.questionId);
        if (runtimeQuestion) {
          if (runtimeQuestion.categoryId !== categoryId) {
            throw new Error("Submitted question does not belong to this category.");
          }

          if (entry.answerId && entry.answerId === runtimeQuestion.correctAnswerId) {
            correctAnswers += 1;
          }

          continue;
        }

        if (!entry.answerId) {
          continue;
        }

        const answerRecord = await prisma.answer.findUnique({
          where: { id: entry.answerId },
          include: {
            question: {
              select: { categoryId: true },
            },
          },
        });

        if (!answerRecord || answerRecord.question.categoryId !== categoryId) {
          throw new Error("One or more submitted questions do not belong to this category.");
        }

        if (answerRecord.isCorrect) {
          correctAnswers += 1;
        }
      }

      const totalQuestions = answers.length;
      const basePoints = correctAnswers * 100;
      const maxRoundTimeMs = totalQuestions * 15000;
      const unusedTimeMs = Math.max(maxRoundTimeMs - totalResponseTimeMs, 0);
      const speedBonus = Math.floor(unusedTimeMs / 1000) * 10;
      const points = basePoints + speedBonus;

      return prisma.score.create({
        data: {
          userId,
          categoryId,
          points,
          correctAnswers,
          totalQuestions,
          speedBonus,
        },
        include: {
          user: true,
          category: true,
        },
      });
    },
  },

  User: {
    createdAt: (user: { createdAt: Date }) => user.createdAt.toISOString(),
    scores: async (user: { id: string }) => {
      return prisma.score.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          user: true,
        },
      });
    },
  },

  Category: {
    questionCount: async (category: { id: string; questionCount?: number }) => {
      if (typeof category.questionCount === "number") {
        return category.questionCount;
      }

      return prisma.question.count({ where: { categoryId: category.id } });
    },
  },

  Score: {
    createdAt: (score: { createdAt: Date }) => score.createdAt.toISOString(),
    user: async (score: { userId: string; user?: { id: string; username: string; createdAt: Date } }) => {
      if (score.user) {
        return score.user;
      }
      return prisma.user.findUnique({ where: { id: score.userId } });
    },
    category: async (
      score: { categoryId: string; category?: { id: string; name: string; icon: string } }
    ) => {
      if (score.category) {
        return score.category;
      }
      return prisma.category.findUnique({ where: { id: score.categoryId } });
    },
  },

  Question: {
    answers: async (
      question: { id: string; answers?: Array<{ id: string; text: string }> }
    ) => {
      if (question.answers) {
        return question.answers;
      }

      const answers = await prisma.answer.findMany({
        where: { questionId: question.id },
      });

      return answers.map((answer) => ({
        id: answer.id,
        text: answer.text,
        isCorrect: answer.isCorrect,
      }));
    },
  },
};
