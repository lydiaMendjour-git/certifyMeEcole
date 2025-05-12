-- CreateTable
CREATE TABLE "HistoriqueVerification" (
    "id" SERIAL NOT NULL,
    "idEtudiant" INTEGER NOT NULL,
    "nomEtudiant" TEXT NOT NULL,
    "lienVerification" TEXT NOT NULL,
    "titreDiplome" TEXT NOT NULL,
    "etablissement" TEXT NOT NULL,
    "dateDemande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateDernierAcces" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoriqueVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HistoriqueVerification_idEtudiant_idx" ON "HistoriqueVerification"("idEtudiant");
