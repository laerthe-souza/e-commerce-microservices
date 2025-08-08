-- CreateEnum
CREATE TYPE "DeathMessageStatus" AS ENUM ('pending', 'success', 'processing', 'error');

-- CreateTable
CREATE TABLE "death_messages" (
    "id" UUID NOT NULL,
    "routing_key" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "trace_id" TEXT,
    "iv" TEXT NOT NULL,
    "auth_tag" TEXT NOT NULL,
    "encrypted_content" TEXT NOT NULL,
    "status" "DeathMessageStatus" NOT NULL DEFAULT 'pending',
    "success_at" TIMESTAMP(3),
    "service_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "death_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "death_messages_created_at_idx" ON "death_messages"("created_at" DESC);
