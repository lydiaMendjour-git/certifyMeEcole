import EcoleAnnee from '../models/ecoleAnnee.js';

export default {
  async create(req, res) {
    try {
      const { annee, ecoleId } = req.body;
      const result = await EcoleAnnee.addAnnee(annee, parseInt(ecoleId));

      if (result.alreadyExists) {
        return res.status(200).json({ 
          message: "Année déjà existante pour cette école", 
          data: result.data 
        });
      }

      res.status(201).json({ 
        message: "Nouvelle année scolaire ajoutée", 
        data: result.data 
      });
    } catch (error) {
      console.error("Erreur création année école:", error);
      const status = error.status || 500;
      res.status(status).json({ error: error.message });
    }
  },

  async getByEcole(req, res) {
    try {
      const annees = await EcoleAnnee.getAnneesByEcole(parseInt(req.params.ecoleId));
      res.json(annees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async setCurrent(req, res) {
    try {
      const annee = await EcoleAnnee.setCurrentAnnee(
        parseInt(req.params.id),
        parseInt(req.body.ecoleId)
      );
      res.json({ message: "Année courante mise à jour", data: annee });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      await EcoleAnnee.deleteAnnee(parseInt(req.params.id));
      res.json({ message: "Année scolaire supprimée" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};