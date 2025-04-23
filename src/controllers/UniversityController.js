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
  }, 
 async getAllUniversitiesWithAccount  (req, res) {
    try {
      const universities = await University.getUniversitiesWithAccount();
      res.status(200).json(universities);
    } catch (error) {
      console.error("Erreur dans le contrôleur :", error);
      res.status(500).json({ error: "Erreur lors de la récupération des universités." });
    }
  }, 
  async getUniversityById  (req, res) {
    const { universityId } = req.params;
  
    try {
      const university = await University.findUniversityById(universityId);
  
      if (!university) {
        return res.status(404).json({ error: 'Université non trouvée' });
      }
  
      res.status(200).json(university);
    } catch (error) {
      console.error('Erreur lors de la récupération de l’université :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
  
 
};

  