import { PrismaClient } from '@prisma/client';  // Utilisation de l'importation ES6
const prisma = new PrismaClient();

export default {
  async getAll() {
    return await prisma.anneeUniversitaire.findMany({
        orderBy: { annee: 'desc' },
        select: { idAnnee: true, annee: true, isCurrent: true }
    });
  }
};
