import prisma from "../lib/prisma.js";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "brainblitz-super-secret-key-123";

function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });
}

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
  books: 10,
  film: 11,
  music: 12,
  television: 14,
  "video games": 15,
  mythology: 20,
  sports: 21,
  art: 25,
  animals: 27,
  vehicles: 28,
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

function computeBadge(totalPoints: number): "BRONZE" | "SILVER" | "GOLD" | "SCHOLAR" {
  if (totalPoints >= 30001) return "SCHOLAR";
  if (totalPoints >= 20001) return "GOLD";
  if (totalPoints >= 10001) return "SILVER";
  return "BRONZE";
}

async function getLocalQuestions(
  categoryId: string,
  difficulty: "EASY" | "MEDIUM" | "HARD",
  country: "PHILIPPINES" | "UNITED_STATES" | "GREAT_BRITAIN" | "CHINA" | "JAPAN" | "SOUTH_KOREA"
) {
  // 1. Fetch questions matching country, categoryId, and difficulty
  const primaryQuestions = await prisma.question.findMany({
    where: {
      categoryId,
      country: country as any,
      difficulty: difficulty as any,
    },
    include: { answers: true },
  });

  let selectedQuestions = [...primaryQuestions];

  // 2. Fallback A: Match categoryId and country (other difficulties)
  if (selectedQuestions.length < 10) {
    const remainingCount = 10 - selectedQuestions.length;
    const primaryIds = selectedQuestions.map((q) => q.id);
    const difficultyFallback = await prisma.question.findMany({
      where: {
        categoryId,
        country: country as any,
        id: { notIn: primaryIds },
      },
      include: { answers: true },
      take: remainingCount,
    });
    selectedQuestions = [...selectedQuestions, ...difficultyFallback];
  }

  // 3. Fallback B: If still less than 10 (defensive), match categoryId and difficulty (any country)
  if (selectedQuestions.length < 10) {
    const remainingCount = 10 - selectedQuestions.length;
    const primaryIds = selectedQuestions.map((q) => q.id);
    const countryFallback = await prisma.question.findMany({
      where: {
        categoryId,
        difficulty: difficulty as any,
        id: { notIn: primaryIds },
      },
      include: { answers: true },
      take: remainingCount,
    });
    selectedQuestions = [...selectedQuestions, ...countryFallback];
  }

  // 4. Fallback C: If still less than 10 (defensive), match categoryId (any country, any difficulty)
  if (selectedQuestions.length < 10) {
    const remainingCount = 10 - selectedQuestions.length;
    const primaryIds = selectedQuestions.map((q) => q.id);
    const absoluteFallback = await prisma.question.findMany({
      where: {
        categoryId,
        id: { notIn: primaryIds },
      },
      include: { answers: true },
      take: remainingCount,
    });
    selectedQuestions = [...selectedQuestions, ...absoluteFallback];
  }

  // Shuffle selected questions list and their answers
  return shuffle(selectedQuestions).map((question) => ({
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
    me: async (_root: unknown, _args: unknown, context: { userId?: string }) => {
      if (!context.userId) return null;
      return prisma.user.findUnique({ where: { id: context.userId } });
    },
    getCategories: async () => {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { questions: true },
          },
        },
      });

      return shuffle(categories).map((category) => ({
        ...category,
        questionCount: category._count.questions,
      }));
    },

    getQuestions: async (
      _root: unknown,
      {
        categoryId,
        difficulty,
        country,
      }: {
        categoryId: string;
        difficulty: "EASY" | "MEDIUM" | "HARD";
        country: "PHILIPPINES" | "UNITED_STATES" | "GREAT_BRITAIN" | "CHINA" | "JAPAN" | "SOUTH_KOREA";
      }
    ) => {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new Error("Category not found.");
      }

      // Always return country-specific local questions
      return getLocalQuestions(categoryId, difficulty, country);
    },

    getLeaderboard: async (
      _root: unknown,
      { categoryId }: { categoryId: string }
    ) => {
      if (categoryId === "overall") {
        const topUsers = await prisma.user.findMany({
          orderBy: [
            { totalPoints: "desc" },
            { createdAt: "asc" },
          ],
          take: 20,
        });

        return topUsers.map((user, idx) => ({
          rank: idx + 1,
          user,
          points: user.totalPoints,
          createdAt: user.createdAt.toISOString(),
        }));
      }

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
        LIMIT 20
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
    register: async (
      _root: unknown,
      { username, password, name, age }: { username: string; password: string; name: string; age: number }
    ) => {
      const normalizedUsername = username.trim().toLowerCase();
      const normalizedName = name.trim();

      if (!normalizedUsername) throw new Error("Username cannot be empty.");
      if (!password || password.length < 6) throw new Error("Password must be at least 6 characters.");
      if (!normalizedName) throw new Error("Name cannot be empty.");
      if (age < 1 || age > 120) throw new Error("Age must be between 1 and 120.");

      let ageGroup: "KIDS" | "TEEN" | "ADULT" = "ADULT";
      if (age <= 12) {
        ageGroup = "KIDS";
      } else if (age >= 13 && age <= 17) {
        ageGroup = "TEEN";
      }

      const existing = await prisma.user.findUnique({ where: { username: normalizedUsername } });
      if (existing) {
        throw new Error("Username is already taken.");
      }

      const passwordHash = bcrypt.hashSync(password, 10);

      const user = await prisma.user.create({
        data: {
          username: normalizedUsername,
          passwordHash,
          name: normalizedName,
          age,
          ageGroup,
          totalPoints: 0,
          badge: "BRONZE",
        },
      });

      const token = generateToken(user.id);
      return { token, user };
    },

    login: async (
      _root: unknown,
      { username, password }: { username: string; password: string }
    ) => {
      const normalizedUsername = username.trim().toLowerCase();
      const user = await prisma.user.findUnique({ where: { username: normalizedUsername } });
      if (!user) {
        throw new Error("Invalid username or password.");
      }

      const isMatch = bcrypt.compareSync(password, user.passwordHash);
      if (!isMatch) {
        throw new Error("Invalid username or password.");
      }

      const token = generateToken(user.id);
      return { token, user };
    },

    createUser: async (
      _root: unknown,
      { username, name, age }: { username: string; name: string; age: number }
    ) => {
      const normalizedUsername = username.trim();
      const normalizedName = name.trim();

      if (!normalizedUsername) {
        throw new Error("Username cannot be empty.");
      }
      if (!normalizedName) {
        throw new Error("Name cannot be empty.");
      }
      if (age < 1 || age > 120) {
        throw new Error("Age must be between 1 and 120.");
      }

      let ageGroup: "KIDS" | "TEEN" | "ADULT" = "ADULT";
      if (age <= 12) {
        ageGroup = "KIDS";
      } else if (age >= 13 && age <= 17) {
        ageGroup = "TEEN";
      }

      return prisma.user.create({
        data: {
          username: normalizedUsername,
          passwordHash: bcrypt.hashSync("password123", 10),
          name: normalizedName,
          age,
          ageGroup,
          totalPoints: 0,
          badge: "BRONZE",
        },
      }).catch(async (error: unknown) => {
        const message = error instanceof Error ? error.message : "";
        if (!message.includes("Unique constraint")) {
          throw error;
        }

        const existing = await prisma.user.findUnique({ where: { username: normalizedUsername } });
        if (!existing) {
          throw error;
        }

        return prisma.user.update({
          where: { id: existing.id },
          data: {
            name: normalizedName,
            age,
            ageGroup,
          },
        });
      });
    },

    submitScore: async (
      _root: unknown,
      {
        userId,
        categoryId,
        answers,
      }: { userId: string; categoryId: string; answers: SubmittedAnswer[] },
      context: { userId?: string }
    ) => {
      if (!context.userId || context.userId !== userId) {
        throw new Error("Unauthorized score submission. Please log in.");
      }
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

      // Update user's total points and badge tier
      const updatedUser = await prisma.user.findUnique({ where: { id: userId } });
      if (updatedUser) {
        const newTotal = updatedUser.totalPoints + points;
        const newBadge = computeBadge(newTotal);
        await prisma.user.update({
          where: { id: userId },
          data: {
            totalPoints: newTotal,
            badge: newBadge,
          },
        });
      }

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
