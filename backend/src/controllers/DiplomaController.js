// controllers/DiplomaController.js
import { creerDiplomesPourEtudiants } from '../models/Diploma.js';

const DiplomasController = {
  creerDiplomes: async (req, res) => {
    try {
      const { anneeId, titreDiplome, typeDiplome, etudiants } = req.body;
      console.log("partie Controller: ");
      console.log("📩 Requête reçue avec :", req.body);
      console.log("Type de etudiants:", typeof etudiants);
      console.log("Contenu de etudiants:", etudiants);
      console.log("Premier élément:", etudiants[0]);
      if (!anneeId || !titreDiplome || !typeDiplome || !etudiants) {
        return res.status(400).json({ success: false, message: "Champs requis manquants" });
      }

      const result = await creerDiplomesPourEtudiants(anneeId, titreDiplome, typeDiplome, etudiants);

      if (result.length === 0) {
        return res.status(400).json({ success: false, message: "Aucun diplôme n'a pu être créé. Vérifiez les données des étudiants." });
      }
      
      res.status(200).json({ success: true, diplomeIds: result.map(d => d.id) });
    } catch (error) {
      console.error("Erreur création diplômes:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
};

export default DiplomasController;
