import University from '../models/University.js';  // Importation du modèle avec syntaxe ES6

export default {
  async getUniversities(req, res) {
    try {
      // Appel à la méthode getAll() du modèle pour obtenir les universités
      const universities = await University.getAll();
      res.json(universities);  // Réponse avec les universités récupérées
    } catch (error) {
      res.status(500).json({ error: error.message });  // Gestion des erreurs
    }
  }
};

  