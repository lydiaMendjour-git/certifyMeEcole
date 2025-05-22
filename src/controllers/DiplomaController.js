import diplomaModel from '../models/Diploma.js';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const DiplomasController = {
  // 🟢 Création de diplômes par université
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

  // 🔍 Diplômes à valider
  async getDiplomasToValidate(req, res) {
    try {
      const { universityId } = req.params;
      const diplomas = await diplomaModel.getDiplomasToValidateService(universityId);
      res.json(diplomas);
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des diplômes.' });
    }
  },

  // ✅ Valider un diplôme
  async validateDiploma(req, res) {
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
  },

  // ✅ Valider tous les diplômes d'une université
  async validateAllDiplomas(req, res) {
    try {
      const { universityId } = req.params;
      const result = await diplomaModel.validateAllDiplomasService(universityId);
      res.json({ message: `${result.count} diplômes validés avec succès !` });
    } catch (error) {
      console.error('Erreur bulk validation:', error);
      res.status(500).json({ message: 'Erreur lors de la validation de tous les diplômes.' });
    }
  },

  // 🎓 Diplômes validés
  async getValidatedDiplomas(req, res) {
    try {
      const { universityId } = req.params;
      const diplomas = await diplomaModel.getValidatedDiplomasService(universityId);
      res.json(diplomas);
    } catch (error) {
      console.error('Erreur diplômes validés:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des diplômes validés.' });
    }
  },


  async rejectDiploma(req, res) {
    const { diplomaId } = req.params;
    try {
      const diploma = await prisma.diplome.delete({
        where: { id: parseInt(diplomaId) }
      });
      if (!diploma) {
        return res.status(404).json({ error: 'Diplôme non trouvé' });
      }
      res.status(200).json({ message: 'Diplôme rejeté avec succès' });
    } catch (error) {
      console.error('Erreur lors du rejet du diplôme :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },
  // Diplômes non validés pour une école
async getEcoleDiplomasToValidate(req, res) {
  try {
    const { ecoleId } = req.params;
    const diplomas = await diplomaModel.getEcoleDiplomasToValidateService(ecoleId);
    res.json(diplomas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

// Valider un diplôme d'école
async validateEcoleDiploma(req, res) {
  try {
    const { diplomaId } = req.params;
    const diploma = await diplomaModel.validateEcoleDiplomaService(diplomaId);
    res.json({
      message: `Diplôme ${diploma.studentName} validé avec succès !`,
      diploma
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la validation du diplôme.' });
  }
},

// Valider tous les diplômes d'une école
async validateAllEcoleDiplomas(req, res) {
  try {
    const { ecoleId } = req.params;
    const result = await diplomaModel.validateAllEcoleDiplomasService(ecoleId);
    res.json({ message: `${result.count} diplômes validés avec succès !` });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la validation des diplômes.' });
  }
},

// Diplômes validés pour une école
async getValidatedEcoleDiplomas(req, res) {
  try {
    const { ecoleId } = req.params;
    const diplomas = await diplomaModel.getValidatedEcoleDiplomasService(ecoleId);
    res.json(diplomas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

// Rejeter un diplôme d'école
async rejectEcoleDiploma(req, res) {
  try {
    const { diplomaId } = req.params;
    await diplomaModel.rejectEcoleDiplomaService(diplomaId);
    res.json({ message: 'Diplôme rejeté avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du rejet du diplôme.' });
  }
},

 // Dans DiplomaController.js
async creerDiplomesEcole(req, res) {
  try {
    console.log("Received request body:", req.body);
    
    const { anneeId, titreDiplome, diplomeType, etudiants, etablissement } = req.body;

    // Enhanced validation
    if (!anneeId || !titreDiplome || !diplomeType || !etablissement) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields" 
      });
    }

    if (!etudiants || !Array.isArray(etudiants) || etudiants.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Etudiants array is required and must not be empty" 
      });
    }

    const result = [];
    const errors = [];

    // Transaction
    await prisma.$transaction(async (prisma) => {
      for (const { idEtudiantEcole } of etudiants) {
        try {
          // Verify student exists with all required relations
          const etudiant = await prisma.etudiantEcole.findUnique({
            where: { idEtudiantEcole: Number(idEtudiantEcole) },
            include: { 
              cursus: {
                include: {
                  formation: true,
                  annee: true
                }
              } 
            }
          });

          if (!etudiant) {
            errors.push({ idEtudiantEcole, error: "Étudiant non trouvé" });
            continue;
          }

          if (!etudiant.cursus || etudiant.cursus.length === 0) {
            errors.push({ idEtudiantEcole, error: "L'étudiant n'a pas de cursus" });
            continue;
          }

          const currentCursus = etudiant.cursus.find(c => c.annee.id === anneeId);
          if (!currentCursus) {
            errors.push({ idEtudiantEcole, error: "L'étudiant n'est pas inscrit dans l'année spécifiée" });
            continue;
          }

          if (!currentCursus.formation) {
            errors.push({ idEtudiantEcole, error: "La formation de l'étudiant n'est pas définie" });
            continue;
          }

          // Create diploma
          const diplome = await prisma.diplomeEcole.create({
            data: {
              diplomaHash: crypto.createHash('sha256').update([
  etudiant.idEtudiantEcole,
  titreDiplome,
  `${etudiant.nom} ${etudiant.prenom}`,
  new Date(etudiant.dateNaissance || new Date()).toISOString(),
  currentCursus.formation.nomFormation
].join('|')).digest('hex'),
              etablissement,
              studentName: `${etudiant.nom} ${etudiant.prenom}`,
              birthDate: etudiant.dateNaissance || new Date(),
              diplomaTitle: titreDiplome,
              diplomaType: diplomeType,  // Fixed: using the correct variable name
              dateOfIssue: new Date(),
              specialite: currentCursus.formation.nomFormation,
              etudiantEcoleId: etudiant.idEtudiantEcole
            }
          });

          result.push(diplome);
        } catch (error) {
          console.error(`Error creating diploma for student ${idEtudiantEcole}:`, error);
          errors.push({ idEtudiantEcole, error: error.message });
        }
      }
    });

    if (result.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Aucun diplôme créé",
        errors: errors.length > 0 ? errors : ["Unknown error occurred"]
      });
    }

    res.json({
      success: true,
      count: result.length,
      diplomes: result,
      warnings: errors.length > 0 ? { errors } : undefined
    });
  } catch (error) {
    console.error("Server error in creerDiplomesEcole:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création des diplômes",
      error: error.message
    });
  }
},
  async demanderDiplome(req, res) {
    try {
      // 1. Trouver l'étudiant correspondant
      const etudiant = await prisma.etudiant.findFirst({
        where: {
          OR: [
            { nom: { contains: req.body.studentName.split(' ')[0] } },
            { prenom: { contains: req.body.studentName.split(' ')[1] } }
          ]
        }
      });
  
      if (!etudiant) {
        return res.status(404).json({ message: "Étudiant non trouvé" });
      }
  
      // 2. Trouver le cursus pour la spécialité
      const cursus = await prisma.cursusUniversitaire.findFirst({
        where: {
          idEtudiant: etudiant.idEtudiant,
          specialite: req.body.speciality
        }
      });
  
      // 3. Calculer le hash COMME À LA CRÉATION
      const dataToHash = [
        etudiant.idEtudiant,
        req.body.diplomaTitle,
        `${etudiant.nom} ${etudiant.prenom}`,
        new Date(req.body.birthDate).toISOString(),
        cursus?.specialite || req.body.speciality
      ].join('|');
  
      const diplomaHash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  
      // 4. Recherche
      const existingDiploma = await prisma.diplome.findFirst({
        where: { diplomaHash }
      });
  //+ verfiication bc 


      if (existingDiploma) {
        const verificationLink = `https://CertifyMe.com/verifier-diplome/${diplomaHash}`;
        
        // Sauvegarder dans l'historique
        await prisma.historiqueVerification.create({
          data: {
              idEtudiant: etudiant.idEtudiant,
              nomEtudiant: `${etudiant.nom} ${etudiant.prenom}`,
              lienVerification: verificationLink,
              titreDiplome: existingDiploma.diplomaTitle,
              etablissement: existingDiploma.etablissement,
              dateDemande: new Date(),
              dateDernierAcces: new Date() // Initialisé à maintenant
          }
      });

        return res.json({
          success: true,
          message: "Diplôme trouvé dans notre système!",
          verificationMessage: `Pour vérifier la validité de votre diplôme à tout moment, voici votre lien permanent:`,
          verificationLink: verificationLink,
          verificationRemarque: `ce lien doit être vérifié sur la plateforme CertifyMe . un clic sur ce lien n'accédera à aucune page de vérification`,
          diplomaInfo: {
            title: existingDiploma.diplomaTitle,
            date: existingDiploma.dateOfIssue,
            establishment: existingDiploma.etablissement
          }
        });
      }
  
      return res.status(404).json({
        success: false,
        message: "Aucun diplôme trouvé avec ces informations.",
        suggestion: "Votre demande a été enregistrée. Vous recevrez une notification lorsque le diplôme sera disponible."
      });
  
    } catch (error) {
      console.error('Erreur lors de la vérification du diplôme:', {
        error: error.message,
        stack: error.stack,
        requestBody: req.body
      });
      res.status(500).json({ 
        success: false,
        message: "Erreur serveur lors de la vérification",
        technicalDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  // Dans votre controller diplome.js
  async verifierDiplome(req, res) {
    try {
      const { hash } = req.params;
      
      const diploma = await prisma.diplome.findUnique({
        where: { diplomaHash: hash },
        select: {
          diplomaTitle: true,
          studentName: true,
          etablissement: true,
          dateOfIssue: true,
          speciality: true
        }
      });
  
      if (!diploma) {
        return res.status(404).json({ 
          success: false,
          message: "Aucun diplôme trouvé avec cet identifiant" 
        });
      }
  
      return res.json({
        success: true,
        ...diploma
      });
    } catch (error) {
      console.error('Erreur vérification:', error);
      res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
      });
    }
  },
  // Fonction pour demander un diplôme d'école
async demanderDiplomeEcole(req, res) {
    try {
        // 1. Trouver l'étudiant correspondant
        const etudiant = await prisma.etudiantEcole.findFirst({
            where: {
                OR: [
                    { nom: { contains: req.body.studentName.split(' ')[0] } },
                    { prenom: { contains: req.body.studentName.split(' ')[1] } }
                ]
            }
        });

        if (!etudiant) {
            return res.status(404).json({ message: "Étudiant non trouvé" });
        }

        // 2. Calculer le hash
        const dataToHash = [
            etudiant.idEtudiantEcole,
            req.body.diplomaTitle,
            `${etudiant.nom} ${etudiant.prenom}`,
            new Date(req.body.birthDate).toISOString(),
            req.body.speciality
        ].join('|');

        console.log("Données pour hash (VÉRIFICATION):", {
  idEtudiant: etudiant.idEtudiantEcole,
  titreDiplome: req.body.diplomaTitle,
  nomComplet: `${etudiant.nom} ${etudiant.prenom}`,
  dateNaissance: new Date(req.body.birthDate).toISOString(),
  specialite: req.body.speciality,
  chaineComplete: dataToHash
});

        const diplomaHash = crypto.createHash('sha256').update(dataToHash).digest('hex');
        
        // 3. Recherche du diplôme
        const existingDiploma = await prisma.diplomeEcole.findFirst({
            where: { diplomaHash }
        });

        if (existingDiploma) {
            const verificationLink = `https://CertifyMe.com/verifier-diplome-ecole/${diplomaHash}`;
            
            // Sauvegarder dans l'historique
            await prisma.historiqueVerification.create({
                data: {
                    idEtudiant: etudiant.idEtudiantEcole,
                    nomEtudiant: `${etudiant.nom} ${etudiant.prenom}`,
                    lienVerification: verificationLink,
                    titreDiplome: existingDiploma.diplomaTitle,
                    etablissement: existingDiploma.etablissement,
                    dateDemande: new Date(),
                    dateDernierAcces: new Date()
                }
            });

            return res.json({
                success: true,
                message: "Diplôme d'école trouvé dans notre système!",
                verificationMessage: `Pour vérifier la validité de votre diplôme à tout moment, voici votre lien permanent:`,
                verificationLink: verificationLink,
                verificationRemarque: `Ce lien doit être vérifié sur la plateforme CertifyMe`,
                diplomaInfo: {
                    title: existingDiploma.diplomaTitle,
                    date: existingDiploma.dateOfIssue,
                    establishment: existingDiploma.etablissement,
                    mention: existingDiploma.mention
                }
            });
        }

        return res.status(404).json({
            success: false,
            message: "Aucun diplôme d'école trouvé avec ces informations."
        });

    } catch (error) {
        console.error('Erreur lors de la vérification du diplôme:', error);
        res.status(500).json({ 
            success: false,
            message: "Erreur serveur lors de la vérification"
        });
    }
},

// Fonction pour vérifier un diplôme d'école
async verifierDiplomeEcole(req, res) {
    try {
        const { hash } = req.params;
        
        const diploma = await prisma.diplomeEcole.findUnique({
            where: { diplomaHash: hash },
            select: {
                diplomaTitle: true,
                studentName: true,
                etablissement: true,
                dateOfIssue: true,
                specialite: true,
                mention: true
            }
        });

        if (!diploma) {
            return res.status(404).json({ 
                success: false,
                message: "Aucun diplôme d'école trouvé avec cet identifiant" 
            });
        }

        return res.json({
            success: true,
            ...diploma
        });
    } catch (error) {
        console.error('Erreur vérification diplôme école:', error);
        res.status(500).json({ 
            success: false,
            message: "Erreur serveur" 
        });
    }
},

async getEcoleDiplomes(req, res) {
  try {
    const { ecoleId } = req.params;
    const { annee } = req.query;

    const whereClause = {
      etudiantEcole: {
        cursus: {
          some: {
            annee: {
              ecoleId: parseInt(ecoleId)
            }
          }
        }
      }
    };

    if (annee) {
      whereClause.dateOfIssue = {
        gte: new Date(`${annee}-01-01`),
        lte: new Date(`${annee}-12-31`)
      };
    }

    const diplomes = await prisma.diplomeEcole.findMany({
      where: whereClause,
      orderBy: { dateOfIssue: 'desc' },
      include: {
        etudiantEcole: {
          select: {
            nom: true,
            prenom: true,
            matricule: true
          }
        }
      }
    });

    res.json(diplomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},


async deleteEcoleDiploma(req, res) {
  try {
    const { diplomaId } = req.params;

    // Vérifier si le diplôme existe et n'est pas encore validé
    const diplome = await prisma.diplomeEcole.findUnique({
      where: { id: parseInt(diplomaId) }
    });

    if (!diplome) {
      return res.status(404).json({ success: false, message: "Diplôme non trouvé" });
    }

    if (diplome.complete) {
      return res.status(400).json({ 
        success: false, 
        message: "Impossible de supprimer un diplôme déjà validé par le ministère" 
      });
    }

    // Supprimer le diplôme
    await prisma.diplomeEcole.delete({
      where: { id: parseInt(diplomaId) }
    });

    res.json({ success: true, message: "Diplôme supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
,
async getUniversityDiplomas(req, res) {
  try {
    const { universityId } = req.params;
    const { annee, statut } = req.query;

    // Construction de la clause where de base
    const where = {
      etudiant: {
        CursusUniversitaire: {
          some: {
            faculty: {
              idUni: parseInt(universityId)
            }
          }
        }
      }
    };

    // Ajout du filtre par statut si spécifié
    if (statut === 'VALIDES') {
      where.complete = true;
    } else if (statut === 'EN_ATTENTE') {
      where.complete = false;
    }

    // Ajout du filtre par année si spécifié
    if (annee) {
      where.dateOfIssue = {
        gte: new Date(`${annee}-01-01`),
        lte: new Date(`${annee}-12-31`)
      };
    }

    const diplomes = await prisma.diplome.findMany({
      where,
      orderBy: { dateOfIssue: 'desc' },
      include: {
        etudiant: {
          select: {
            nom: true,
            prenom: true,
            matricule: true
          }
        }
      }
    });

    res.json(diplomes);
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
},
// Nouvelle route pour supprimer un diplôme d'université
async deleteUniversityDiploma(req, res) {
  try {
    const { diplomaId } = req.params;

    // Vérifier si le diplôme existe et n'est pas encore validé
    const diplome = await prisma.diplome.findUnique({
      where: { id: parseInt(diplomeId) }
    });

    if (!diplome) {
      return res.status(404).json({ success: false, message: "Diplôme non trouvé" });
    }

    if (diplome.complete) {
      return res.status(400).json({ 
        success: false, 
        message: "Impossible de supprimer un diplôme déjà validé" 
      });
    }

    // Supprimer le diplôme
    await prisma.diplome.delete({
      where: { id: parseInt(diplomeId) }
    });

    res.json({ success: true, message: "Diplôme supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},
  async getHistorique(req, res) {
    try {
      console.log('Requête historique reçue pour user:', req.user.idEtudiant);
      
      if (!req.user?.idEtudiant) {
        console.warn('Accès non autorisé - idEtudiant manquant');
        return res.status(401).json({ 
          success: false, 
          message: "Authentification requise" 
        });
      }
  
      const historique = await prisma.historiqueVerification.findMany({
        where: { idEtudiant: req.user.idEtudiant },
        distinct: ['titreDiplome'],
        orderBy: { dateDemande: 'desc' }
      });
  
      console.log(`Historique trouvé: ${historique.length} entrées`);
  
      // Réponse explicite en JSON
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        historique: historique.map(item => ({
          id: item.id,
          titreDiplome: item.titreDiplome,
          lienVerification: item.lienVerification,
          etablissement: item.etablissement,
          dateDemande: item.dateDemande
        }))
      });
  
    } catch (error) {
      console.error('Erreur getHistorique:', {
        error: error.message,
        stack: error.stack,
        user: req.user
      });
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}
export default DiplomasController;
