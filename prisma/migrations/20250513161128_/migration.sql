-- CreateTable
CREATE TABLE "Formation" (
    "idFormation" SERIAL NOT NULL,
    "nomFormation" TEXT NOT NULL,
    "duree" TEXT NOT NULL,
    "typeFormation" TEXT NOT NULL,
    "ecoleId" INTEGER NOT NULL,

    CONSTRAINT "Formation_pkey" PRIMARY KEY ("idFormation")
);

-- CreateTable
CREATE TABLE "EtudiantEcole" (
    "idEtudiantEcole" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "matricule" TEXT NOT NULL,
    "formationId" INTEGER NOT NULL,
    "moyenne" DOUBLE PRECISION,
    "dateInscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EtudiantEcole_pkey" PRIMARY KEY ("idEtudiantEcole")
);

-- CreateIndex
CREATE UNIQUE INDEX "EtudiantEcole_email_key" ON "EtudiantEcole"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EtudiantEcole_matricule_key" ON "EtudiantEcole"("matricule");

-- AddForeignKey
ALTER TABLE "Formation" ADD CONSTRAINT "Formation_ecoleId_fkey" FOREIGN KEY ("ecoleId") REFERENCES "Ecole"("idEcole") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EtudiantEcole" ADD CONSTRAINT "EtudiantEcole_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("idFormation") ON DELETE RESTRICT ON UPDATE CASCADE;
