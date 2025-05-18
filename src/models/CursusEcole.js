// models/CursusEcole.js
import { prisma } from "../prismaClient.js";

export default {
  async getStudentByMatricule(matricule, anneeId = null) {
    const where = { matricule };
    
    if (anneeId) {
      where.CursusEcole = {
        some: { anneeId: parseInt(anneeId) }
      };
    }

    return await prisma.etudiantEcole.findFirst({
      where,
      include: {
        Formation: true,
        CursusEcole: {
          where: anneeId ? { anneeId: parseInt(anneeId) } : {},
          include: {
            AnneeScolaire: true
          }
        }
      }
    });
  },

  async getStudentsByFormation(formationId, anneeId) {
    return await prisma.etudiantEcole.findMany({
      where: {
        formationId: parseInt(formationId),
        CursusEcole: {
          some: { anneeId: parseInt(anneeId) }
        }
      },
      include: {
        CursusEcole: {
          where: { anneeId: parseInt(anneeId) }
        }
      }
    });
  },

  async createCursus(data) {
    return await prisma.cursusEcole.create({ data });
  }
};