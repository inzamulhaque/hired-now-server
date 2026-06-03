/*
  Warnings:

  - You are about to drop the column `jobId` on the `conversations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employerId,freelancerId]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_jobId_fkey";

-- DropIndex
DROP INDEX "conversations_jobId_employerId_freelancerId_key";

-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "jobId";

-- CreateIndex
CREATE UNIQUE INDEX "conversations_employerId_freelancerId_key" ON "conversations"("employerId", "freelancerId");
