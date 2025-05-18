// controllers/FormationController.js
import fs from 'fs';
import path from 'path';
import csv from 'fast-csv';
import { fileURLToPath } from 'url';
import { prisma } from '../prismaClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FormationController = {
  async createFormation(req, res) {
    try {
      const { nomFormation, ecoleId, typeFormation } = req.body;
      
      if (!nomFormation || !ecoleId || !typeFormation) {
        return res.status(400).json({ 
          error: 'Tous les champs sont requis (nom, ecoleId, typeFormation)' 
        });
      }

      const formation = await prisma.formation.create({
        data: {
          nomFormation,
          ecoleId: parseInt(ecoleId),
          typeFormation,
          duree: req.body.duree || ''
        }
      });

      res.status(201).json(formation);
    } catch (error) {
      console.error('Erreur création formation:', error);
      res.status(500).json({ 
        error: 'Échec de la création',
        details: error.message 
      });
    }
  },

  async updateFormation(req, res) {
    try {
      const formation = await prisma.formation.update({
        where: { idFormation: parseInt(req.params.id) },
        data: {
          nomFormation: req.body.nomFormation,
          duree: req.body.duree,
          typeFormation: req.body.typeFormation
        }
      });
      res.json(formation);
    } catch (error) {
      res.status(500).json({ error: 'Error updating formation' });
    }
  },

  async deleteFormation(req, res) {
    try {
      await prisma.formation.delete({
        where: { idFormation: parseInt(req.params.id) }
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting formation' });
    }
  },

  async getFormationsByEcole(req, res) {
    try {
      const { ecoleId } = req.params;
      const formations = await prisma.formation.findMany({
        where: { ecoleId: parseInt(ecoleId) },
        include: {
          cursus: {
            include: {
              annee: true
            }
          }
        }
      });
      res.json(formations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getStudentsByFormation(req, res) {
    try {
      const { formationId } = req.params;
      const { anneeId } = req.query;

      const formation = await prisma.formation.findUnique({
        where: { idFormation: parseInt(formationId) }
      });

      if (!formation) {
        return res.status(404).json({ error: 'Formation non trouvée' });
      }

      const whereClause = {
        formationId: parseInt(formationId)
      };

      if (anneeId) {
        whereClause.anneeId = parseInt(anneeId);
      }

      const students = await prisma.cursusEcole.findMany({
        where: whereClause,
        include: {
          etudiant: true,
          annee: true,
          formation: true
        },
        orderBy: {
          etudiant: {
            nom: 'asc'
          }
        }
      });

      res.json(students);
    } catch (error) {
      console.error('Erreur lors de la récupération des étudiants:', error);
      res.status(500).json({ 
        error: 'Erreur serveur',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async uploadFormations(req, res) {
    try {
      const { ecoleId } = req.body;
      if (!ecoleId) {
        return res.status(400).json({ message: "ID d'école invalide ou manquant." });
      }

      const ecole = await prisma.ecole.findUnique({
        where: { idEcole: parseInt(ecoleId) }
      });

      if (!ecole) {
        return res.status(404).json({ message: "École non trouvée." });
      }

      const formations = [];
      const filePath = path.join(__dirname, '../routes/uploads/', req.file.filename);

      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => { throw error; })
        .on('data', (row) => {
          if (!row.nomFormation) {
            throw new Error("Le fichier CSV doit contenir une colonne 'nomFormation'");
          }
          formations.push({
            nomFormation: row.nomFormation,
            duree: row.duree || '',
            typeFormation: row.typeFormation || '',
            ecoleId: ecole.idEcole
          });
        })
        .on('end', async () => {
          try {
            await prisma.formation.createMany({
              data: formations
            });

            fs.unlink(filePath, err => {
              if (err) console.error("Erreur suppression fichier:", err);
            });

            res.json({
              status: "ok",
              filename: req.file.originalname,
              message: "Upload réussi",
              count: formations.length
            });
          } catch (error) {
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
  }
};

export default FormationController;