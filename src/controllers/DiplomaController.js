// controllers/DiplomaController.js
import diplomaModel from '../models/Diploma.js';

const DiplomasController = {
  async creerDiplomes (req, res)  {
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

      const result = await diplomaModel.creerDiplomesPourEtudiants(anneeId, titreDiplome, typeDiplome, etudiants);

      if (result.length === 0) {
        return res.status(400).json({ success: false, message: "Aucun diplôme n'a pu être créé. Vérifiez les données des étudiants." });
      }
      
      res.status(200).json({ success: true, diplomeIds: result.map(d => d.id) });
    } catch (error) {
      console.error("Erreur création diplômes:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }, 
 // Récupérer les diplômes NON validés pour une université
async  getDiplomasToValidate(req, res) {
  try {
    const { universityId } = req.params;
    const diplomas = await diplomaModel.getDiplomasToValidateService(universityId);
 res.json(diplomas);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des diplômes.' });
  }
}
,
// Valider un diplôme spécifique
async  validateDiploma(req, res) {
  try {
    const { diplomaId } = req.params;
    const diploma = await diplomaModel.validateDiplomaService(diplomaId);
    res.json({
      message: `Diplôme ${diploma.nom} validé avec succès !`,
      diploma
    });
  } catch (error) {
    console.error('Erreur de validation:', error);
    res.status(500).json({ message: 'Erreur lors de la validation du diplôme.' });
  }
}
,
// Valider TOUS les diplômes d'une université
async validateAllDiplomas(req, res) {
  try {
    const { universityId } = req.params;
    const result = await diplomaModel.validateAllDiplomasService(universityId);
    res.json({ message: `${result.count} diplômes validés avec succès !` });
  } catch (error) {
    console.error('Erreur bulk validation:', error);
    res.status(500).json({ message: 'Erreur lors de la validation de tous les diplômes.' });
  }
}
,
// Récupérer les diplômes VALIDÉS d'une université
async  getValidatedDiplomas(req, res) {
  try {
    const { universityId } = req.params;
    const diplomas = await diplomaModel.getValidatedDiplomasService(universityId);
    res.json(diplomas);
  } catch (error) {
    console.error('Erreur diplômes validés:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des diplômes validés.' });
  }
}, 

async rejectDiploma  (req, res) {
  const { diplomaId } = req.params;

  try {
    const diploma = await diplomaModel.deleteDiplomaById(diplomaId);

    if (!diploma) {
      return res.status(404).json({ error: 'Diplôme non trouvé' });
    }

    res.status(200).json({ message: 'Diplôme rejeté avec succès' });
  } catch (error) {
    console.error('Erreur lors du rejet du diplôme :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

};

export default DiplomasController;
