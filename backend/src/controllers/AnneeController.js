import Annee from '../models/Annee.js';  // Importation du modèle avec syntaxe ES6

export default {
  async getAnnee(req, res) {
    try {
         const annee = await Annee.getAll();
      res.json(annee); 
    } catch (error) {
      res.status(500).json({ error: error.message });  
    }
  }
};

  