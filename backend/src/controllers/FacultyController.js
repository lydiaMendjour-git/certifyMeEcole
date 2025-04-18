import fs from 'fs';
import path from 'path';
import csv from 'fast-csv';
import { fileURLToPath } from 'url';
import { prisma } from '../prismaClient.js';
import Faculty from '../models/Faculty.js';

// Nécessaire pour __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FacultyController = {
  // 🔹 Facultés générales (si besoin)
  async getAll(req, res) {
    try {
      const faculties = await Faculty.getAll();
      res.json(faculties);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 🔹 Facultés par université
  async getFaculties(req, res) {
    try {
      const faculties = await Faculty.getByUniversity(req.query.universityId);
      res.json(faculties);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ... ton code précédent inchangé ...

// 🔹 Upload CSV
async uploadFaculties(req, res) {
  try {
    const { universityId } = req.body;
    if (!universityId) {
      return res.status(400).json({ message: "ID d'université invalide ou manquant." });
    }

    const university = await prisma.university.findUnique({
      where: { idUni: parseInt(universityId) }
    });

    if (!university) {
      return res.status(404).json({ message: "Université non trouvée." });
    }

    const faculties = [];
    const filePath = path.join(__dirname, '../routes/uploads/', req.file.filename);

    // Vérification du chemin absolu
    console.log('Chemin du fichier:', filePath);
    
    // Vérifier si le fichier existe avant de le lire
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('Le fichier n\'existe pas:', filePath);
        return res.status(404).json({ message: "Le fichier n'existe pas." });
      }
    
      // Si le fichier existe, procéder à la lecture
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => { throw error; })
        .on('data', (row) => {
          if (!row.nomFaculty) {
            throw new Error("Le fichier CSV doit contenir une colonne 'nomFaculty'");
          }
          faculties.push({
            nomFaculty: row.nomFaculty,
            idUni: university.idUni,
          });
        })
        .on('end', async () => {
          try {
            await Faculty.createMany(faculties);
    
            fs.unlink(filePath, err => {
              if (err) console.error("Erreur suppression fichier :", err);
            });
    
            res.json({
              status: "ok",
              filename: req.file.originalname,
              message: "Upload réussi",
              count: faculties.length
            });
          } catch (error) {
            res.status(500).json({
              status: "fail",
              message: error.message
            });
          }
        });
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
} // 👈 C'était cette accolade qui manquait

}; // 👈 Et celle-ci pour fermer le `FacultyController`

export default FacultyController;

