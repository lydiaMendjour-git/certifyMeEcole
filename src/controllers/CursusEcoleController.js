// controllers/CursusEcoleController.js
import { prisma } from '../prismaClient.js';

export default {
 async getStudentByMatricule(req, res) {
    try {
      const { matricule } = req.params;
      console.log("🔎 Recherche étudiant avec matricule:", matricule);

      // Utilisation du bon nom de relation 'cursus'
      const student = await prisma.etudiantEcole.findFirst({
        where: {
          matricule: {
            equals: matricule,
            mode: 'insensitive'
          }
        },
        include: {
          cursus: { // Nom exact de la relation dans votre schéma
            include: {
              formation: true,
              annee: true
            }
          }
        }
      });

      if (!student) {
        console.log("⚠️ Étudiant non trouvé");
        return res.status(404).json({ error: "Étudiant non trouvé" });
      }

      console.log("✅ Étudiant trouvé:", student);
      res.json({
        id: student.idEtudiantEcole,
        nom: student.nom,
        prenom: student.prenom,
        matricule: student.matricule,
        cursus: student.cursus // Inclut les cursus associés
      });
      
    } catch (error) {
      console.error("❌ Erreur:", error);
      res.status(500).json({ error: error.message });
    }
},

  async getStudentsByFormation(req, res) {
    try {
      const { formationId } = req.params;
      const { anneeId } = req.query;

      if (!anneeId) {
        return res.status(400).json({
          success: false,
          error: "Le paramètre anneeId est requis"
        });
      }

      const students = await prisma.cursusEcole.findMany({
        where: {
          formationId: parseInt(formationId),
          anneeId: parseInt(anneeId)
        },
        include: {
          etudiant: true,
          formation: true,
          annee: true
        }
      });

      res.json({
        success: true,
        data: students
      });

    } catch (error) {
      console.error("Erreur CursusEcoleController.getStudentsByFormation:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur"
      });
    }
  },

  async createCursus(req, res) {
    try {
      const { etudiantId, formationId, anneeId, moyenne } = req.body;

      const newCursus = await prisma.cursusEcole.create({
        data: {
          etudiantId: parseInt(etudiantId),
          formationId: parseInt(formationId),
          anneeId: parseInt(anneeId),
          moyenne: parseFloat(moyenne)
        },
        include: {
          etudiant: true,
          formation: true,
          annee: true
        }
      });

      res.status(201).json({
        success: true,
        data: newCursus
      });

    } catch (error) {
      console.error("Erreur CursusEcoleController.createCursus:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la création du cursus"
      });
    }
  },

  async updateCursus(req, res) {
    try {
      const { id } = req.params;
      const { moyenne } = req.body;

      const updatedCursus = await prisma.cursusEcole.update({
        where: { id: parseInt(id) },
        data: { moyenne: parseFloat(moyenne) },
        include: {
          etudiant: true,
          formation: true,
          annee: true
        }
      });

      res.json({
        success: true,
        data: updatedCursus
      });
    } catch (error) {
      console.error("Erreur CursusEcoleController.updateCursus:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la mise à jour du cursus"
      });
    }
  }
};