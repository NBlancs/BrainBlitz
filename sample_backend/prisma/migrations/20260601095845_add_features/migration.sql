/*
  Warnings:

  - Added the required column `difficulty` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ageGroup` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('KIDS', 'TEEN', 'ADULT');

-- CreateEnum
CREATE TYPE "Badge" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'SCHOLAR');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "difficulty" "Difficulty" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "ageGroup" "AgeGroup" NOT NULL,
ADD COLUMN     "badge" "Badge" NOT NULL DEFAULT 'BRONZE',
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "totalPoints" INTEGER NOT NULL DEFAULT 0;
