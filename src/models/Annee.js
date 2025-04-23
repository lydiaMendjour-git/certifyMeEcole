import { PrismaClient } from '@prisma/client';  // Utilisation de l'importation ES6
const prisma = new PrismaClient();

export default {
  async getAll() {
    return await prisma.anneeUniversitaire.findMany({
        orderBy: { annee: 'desc' },
        select: { idAnnee: true, annee: true, isCurrent: true }
    });
  }, 
  async  addAnnee(annee) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // janvier = 0
  
    const regex = /^(\d{4})\/(\d{4})$/;
    const match = annee.match(regex);
  
    if (!match) {
      throw { status: 400, message: "Format de l'année invalide. Utilisez 'YYYY/YYYY'" };
    }
  
    const startYear = parseInt(match[1]);
    const endYear = parseInt(match[2]);
  
    if (endYear !== startYear + 1) {
      throw { status: 400, message: "Les années doivent être consécutives, ex: 2024/2025" };
    }
  
    const validCurrentStartYear = currentMonth >= 8 ? currentYear : currentYear - 1;
  
    if (startYear > validCurrentStartYear) {
      throw { status: 400, message: "Année universitaire invalide pour l'année en cours" };
    }
  
    const existing = await prisma.anneeUniversitaire.findFirst({
      where: { annee },
    });
  
    if (existing) {
      return { alreadyExists: true, data: existing };
    }
  
    await prisma.anneeUniversitaire.updateMany({
      where: { isCurrent: true },
      data: { isCurrent: false },
    });
  
    const newAnnee = await prisma.anneeUniversitaire.create({
      data: {
        annee,
        anneediplome: endYear,
        isCurrent: startYear === validCurrentStartYear,
      },
    });
  
    return { alreadyExists: false, data: newAnnee };
  },
  async getAnneesByUniversity(idUniversity) {
    return await prisma.anneeUniversitaire.findMany({
      where: {
        cursusUniversitaire: {
          some: {
            faculty: {
              idUni: idUniversity  // ✅ correct
            }
          }
        }
      },
      distinct: ['idAnnee'],
      orderBy: {
        annee: 'desc'
      }
    });
  }
};
