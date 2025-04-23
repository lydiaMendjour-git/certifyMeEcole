import { PrismaClient } from '@prisma/client';
import studentMinistry from '../models/StudentMinistry.js';
const prisma = new PrismaClient();

const StudentMinistryController = {
  verifierEtudiants: async (req, res) => {
    const ids = req.body; // [1, 3, 7] par exemple

    try {
      // 🔍 Étape 1 : Récupérer les infos de la table Etudiant locale
      const etudiantsLocaux = await prisma.etudiant.findMany({
        where: { idEtudiant: { in: ids } },
        select: {
          idEtudiant: true,
          nom: true,
          prenom: true,
          email: true,
          matricule: true,
        },
      });

      // 🔍 Étape 2 : Vérifier avec la base ministère (via email + matricule)
      const etudiantsTrouves = await studentMinistry.findMatchingStudents(etudiantsLocaux);
      console.log("Étudiants locaux:", etudiantsLocaux);
      console.log("Étudiants trouvés ministère:", etudiantsTrouves);

      // 🔍 Étape 3 : Comparer et identifier les non-trouvés
      const manquants = etudiantsLocaux.filter((etudiant) => {
        return !etudiantsTrouves.some(
          (e) =>
            e.email === etudiant.email &&
            e.matricule === etudiant.matricule
        );
      });

      if (manquants.length > 0) {
        return res.status(404).json({
          success: false,
          message: 'Certains étudiants ne sont pas trouvés dans la base du ministère.',
          etudiantsNonTrouves: manquants,
        });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Erreur lors de la vérification des étudiants :', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  },
};

export default StudentMinistryController;
