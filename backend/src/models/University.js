import { PrismaClient } from '@prisma/client';  // Utilisation de l'importation ES6
const prisma = new PrismaClient();

export default {
  async getAll() {
    return await prisma.university.findMany({
      select: { idUni: true, nomUni: true }, // Sélection des champs nécessaires
    });
  },
};
