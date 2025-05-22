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
async getByDepartment(departmentId) {
  return await prisma.etudiant.findMany({
    where: {
      CursusUniversitaire: {
        some: { idDepart: parseInt(departmentId) }
      }
    },
    include: {
      CursusUniversitaire: true
    }
  });
},

async create(studentData) {
  return await prisma.etudiant.create({
    data: {
      ...studentData,
      CursusUniversitaire: {
        create: studentData.CursusUniversitaire
      }
    },
    include: {
      CursusUniversitaire: true
    }
  });
},

async update(id, studentData) {
  return await prisma.etudiant.update({
    where: { idEtudiant: parseInt(id) },
    data: studentData
  });
},

   async deleteStudent(id) {
    const parsedId = parseInt(id);
    
    return await prisma.$transaction([
      // 1. Supprimer les diplômes associés
      prisma.diplome.deleteMany({
        where: { etudiantId: parsedId }
      }),
      
      // 2. Supprimer les cursus universitaires associés
      prisma.cursusUniversitaire.deleteMany({
        where: { idEtudiant: parsedId }
      }),
      
      // 3. Supprimer l'étudiant
      prisma.etudiant.delete({
        where: { idEtudiant: parsedId }
      })
    ]);
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
