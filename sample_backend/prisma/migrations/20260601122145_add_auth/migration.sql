/*
  Warnings:

  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHash" TEXT NOT NULL DEFAULT '$2a$10$DKN19M9bmdQWp27J9N27O.uNox9Lgq.9d9B6Wq0D.E.C37qT.6bS2';
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP DEFAULT;
