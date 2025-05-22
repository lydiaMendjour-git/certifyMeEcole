import { PrismaClient } from '@prisma/client';  // Utilisation de l'importation ES6
const prisma = new PrismaClient();

export default {
  async getAll() {
    return await prisma.ecole_OFFICIAL.findMany({
      select: { idEcole: true, nomEcole: true }, // Sélection des champs nécessaires
    });
  },

  async getEcolesWithAccount() {
    return await prisma.ecole.findMany({
      select: {
        idEcole: true,
        nomEcole: true,
        telephoneEcole: true,
        emailEcole: true,
        role: true,
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
  return await prisma.ecole.findUnique({ // Changez ecole_OFFICIAL par ecole
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
  return await prisma.ecole.findMany({
    where: {
      role: role
    },
    select: {
      idEcole: true,
      nomEcole: true,
      telephoneEcole: true,
      emailEcole: true,
      role: true,
      account: {
        select: {
          id: true,
          username: true,
          email: true,
          isVerified: true,
          role: true
        }
      }
    },
    orderBy: {
      nomEcole: 'asc' // Tri alphabétique
    }
  });
}


};
