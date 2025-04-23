-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('DIPLOME_VALIDE', 'DIPLOME_REJETE', 'NOUVELLE_DEMANDE', 'COMPTE_VERIFIE', 'ALERT_GENERAL');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MINISTERE';

-- AlterTable
ALTER TABLE "EtudiantMinistere" ADD COLUMN     "ministereId" INTEGER;

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" "NotificationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receiverId" INTEGER NOT NULL,
    "senderId" INTEGER,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ministere" (
    "id" SERIAL NOT NULL,
    "nomMinistere" TEXT NOT NULL,
    "emailMinistere" TEXT NOT NULL,
    "pays" TEXT,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "Ministere_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ministere_emailMinistere_key" ON "Ministere"("emailMinistere");

-- CreateIndex
CREATE UNIQUE INDEX "Ministere_accountId_key" ON "Ministere"("accountId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EtudiantMinistere" ADD CONSTRAINT "EtudiantMinistere_ministereId_fkey" FOREIGN KEY ("ministereId") REFERENCES "Ministere"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ministere" ADD CONSTRAINT "Ministere_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
