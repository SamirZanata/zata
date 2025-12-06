/*
  Warnings:

  - Added the required column `password` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "password" TEXT NOT NULL;
