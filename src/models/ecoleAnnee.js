import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  async getAll() {
    return await prisma.ecoleAnnee.findMany({
      orderBy: { annee: 'desc' },
      select: { id: true, annee: true, isCurrent: true, ecoleId: true }
    });
  },

  async addAnnee(annee, ecoleId) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // janvier = 0

    // Validation du format
    const regex = /^(\d{4})\/(\d{4})$/;
    const match = annee.match(regex);

    if (!match) {
      throw { status: 400, message: "Format d'année invalide. Utilisez 'YYYY/YYYY'" };
    }

    const startYear = parseInt(match[1]);
    const endYear = parseInt(match[2]);

    // Vérification des années consécutives
    if (endYear !== startYear + 1) {
      throw { status: 400, message: "Les années doivent être consécutives (ex: 2024/2025)" };
    }

    // Validation de l'année en cours
    const validCurrentStartYear = currentMonth >= 8 ? currentYear : currentYear - 1;
    if (startYear > validCurrentStartYear) {
      throw { status: 400, message: "Année scolaire invalide pour l'année en cours" };
    }

    // Vérification si l'année existe déjà pour cette école
    const existing = await prisma.ecoleAnnee.findFirst({
      where: { annee, ecoleId }
    });

    if (existing) {
      return { alreadyExists: true, data: existing };
    }

    // Désactivation des années courantes existantes pour cette école
    await prisma.ecoleAnnee.updateMany({
      where: { ecoleId, isCurrent: true },
      data: { isCurrent: false }
    });

    // Création de la nouvelle année
    const newAnnee = await prisma.ecoleAnnee.create({
      data: {
        annee,
        anneediplome: endYear,
        isCurrent: startYear === validCurrentStartYear,
        ecoleId
      }
    });

    return { alreadyExists: false, data: newAnnee };
  },

  async getAnneesByEcole(ecoleId) {
    return await prisma.ecoleAnnee.findMany({
      where: { ecoleId },
      orderBy: { annee: 'desc' }
    });
  },

  async setCurrentAnnee(id, ecoleId) {
    // D'abord désactiver toutes les années courantes pour cette école
    await prisma.ecoleAnnee.updateMany({
      where: { ecoleId, isCurrent: true },
      data: { isCurrent: false }
    });

    // Puis activer l'année sélectionnée
    return await prisma.ecoleAnnee.update({
      where: { id },
      data: { isCurrent: true }
    });
  },

  async deleteAnnee(id) {
    return await prisma.ecoleAnnee.delete({
      where: { id }
    });
  }
};