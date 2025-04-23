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
async createFaculty (req, res)  {
  try {
    console.log('Request body:', req.body);

    // Validate input
    if (!req.body.idUni || isNaN(req.body.idUni)) {
      return res.status(400).json({ error: 'Invalid university ID' });
    }

    // Create faculty
    const faculty = await Faculty.create(req.body);
    res.status(201).json(faculty);

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Retrying faculty creation...');
      await new Promise(resolve => setTimeout(resolve, 100));
      return Faculty.create(req.body); // Use req.body instead of facultyData
    }
    console.error('Full error:', error);
    res.status(500).json({
      error: 'Faculty creation failed',
      details: error.message,
    });
  }
} ,
//Crée une nouvelle faculté

//Met à jour le nom d'une faculté
async updateFaculty (req, res) {
  try {
    const faculty = await Faculty.update(
      req.params.id,
      req.body.nomFaculty
    );
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ error: 'Error updating faculty' });
  }
},

//Supprime une faculté
async deleteFaculty  (req, res) {
  try {
    await Faculty.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting faculty' });
  }

},
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
  
  async getFacultiesByUniversity(req, res) {
    try {
      const { universityId } = req.params;
  
      if (!universityId || isNaN(universityId)) {
        return res.status(400).json({ 
          error: "ID d'université invalide ou manquant",
          details: "Le paramètre universityId doit être un nombre"
        });
      }
  
      const faculties = await Faculty.getByUniversity(universityId);
  
      // Une seule réponse ici, avec ou sans données
      return res.status(200).json({
        success: true,
        data: faculties,
        message: faculties.length === 0 
          ? "Aucune faculté trouvée" 
          : "Facultés récupérées avec succès"
      });
  
    } catch (error) {
      console.error("Erreur dans getFacultiesByUniversity:", error);
      return res.status(500).json({
        error: "Erreur serveur",
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  }
,  
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
} ,
 

}; 

export default FacultyController;

