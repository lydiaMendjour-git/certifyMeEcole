import { prisma } from "../prismaClient.js";
import crypto from 'crypto';

export default {
  async getAll() {
    return await prisma.etudiantEcole.findMany({
      include: {
        formation: true
      }
    });
  },

  async getByFormation(formationId) {
    return await prisma.etudiantEcole.findMany({
      where: { formationId: parseInt(formationId) },
      include: {
        formation: {
          select: {
            nomFormation: true
          }
        }
      }
    });
  },

  async createMany(students) {
    return await prisma.$transaction(async (prisma) => {
      for (const student of students) {
        await this.upsertStudent(student);
      }
    });
  },

  async upsertStudent(studentData) {
    return prisma.etudiantEcole.upsert({
      where: { email: studentData.email },
      create: studentData,
      update: studentData
    });
  },

  async create(studentData) {
    return prisma.etudiantEcole.create({
      data: {
        nom: studentData.nom,
        prenom: studentData.prenom,
        email: studentData.email,
        matricule: studentData.matricule,
        telephone: studentData.telephone || '',
        moyenne: studentData.moyenne ? parseFloat(studentData.moyenne) : null,
        formationId: parseInt(studentData.formationId)
      }
    });
  },

  async update(id, newData) {
    return prisma.etudiantEcole.update({
      where: { idEtudiantEcole: parseInt(id) },
      data: newData
    });
  },

  async delete(id) {
    return prisma.etudiantEcole.delete({
      where: { idEtudiantEcole: parseInt(id) }
    });
  },

  async creerDiplomesPourEtudiants(ids, titre, specialite, type) {
    const diplomes = [];

    for (const id of ids) {
      const etudiant = await prisma.etudiantEcole.findUnique({
        where: { idEtudiantEcole: id }
      });

      if (!etudiant) continue;

      const studentName = `${etudiant.nom} ${etudiant.prenom}`;
      const dateOfIssue = new Date();
      const diplomaData = {
        etablissement: etudiant.formation.ecole.nomEcole,
        studentName,
        birthDate: etudiant.dateNaissance || new Date(),
        diplomaTitle: titre,
        diplomaType: type,
        dateOfIssue,
        speciality: specialite,
        complete: false,
        etudiantEcoleId: id
      };

      // Création du hash
      const hashString = `${studentName}|${diplomaData.birthDate.toISOString()}|${titre}|${type}|${specialite}|${dateOfIssue.toISOString()}`;
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