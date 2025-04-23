import Cursus from '../models/Cursus.js';

export default {
   // Recherche par matricule
   async getStudentByMatricule(req, res) {
    try {
      const { matricule } = req.params;
      console.log("🔎 Recherche de l'étudiant avec matricule :", matricule);

      const student = await Cursus.getStudentByMatricule(matricule);
      
      if (!student) {
        console.log("⚠️ Aucun étudiant trouvé pour ce matricule");
        return res.status(404).json({ error: "Étudiant non trouvé" });
      }

      console.log("✅ Étudiant trouvé :", student);
      res.json(student);
    } catch (error) {
      console.error("❌ Erreur getStudentByMatricule Controller :", error);
      res.status(500).json({ error: error.message });
    }
  },
  async getSpecialties(req, res) {
    try {
      const { departmentId } = req.params;
      console.log("🔎 Récupération des spécialités pour département :", departmentId);

      const specialties = await Cursus.getSpecialties(departmentId);
      console.log("✅ Spécialités récupérées :", specialties);

      res.json(specialties);
    } catch (error) {
      console.error("❌ Erreur getSpecialties Controller :", error);
      res.status(500).json({ error: error.message });
    }
  }
,

  async getLevels(req, res) {
    try {
      const { specialty } = req.params;
      const levels = await Cursus.getLevels(specialty);
      res.json(levels);
    } catch (error) {
      console.error("Erreur getLevels Controller :", error);
      res.status(500).json({ error: error.message });
    }
  },

  async getSections(req, res) {
    try {
      const { level } = req.params;
      const sections = await Cursus.getSections(level);
      res.json(sections);
    } catch (error) {
      console.error("Erreur getSections Controller :", error);
      res.status(500).json({ error: error.message });
    }
  },
  async getStudentsWithCursus(req, res) {
    try {
      console.log("Requête reçue pour récupérer les étudiants avec cursus.");
      const students = await Cursus.getStudentsWithCursus();
      console.log("Étudiants récupérés :", students);
      res.json(students);
    } catch (error) {
      console.error("Erreur getStudentsWithCursus Controller :", error);
      res.status(500).json({ error: error.message });
    }
  }
  
  
};
