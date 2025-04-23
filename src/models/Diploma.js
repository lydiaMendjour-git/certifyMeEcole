import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';


const prisma = new PrismaClient();
export default {
  async creerDiplomesPourEtudiants(anneeId, titreDiplome, typeDiplome, etudiants, universityName) {
    const diplomesCrees = [];
  
    for (const etudiant of etudiants) {
      const idEtudiant = etudiant.idEtudiant;
  
      try {
        console.log("🎓 Création du diplôme pour :", idEtudiant);
  
        const infosEtudiant = await prisma.etudiant.findUnique({
          where: { idEtudiant }
        });
  
        if (!infosEtudiant || !infosEtudiant.nom || !infosEtudiant.prenom || !infosEtudiant.dateNaissance) {
          console.warn(`⛔ Données manquantes pour l'étudiant ${idEtudiant}.`);
          continue;
        }
  
        const cursus = await prisma.cursusUniversitaire.findFirst({
          where: {
            idEtudiant,
            idAnnee: parseInt(anneeId, 10)
          },
          select: {
            specialite: true
          }
        });
  
        const specialite = cursus?.specialite || "Inconnue";
  
        const existingDiploma = await prisma.diplome.findFirst({
          where: {
            etudiantId: idEtudiant,
            diplomaTitle: titreDiplome,
            diplomaType: typeDiplome,
            speciality: specialite
          }
        });
  
        if (existingDiploma) {
          console.warn(`📛 Diplôme déjà existant pour l'étudiant ${idEtudiant} avec ce titre/type/spécialité.`);
          continue;
        }
  
        const dataToHash = `${idEtudiant}|${titreDiplome}|${typeDiplome}|${infosEtudiant.nom} ${infosEtudiant.prenom}|${infosEtudiant.dateNaissance.toISOString()}|${specialite}`;
        const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  
        const newDiplome = await prisma.diplome.create({
          data: {
            diplomaHash: hash,
            etablissement: "USTHB", // 👈 utiliser ici
            studentName: `${infosEtudiant.nom} ${infosEtudiant.prenom}`,
            birthDate: infosEtudiant.dateNaissance,
            diplomaTitle: titreDiplome,
            diplomaType: typeDiplome,
            dateOfIssue: new Date(),
            speciality: specialite,
            complete: false,
            etudiantId: idEtudiant
          }
        });
  
        diplomesCrees.push(newDiplome);
  
      } catch (err) {
        console.error(`💥 Erreur pour l'étudiant ${idEtudiant} :`, err);
      }
    }
  
    return diplomesCrees;
  }
  
  
, // Récupérer les diplômes  validés d'une université
async getValidatedDiplomasService(universityId) {
  return await prisma.diplome.findMany({
    where: {
      complete: true ,
      etudiant: {
        CursusUniversitaire: {
          some: { // Utilisation de `some` pour vérifier la relation
            faculty: { // Si le champ dans `CursusUniversitaire` est `faculty` (faculté)
              idUni: parseInt(universityId)
            }
          }
        }
      }
    }
  });
} // Récupérer les diplômes non validés d'une université
,async getDiplomasToValidateService(universityId) {
  return await prisma.diplome.findMany({
    where: {
      complete: false,
      etudiant: {
        CursusUniversitaire: {
          some: { // Utilisation de `some` pour vérifier la relation
            faculty: { // Si le champ dans `CursusUniversitaire` est `faculty` (faculté)
              idUni: parseInt(universityId)
            }
          }
        }
      }
    }
  });
}, 

// Valider un diplôme spécifique
async  validateDiplomaService(diplomaId) {
  return await prisma.diplome.update({
    where: { id: parseInt(diplomaId) },
    data: { complete: true }
  });
},

// Valider TOUS les diplômes non-validés d'une université
async validateAllDiplomasService(universityId) {
  return await prisma.diplome.updateMany({
    where: {
      complete: false,
      etudiant: {
        CursusUniversitaire: {
          some: { // Vérifier au moins un `CursusUniversitaire` correspondant
            faculty: { // Vérifier l'association avec `Faculty`
              idUni: parseInt(universityId)
            }
          }
        }
      }
    },
    data: { complete: true }
  });
}
,

async deleteDiplomaById  (diplomaId)  {
  return await prisma.diplome.delete({
    where: {
      id: parseInt(diplomaId)
    }
  });
}
};

