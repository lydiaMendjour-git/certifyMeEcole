/*
  Warnings:

  - Added the required column `anneediplome` to the `AnneeUniversitaire` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnneeUniversitaire" ADD COLUMN     "anneediplome" INTEGER NOT NULL,
ALTER COLUMN "annee" SET DATA TYPE TEXT;
