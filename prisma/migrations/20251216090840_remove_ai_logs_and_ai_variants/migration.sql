/*
  Warnings:

  - You are about to drop the `ai_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_variants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ai_logs" DROP CONSTRAINT "ai_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ai_variants" DROP CONSTRAINT "ai_variants_ai_log_id_fkey";

-- DropTable
DROP TABLE "ai_logs";

-- DropTable
DROP TABLE "ai_variants";
