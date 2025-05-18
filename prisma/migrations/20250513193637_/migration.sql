-- AlterTable
ALTER TABLE "Formation" ADD COLUMN     "ecoleAnneeId" INTEGER,
ALTER COLUMN "duree" DROP NOT NULL;

-- CreateTable
CREATE TABLE "EcoleAnnee" (
    "id" SERIAL NOT NULL,
    "annee" TEXT NOT NULL,
    "anneediplome" INTEGER NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "ecoleId" INTEGER NOT NULL,

    CONSTRAINT "EcoleAnnee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EcoleAnnee_annee_ecoleId_key" ON "EcoleAnnee"("annee", "ecoleId");

-- AddForeignKey
ALTER TABLE "Formation" ADD CONSTRAINT "Formation_ecoleAnneeId_fkey" FOREIGN KEY ("ecoleAnneeId") REFERENCES "EcoleAnnee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EcoleAnnee" ADD CONSTRAINT "EcoleAnnee_ecoleId_fkey" FOREIGN KEY ("ecoleId") REFERENCES "Ecole"("idEcole") ON DELETE RESTRICT ON UPDATE CASCADE;
