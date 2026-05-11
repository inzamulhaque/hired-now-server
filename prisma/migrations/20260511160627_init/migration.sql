/*
  Warnings:

  - You are about to drop the column `user_id` on the `freelancer_profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `freelancer_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `freelancer_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "freelancer_profiles" DROP CONSTRAINT "freelancer_profiles_user_id_fkey";

-- DropIndex
DROP INDEX "freelancer_profiles_user_id_key";

-- AlterTable
ALTER TABLE "freelancer_profiles" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "freelancer_profiles_userId_key" ON "freelancer_profiles"("userId");

-- AddForeignKey
ALTER TABLE "freelancer_profiles" ADD CONSTRAINT "freelancer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
