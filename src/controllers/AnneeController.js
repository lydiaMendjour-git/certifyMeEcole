import Annee from '../models/Annee.js';  // Importation du modèle avec syntaxe ES6

export default {
  async getAnnee(req, res) {
    try {
         const annee = await Annee.getAll();
      res.json(annee); 
    } catch (error) {
      res.status(500).json({ error: error.message });  
    }
  }, 
  async addAnneeUniversitaire(req, res) {
      try {
        const { annee } = req.body;
        const result = await Annee.addAnnee(annee);
    
        if (result.alreadyExists) {
          return res.status(200).json({ message: "Année déjà existante", data: result.data });
        }
    
        res.status(201).json({ message: "Nouvelle année ajoutée avec succès", data: result.data });
      } catch (error) {
        console.error("Erreur dans addAnneeUniversitaire :", error);  // 👈 log pour voir l'erreur exacte
        const status = error.status || 500;
        const message = error.message || "Erreur serveur";
        res.status(status).json({ error: message });
      }
    },
    async getAnneesByUniversity(req, res) {
      const idUni = parseInt(req.params.idUni);
  
      try {
        const annees = await Annee.getAnneesByUniversity(idUni);
        res.json(annees);
      } catch (error) {
        console.error("Erreur lors du chargement des années:", error);
        res.status(500).json({ error: "Erreur serveur lors du chargement des années." });
      }
    }
    
 
};

  