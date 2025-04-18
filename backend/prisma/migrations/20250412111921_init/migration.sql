-- CreateEnum
CREATE TYPE "DiplomaType" AS ENUM ('Universite', 'EcolePrivee', 'EcoleProfessionnelle');

-- CreateTable
CREATE TABLE "University" (
    "idUni" SERIAL NOT NULL,
    "nomUni" TEXT NOT NULL,
    "adresseUni" TEXT NOT NULL,
    "telephoneUni" TEXT NOT NULL,
    "emailUni" TEXT NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("idUni")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "idFaculty" SERIAL NOT NULL,
    "nomFaculty" TEXT NOT NULL,
    "idUni" INTEGER NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("idFaculty")
);

-- CreateTable
CREATE TABLE "Department" (
    "idDepart" SERIAL NOT NULL,
    "nomDepart" TEXT NOT NULL,
    "idFaculty" INTEGER NOT NULL,
    "idUni" INTEGER NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("idDepart")
);

-- CreateTable
CREATE TABLE "Etudiant" (
    "idEtudiant" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "matricule" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "lieuNaissance" TEXT NOT NULL,

    CONSTRAINT "Etudiant_pkey" PRIMARY KEY ("idEtudiant")
);

-- CreateTable
CREATE TABLE "EtudiantMinistere" (
    "idEtudiantMinistere" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "matricule" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "lieuNaissance" TEXT NOT NULL,

    CONSTRAINT "EtudiantMinistere_pkey" PRIMARY KEY ("idEtudiantMinistere")
);

-- CreateTable
CREATE TABLE "Diplome" (
    "id" SERIAL NOT NULL,
    "diplomaHash" TEXT NOT NULL,
    "etablissement" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "diplomaTitle" TEXT NOT NULL,
    "diplomaType" "DiplomaType" NOT NULL,
    "dateOfIssue" TIMESTAMP(3) NOT NULL,
    "speciality" TEXT NOT NULL,
    "complete" BOOLEAN NOT NULL,
    "etudiantId" INTEGER NOT NULL,

    CONSTRAINT "Diplome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CursusUniversitaire" (
    "id" SERIAL NOT NULL,
    "section" TEXT NOT NULL,
    "groupe" TEXT NOT NULL,
    "filiere" TEXT NOT NULL,
    "idFaculty" INTEGER,
    "idDepart" INTEGER,
    "specialite" TEXT,
    "moyenneAnnuelle" DOUBLE PRECISION,
    "idAnnee" INTEGER NOT NULL,
    "niveau" INTEGER NOT NULL,
    "idEtudiant" INTEGER NOT NULL,

    CONSTRAINT "CursusUniversitaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnneeUniversitaire" (
    "idAnnee" SERIAL NOT NULL,
    "annee" INTEGER NOT NULL,
    "isCurrent" BOOLEAN NOT NULL,

    CONSTRAINT "AnneeUniversitaire_pkey" PRIMARY KEY ("idAnnee")
);

-- CreateIndex
CREATE UNIQUE INDEX "University_emailUni_key" ON "University"("emailUni");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_email_key" ON "Etudiant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_matricule_key" ON "Etudiant"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_telephone_key" ON "Etudiant"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "EtudiantMinistere_email_key" ON "EtudiantMinistere"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EtudiantMinistere_matricule_key" ON "EtudiantMinistere"("matricule");

-- CreateIndex
CREATE INDEX "Diplome_etudiantId_idx" ON "Diplome"("etudiantId");

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_idUni_fkey" FOREIGN KEY ("idUni") REFERENCES "University"("idUni") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_idFaculty_fkey" FOREIGN KEY ("idFaculty") REFERENCES "Faculty"("idFaculty") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_idUni_fkey" FOREIGN KEY ("idUni") REFERENCES "University"("idUni") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diplome" ADD CONSTRAINT "Diplome_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("idEtudiant") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursusUniversitaire" ADD CONSTRAINT "CursusUniversitaire_idFaculty_fkey" FOREIGN KEY ("idFaculty") REFERENCES "Faculty"("idFaculty") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursusUniversitaire" ADD CONSTRAINT "CursusUniversitaire_idDepart_fkey" FOREIGN KEY ("idDepart") REFERENCES "Department"("idDepart") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursusUniversitaire" ADD CONSTRAINT "CursusUniversitaire_idAnnee_fkey" FOREIGN KEY ("idAnnee") REFERENCES "AnneeUniversitaire"("idAnnee") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursusUniversitaire" ADD CONSTRAINT "CursusUniversitaire_idEtudiant_fkey" FOREIGN KEY ("idEtudiant") REFERENCES "Etudiant"("idEtudiant") ON DELETE RESTRICT ON UPDATE CASCADE;
