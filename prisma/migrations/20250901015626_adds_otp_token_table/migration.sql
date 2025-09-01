-- CreateEnum
CREATE TYPE "public"."RecipientType" AS ENUM ('email', 'sms');

-- CreateTable
CREATE TABLE "public"."otp_tokens" (
    "id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "recipient_type" "public"."RecipientType" NOT NULL,
    "recipient_value" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_recipient_type_value" ON "public"."otp_tokens"("recipient_type", "recipient_value");
