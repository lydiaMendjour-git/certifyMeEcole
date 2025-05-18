/*
  Warnings:

  - Added the required column `anneeScolaire` to the `EtudiantEcole` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EtudiantEcole_matricule_key";

-- AlterTable
ALTER TABLE "EtudiantEcole" ADD COLUMN     "anneeScolaire" TEXT NOT NULL,
ADD COLUMN     "telephone" TEXT;
