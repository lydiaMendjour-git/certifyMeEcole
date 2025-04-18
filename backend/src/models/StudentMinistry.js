// models/StudentMinistry.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  async findMatchingStudents(etudiants) {
    // Si le tableau est vide, inutile de requêter la base
    if (!etudiants || etudiants.length === 0) return [];

    // On construit la clause OR avec les paires email+matricule
    const conditions = etudiants.map((e) => ({
      email: e.email,
      matricule: e.matricule,
    }));

    return await prisma.etudiantMinistere.findMany({
      where: {
        OR: conditions,
      },
    });
  },
};