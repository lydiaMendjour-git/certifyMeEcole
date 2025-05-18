-- CreateTable
CREATE TABLE "CursusEcole" (
    "id" SERIAL NOT NULL,
    "moyenne" DOUBLE PRECISION,
    "etudiantId" INTEGER NOT NULL,
    "anneeId" INTEGER NOT NULL,

    CONSTRAINT "CursusEcole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CursusEcole_etudiantId_anneeId_key" ON "CursusEcole"("etudiantId", "anneeId");

-- AddForeignKey
ALTER TABLE "CursusEcole" ADD CONSTRAINT "CursusEcole_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "EtudiantEcole"("idEtudiantEcole") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursusEcole" ADD CONSTRAINT "CursusEcole_anneeId_fkey" FOREIGN KEY ("anneeId") REFERENCES "EcoleAnnee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
