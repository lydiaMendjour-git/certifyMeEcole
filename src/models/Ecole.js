import { PrismaClient } from '@prisma/client';  // Utilisation de l'importation ES6
const prisma = new PrismaClient();

export default {
  async getAll() {
    return await prisma.ecole_OFFICIAL.findMany({
      select: { idEcole: true, nomEcole: true }, // Sélection des champs nécessaires
    });
  },
  async getEcolesWithAccount() {
    return await prisma.ecole_OFFICIAL.findMany({
      select: {
        idEcole: true,
        nomEcole: true,
        telephoneEcole: true,
        emailEcole: true,
        account: {
          select: {
            id: true,
            username: true,
            email: true,
            isVerified: true,
            role: true
          }
        }
      }
    });
  },
  async findEcoleById(ecoleId) {
    return await prisma.ecole_OFFICIAL.findUnique({
      where: {
        idEcole: parseInt(ecoleId)
      },
      select: {
        idEcole: true,
        nomEcole: true,
        telephoneEcole: true,
        emailEcole: true,
        account: {
          select: {
            id: true,
            username: true,
            email: true,
            isVerified: true,
            role: true
          }
        }
      }
    });
  },
  // Dans le fichier Ecole.js
async getEcolesByRole(role) {
  return await prisma.ecole_OFFICIAL.findMany({
    where: {
      roleEcole: role // This should match your database field name
    },
    select: {
      idEcole: true,
      nomEcole: true,
      telephoneEcole: true,
      emailEcole: true,
      roleEcole: true
    }
  });
}


};
