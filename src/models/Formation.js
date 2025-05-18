import { prisma } from "../prismaClient.js";

export default {
  async getAll() {
    return await prisma.formation.findMany();
  },

  async getByEcole(ecoleId) {
    return await prisma.formation.findMany({
      where: { ecoleId: parseInt(ecoleId) },
      select: { idFormation: true, nomFormation: true, duree: true, typeFormation: true },
    });
  },

  async createMany(formations) {
    return await prisma.$transaction(async (prisma) => {
      for (const formation of formations) {
        const existing = await prisma.formation.findFirst({
          where: { 
            nomFormation: formation.nomFormation, 
            ecoleId: formation.ecoleId 
          },
        });
        if (!existing) {
          await prisma.formation.create({ data: formation });
        }
      }
    });
  },
  
  async create(formationData) {
    return prisma.formation.create({
      data: {
        nomFormation: formationData.nomFormation,
        duree: formationData.duree || '',
        typeFormation: formationData.typeFormation || '',
        ecoleId: parseInt(formationData.ecoleId)
      }
    });
  },

  async update(id, newData) {
    return prisma.formation.update({
      where: { idFormation: parseInt(id) },
      data: { 
        nomFormation: newData.nomFormation,
        duree: newData.duree,
        typeFormation: newData.typeFormation
      }
    });
  },

  async delete(id) {
    return prisma.formation.delete({
      where: { idFormation: parseInt(id) }
    });
  }
};