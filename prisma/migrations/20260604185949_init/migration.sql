/*
  Warnings:

  - You are about to drop the column `userId` on the `conversations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_userId_fkey";

-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "userId";
