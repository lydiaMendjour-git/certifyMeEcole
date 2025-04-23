import Student from '../models/Student.js';
import fs from 'fs';
import path from 'path';
import csv from 'fast-csv';
import { fileURLToPath } from 'url';
import { prisma } from '../prismaClient.js';

// Nécessaire pour __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const StudentController = {
  async getStudents(req, res) {
    try {
      const students = await Student.getAllStudents(req.query);
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }, 

  async uploadStudents(req, res) {
    try {
      const { facultyId, departmentId, anneeId } = req.body;
      const etudiants = [];

      // Validation des IDs
      const faculty = facultyId ? await prisma.faculty.findUnique({ where: { idFaculty: parseInt(facultyId) } }) : null;
      const department = departmentId ? await prisma.department.findUnique({ where: { idDepart: parseInt(departmentId) } }) : null;
      const annee = await prisma.anneeUniversitaire.findUnique({ where: { idAnnee: parseInt(anneeId) } });

      if (!faculty || !department || !annee) {
        return res.status(400).json({ message: "Certains ID sont invalides ou manquants." });
      }

        const filePath = path.join(__dirname, '../routes/uploads/', req.file.filename);
       
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => {
          throw error;
        })
        .on('data', (row) => {
          etudiants.push({
            nom: row.nom,
            prenom: row.prenom,
            email: row.email,
            matricule: row.matricule,
            telephone: row.telephone,
            dateNaissance: new Date(row.dateNaissance),
            lieuNaissance: row.lieuNaissance,
            CursusUniversitaire: {
              section: row.section,
              groupe: row.groupe,
              filiere: row.filiere,
              specialite: row.specialite,
              niveau: parseInt(row.niveau),
              moyenneAnnuelle: parseFloat(row.moyenneAnnuelle),
              idFaculty: faculty.idFaculty,
              idDepart: department.idDepart,
              idAnnee: annee.idAnnee
            }
          });
        })
        .on('end', async () => {
          try {
            // Traitement transactionnel pour éviter les insertions multiples
            await prisma.$transaction(async (prisma) => {
              for (const etudiant of etudiants) {
                await prisma.etudiant.upsert({
                  where: { email: etudiant.email },
                  create: {
                    ...etudiant,
                    CursusUniversitaire: { create: etudiant.CursusUniversitaire }
                  },
                  update: {
                    ...etudiant,
                    CursusUniversitaire: {
                      create: etudiant.CursusUniversitaire
                    }
                  }
                });
              }
            });

            // Suppression du fichier après traitement
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Erreur lors de la suppression du fichier:", err);
              } else {
                console.log("Fichier supprimé avec succès:", req.file.filename);
              }
            });

            res.json({
              status: "ok",
              filename: req.file.originalname,
              message: "Upload réussi!",
              count: etudiants.length
            });
          } catch (error) {
            console.error("Erreur Prisma:", error);
            res.status(500).json({
              status: "fail",
              message: error.message
            });
          }
        });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message
      });
    }
  },
  async getStudentsByAnnee(req, res) {
    try {
      // Extraction CORRECTE du paramètre de route
      const { idAnnee } = req.params; // ← Utilisez req.params (pas req.query)
      
      if (!idAnnee || isNaN(idAnnee)) {
        return res.status(400).json({ 
          error: "Paramètre manquant ou invalide",
          details: "L'ID d'année (anneeId) est requis et doit être un nombre"
        });
      }
  
      const students = await Student.getStudentsByAnnee(parseInt(idAnnee));
      res.json(students);
      
    } catch (error) {
      console.error("Erreur complète:", error); // Log complet pour débogage
      res.status(500).json({
        error: "Erreur lors de la récupération des étudiants",
        details: process.env.NODE_ENV === 'development' ? error.message : "Détails cachés en production"
      });
    }
  }
};// 👈 Et celle-ci pour fermer le `FacultyController`
  
  export default StudentController;

