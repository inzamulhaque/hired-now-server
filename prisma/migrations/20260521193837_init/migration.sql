/*
  Warnings:

  - You are about to drop the column `application_id` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[applicationId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `applicationId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_application_id_fkey";

-- DropIndex
DROP INDEX "payments_application_id_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "application_id",
ADD COLUMN     "applicationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_applicationId_key" ON "payments"("applicationId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
