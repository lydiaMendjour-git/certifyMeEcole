/*
  Warnings:

  - A unique constraint covering the columns `[walletAddress]` on the table `University` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId]` on the table `University` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `University` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('UNIVERSITY', 'STUDENT', 'ECOLE');

-- CreateEnum
CREATE TYPE "RoleEcole" AS ENUM ('PRIVEE', 'PROFESSIONNEL', 'FORMATION');

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "accountId" INTEGER NOT NULL,
ADD COLUMN     "walletAddress" TEXT,
ADD COLUMN     "walletIV" TEXT NOT NULL DEFAULT 'initial_iv_value',
ADD COLUMN     "walletPrivateKey" TEXT;

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "University_OFFICIAL" (
    "idUni" SERIAL NOT NULL,
    "nomUni" TEXT NOT NULL,
    "adresseUni" TEXT NOT NULL,
    "telephoneUni" TEXT NOT NULL,
    "emailUni" TEXT NOT NULL,

    CONSTRAINT "University_OFFICIAL_pkey" PRIMARY KEY ("idUni")
);

-- CreateTable
CREATE TABLE "Ecole" (
    "idEcole" SERIAL NOT NULL,
    "nomEcole" TEXT NOT NULL,
    "telephoneEcole" TEXT NOT NULL,
    "emailEcole" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,
    "role" "RoleEcole" NOT NULL,

    CONSTRAINT "Ecole_pkey" PRIMARY KEY ("idEcole")
);

-- CreateTable
CREATE TABLE "Ecole_OFFICIAL" (
    "idEcole" SERIAL NOT NULL,
    "nomEcole" TEXT NOT NULL,
    "telephoneEcole" TEXT NOT NULL,
    "emailEcole" TEXT NOT NULL,
    "role" "RoleEcole" NOT NULL,

    CONSTRAINT "Ecole_OFFICIAL_pkey" PRIMARY KEY ("idEcole")
);

-- CreateTable
CREATE TABLE "Etudiant_account" (
    "idEtudiant" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "Etudiant_account_pkey" PRIMARY KEY ("idEtudiant")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_verificationToken_key" ON "Account"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "University_OFFICIAL_emailUni_key" ON "University_OFFICIAL"("emailUni");

-- CreateIndex
CREATE UNIQUE INDEX "Ecole_emailEcole_key" ON "Ecole"("emailEcole");

-- CreateIndex
CREATE UNIQUE INDEX "Ecole_accountId_key" ON "Ecole"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Ecole_OFFICIAL_emailEcole_key" ON "Ecole_OFFICIAL"("emailEcole");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_account_email_key" ON "Etudiant_account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_account_telephone_key" ON "Etudiant_account"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_account_accountId_key" ON "Etudiant_account"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "University_walletAddress_key" ON "University"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "University_accountId_key" ON "University"("accountId");

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ecole" ADD CONSTRAINT "Ecole_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant_account" ADD CONSTRAINT "Etudiant_account_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
