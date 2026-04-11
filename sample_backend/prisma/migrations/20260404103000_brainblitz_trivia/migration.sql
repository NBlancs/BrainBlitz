-- Drop old tap-velocity table and related index
DROP TABLE IF EXISTS "Game" CASCADE;

-- Create trivia domain tables
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" TEXT NOT NULL,
    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "speedBonus" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- Constraints
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE INDEX "Category_name_idx" ON "Category"("name");

CREATE INDEX "Question_categoryId_idx" ON "Question"("categoryId");
CREATE INDEX "Answer_questionId_idx" ON "Answer"("questionId");

CREATE INDEX "Score_categoryId_points_idx" ON "Score"("categoryId", "points" DESC);
CREATE INDEX "Score_userId_idx" ON "Score"("userId");
CREATE INDEX "Score_createdAt_idx" ON "Score"("createdAt" DESC);

ALTER TABLE "Question"
  ADD CONSTRAINT "Question_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Answer"
  ADD CONSTRAINT "Answer_questionId_fkey"
  FOREIGN KEY ("questionId") REFERENCES "Question"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Score"
  ADD CONSTRAINT "Score_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Score"
  ADD CONSTRAINT "Score_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
