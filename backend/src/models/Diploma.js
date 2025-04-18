import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';


const prisma = new PrismaClient();

async function creerDiplomesPourEtudiants(anneeId, titreDiplome, typeDiplome, etudiants) {
  const diplomesCrees = [];

  for (const etudiant of etudiants) {
    const idEtudiant = etudiant.idEtudiant;

    try {
      console.log("🎓 Création du diplôme pour :", idEtudiant);

      // 🔍 Récupération des infos de base de l'étudiant
      const infosEtudiant = await prisma.etudiant.findUnique({
        where: { idEtudiant }
      });

      if (!infosEtudiant || !infosEtudiant.nom || !infosEtudiant.prenom || !infosEtudiant.dateNaissance) {
        console.warn(`⛔ Données manquantes pour l'étudiant ${idEtudiant}.`);
        continue;
      }

      // 🎯 Récupération de la spécialité depuis CursusUniversitaire via idEtudiant + idAnnee
      const cursus = await prisma.cursusUniversitaire.findFirst({
        where: {
          idEtudiant: idEtudiant,
          idAnnee: parseInt(anneeId, 10)
        },
        select: {
          specialite: true
        }
      });

      const specialite = cursus?.specialite || "Inconnue";

      // 🧠 Vérifier si un diplôme similaire existe déjà
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

      // 🔐 Création du hash unique
      const dataToHash = `${idEtudiant}|${titreDiplome}|${typeDiplome}|${infosEtudiant.nom} ${infosEtudiant.prenom}|${infosEtudiant.dateNaissance.toISOString()}|${specialite}`;
      const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

      // ✅ Création du diplôme
      const newDiplome = await prisma.diplome.create({
        data: {
          diplomaHash: hash,
          etablissement: "usthb",
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

export { creerDiplomesPourEtudiants };
