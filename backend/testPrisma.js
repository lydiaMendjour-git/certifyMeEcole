import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPrisma() {
  try {
    console.log("🔍 Test Prisma : récupération des étudiants...");
    const students = await prisma.etudiant.findMany({
        include: {
          CursusUniversitaire: true, // Pas besoin de `select`
        },
      });
      

    console.log("✅ Étudiants récupérés :", students);
  } catch (error) {
    console.error("❌ Erreur Prisma dans testPrisma.js :", error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
