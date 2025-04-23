import { PrismaClient } from '@prisma/client';  // Utilisation de l'importation ES6
const prisma = new PrismaClient();

export default {
  async getAll() {
    return await prisma.university.findMany({
      select: { idUni: true, nomUni: true }, // Sélection des champs nécessaires
    });
  },
  async getUniversitiesWithAccount ()  {
      return await prisma.university.findMany({
        select: {
          idUni: true,
          nomUni: true,
          adresseUni: true,
          telephoneUni: true,
          emailUni: true,
          walletAddress: true,
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
      })}, 
      async findUniversityById  (universityId)  {
        return await prisma.university.findUnique({
          where: {
            idUni: parseInt(universityId)
          },
          select: {
            idUni: true,
            nomUni: true,
            adresseUni: true,
            telephoneUni: true,
            emailUni: true,
            walletAddress: true,
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
      }
};
