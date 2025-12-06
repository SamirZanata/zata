/*
  Warnings:

  - You are about to drop the column `certificateExp` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `certificatePass` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `certificatePfx` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `municipalInsc` on the `companies` table. All the data in the column will be lost.
  - Added the required column `email` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaxRegime" AS ENUM ('MEI', 'SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO');

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "certificateExp",
DROP COLUMN "certificatePass",
DROP COLUMN "certificatePfx",
DROP COLUMN "municipalInsc",
ADD COLUMN     "certificateExpiry" TIMESTAMP(3),
ADD COLUMN     "certificatePasswordContent" TEXT,
ADD COLUMN     "certificatePasswordIv" TEXT,
ADD COLUMN     "certificateStoragePath" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "municipalRegistration" TEXT,
ADD COLUMN     "taxRegime" "TaxRegime" NOT NULL DEFAULT 'MEI',
ALTER COLUMN "tradeName" DROP NOT NULL,
ALTER COLUMN "addressZip" DROP NOT NULL,
ALTER COLUMN "addressStreet" DROP NOT NULL,
ALTER COLUMN "addressNumber" DROP NOT NULL,
ALTER COLUMN "addressCity" DROP NOT NULL,
ALTER COLUMN "addressState" DROP NOT NULL;
