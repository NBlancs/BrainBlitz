import prisma from "../lib/prisma.js";

type SubmittedAnswer = {
  questionId: string;
  answerId?: string | null;
  responseTimeMs: number;
};

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

      const uniqueQuestionIds = [...new Set(answers.map((entry) => entry.questionId))];
      const questions = await prisma.question.findMany({
        where: {
          id: { in: uniqueQuestionIds },
          categoryId,
        },
        include: { answers: true },
      });

      if (questions.length !== uniqueQuestionIds.length) {
        throw new Error("One or more submitted questions do not belong to this category.");
      }

      const answerLookup = new Map(
        questions.map((question) => [
          question.id,
          new Map(
            question.answers.map((answer) => [answer.id, { isCorrect: answer.isCorrect }])
          ),
        ])
      );

      let totalResponseTimeMs = 0;
      let correctAnswers = 0;

      for (const entry of answers) {
        const clampedResponseTime = Math.min(Math.max(entry.responseTimeMs, 0), 15000);
        totalResponseTimeMs += clampedResponseTime;

        if (!entry.answerId) {
          continue;
        }

        const questionAnswerMap = answerLookup.get(entry.questionId);
        const selectedAnswer = questionAnswerMap?.get(entry.answerId);
        if (selectedAnswer?.isCorrect) {
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
