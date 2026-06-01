/*
  Warnings:

  - Added the required column `country` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Country" AS ENUM ('PHILIPPINES', 'UNITED_STATES', 'GREAT_BRITAIN', 'CHINA', 'JAPAN', 'SOUTH_KOREA');

-- DropIndex
DROP INDEX "Question_categoryId_idx";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "country" "Country" NOT NULL;

-- CreateIndex
CREATE INDEX "Question_categoryId_country_difficulty_idx" ON "Question"("categoryId", "country", "difficulty");
