// models/StudentMinistry.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
    async findMatchingStudents(etudiants) {
      if (!etudiants || etudiants.length === 0) return [];
  
      console.log("🟡 Étudiants reçus pour recherche ministère :", etudiants);
  
      const conditions = etudiants.map((e) => ({
        email: e.email,
        matricule: e.matricule,
      }));
  
      console.log("🔵 Conditions OR pour Prisma :", conditions);
  
      const result = await prisma.etudiantMinistere.findMany({
        where: {
          OR: conditions,
        },
      });
  
      console.log("🟢 Résultat de la recherche dans ministère :", result);
  
      return result;
    },
  };