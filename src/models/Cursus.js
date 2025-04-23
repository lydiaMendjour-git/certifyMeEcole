import { prisma } from "../prismaClient.js"; // Mets Prisma dans un fichier séparé


export default {
  async getStudentByMatricule(matricule) {
    try {
      return await prisma.etudiant.findUnique({
        where: { matricule },
        include: {
          CursusUniversitaire: true, // Inclut les données de cursus associées
        },
      });
    } catch (error) {
      console.error("Erreur getStudentByMatricule:", error);
      throw new Error("Impossible de récupérer l'étudiant par matricule.");
    }
  },
  async getSpecialties(departmentId) {
    try {
      return await prisma.cursusUniversitaire.findMany({
        where: { idDepart: parseInt(departmentId) },
        select: { specialite: true },
        distinct: ['specialite'],
      });
    } catch (error) {
      console.error("Erreur getSpecialties:", error);
      throw new Error("Impossible de récupérer les spécialités.");
    }
  },

  async getLevels(specialty) {
    try {
      return await prisma.cursusUniversitaire.findMany({
        where: { specialite: specialty },
        select: { niveau: true },
        distinct: ['niveau'],
      });
    } catch (error) {
      console.error("Erreur getLevels:", error);
      throw new Error("Impossible de récupérer les niveaux.");
    }
  },

  async getSections(level) {
    try {
      return await prisma.cursusUniversitaire.findMany({
        where: { niveau: parseInt(level) },
        select: { section: true },
        distinct: ['section'],
      });
    } catch (error) {
      console.error("Erreur getSections:", error);
      throw new Error("Impossible de récupérer les sections.");
    }
  }, async getStudentsWithCursus() {
    try {
      console.log("Début de la requête Prisma pour récupérer les étudiants...");

      const students = await prisma.etudiant.findMany({
        include: {
          CursusUniversitaire: true, // Pas besoin de `select`
        },
      });
      

      console.log(`Requête réussie, ${students.length} étudiants récupérés.`);
      return students;
    } catch (error) {
      console.error("❌ Erreur Prisma :", error);  // Affiche l'erreur complète
      throw new Error("Impossible de récupérer les étudiants avec leur cursus.");
    }
}

  
  
};
