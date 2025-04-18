import { prisma } from "../prismaClient.js"; // Mets Prisma dans un fichier séparé

export default {
  async getByFaculty(facultyId) {
    try {
      return await prisma.department.findMany({
        where: { idFaculty: parseInt(facultyId) }
      });
    } catch (error) {
      console.error("Erreur Prisma getByFaculty :", error);
      throw new Error("Impossible de récupérer les départements.");
    }
  },
  async createMany(departments) {
    return await prisma.$transaction(async (prisma) => {
      for (const dept of departments) {
        const exists = await prisma.department.findFirst({
          where: { nomDepart: dept.nomDepart, idFaculty: dept.idFaculty },
        });
        if (!exists) {
          await prisma.department.create({ data: dept });
        }
      }
    });
  },
};