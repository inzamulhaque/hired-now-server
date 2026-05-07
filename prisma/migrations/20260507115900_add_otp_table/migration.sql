-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- CreateTable
CREATE TABLE "otp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "OtpType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "otp_userId_idx" ON "otp"("userId");

-- CreateIndex
CREATE INDEX "otp_code_idx" ON "otp"("code");

-- CreateIndex
CREATE INDEX "otp_type_idx" ON "otp"("type");

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
