import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export default {
  async getStudentsByAnnee(idAnnee) {
    return await prisma.etudiant.findMany({
      where: {
        CursusUniversitaire: {
          some: { idAnnee: parseInt(idAnnee) }
        }
      },
      include: {
        CursusUniversitaire: {
          where: { idAnnee: parseInt(idAnnee) }
        }
      }
    });
  },
  async creerDiplomesPourEtudiants(ids, titre, specialite, type) {
    const diplomes = [];

    for (const id of ids) {
      const etudiant = await prisma.etudiant.findUnique({
        where: { idEtudiant: id }
      });

      if (!etudiant) continue;

      const studentName = `${etudiant.nom} ${etudiant.prenom}`;
      const dateOfIssue = new Date();
      const diplomaData = {
        etablissement: "usthb",
        studentName,
        birthDate: etudiant.dateNaissance,
        diplomaTitle: titre,
        diplomaType: type,
        dateOfIssue,
        speciality: specialite,
        complete: false,
        etudiantId: id
      };

      // Création du hash
      const hashString = `${studentName}|${etudiant.dateNaissance.toISOString()}|${titre}|${type}|${specialite}|${dateOfIssue.toISOString()}`;
      const diplomaHash = crypto.createHash('sha256').update(hashString).digest('hex');

      const createdDiploma = await prisma.diplome.create({
        data: {
          ...diplomaData,
          diplomaHash
        }
      });

      diplomes.push(createdDiploma);
    }

    return diplomes;
  }
};
