/*
  Warnings:

  - Added the required column `proposedBudget` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Made the column `coverNote` on table `applications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "aiNote" TEXT,
ADD COLUMN     "proposedBudget" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "coverNote" SET NOT NULL;
