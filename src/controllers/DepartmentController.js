import fs from 'fs';
import path from 'path';
import csv from 'fast-csv';
import { fileURLToPath } from 'url';
import { prisma } from '../prismaClient.js';
import Department from '../models/Department.js';

// Nécessaire pour __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DepartmentController = { 
  // 🔹 Récupérer les départements par faculté
  async getByFaculty(req, res) {
    try {
      const { facultyId } = req.params;
      const departments = await Department.getByFaculty(facultyId);
      res.json(departments);
    } catch (error) {
      console.error("Erreur Controller getByFaculty:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // 🔹 Upload CSV pour départements
  async uploadDepartments(req, res) {
    try {
      const { facultyId } = req.body;
      if (!facultyId) {
        return res.status(400).json({ message: "L'ID de la faculté est requis." });
      }

      const faculty = await prisma.faculty.findUnique({
        where: { idFaculty: parseInt(facultyId) },
        include: { university: true },
      });

      if (!faculty) return res.status(404).json({ message: "Faculté non trouvée." });
      if (!req.file) return res.status(400).json({ message: "Aucun fichier fourni." });

      const departments = [];
      const filePath = path.join(__dirname, '../routes/uploads/', req.file.filename);


      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => { throw error; })
        .on('data', (row) => {
          if (!row.nomDepartment) throw new Error("Le fichier CSV doit contenir une colonne 'nomDepartment'");
          departments.push({
            nomDepart: row.nomDepartment,
            idFaculty: faculty.idFaculty,
            idUni: faculty.university.idUni
          });
        })
        .on('end', async () => {
          try {
            await Department.createMany(departments);

            fs.unlink(filePath, err => {
              if (err) console.error("Erreur suppression fichier:", err);
            });

            res.json({
              status: "ok",
              filename: req.file.originalname,
              message: "Upload réussi",
              count: departments.length
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
  },
  async createDepartment (req, res)  {
    try {
        const department = await Department.create(req.body);
        res.status(201).json(department);
      } catch (error) {
        console.error('Error creating department:', error);
        res.status(500).json({ 
            error: 'Error creating department',
            details: error.message 
        });
    }
  },
  
  // Met à jour le nom d'un département
  async  updateDepartment (req, res)  {
    try {
      const department = await Department.update(
        req.params.id,
        req.body.nomDepart
      );
      res.json(department);
    } catch (error) {
      res.status(500).json({ error: 'Error updating department' });
    }
  },
  
  //Supprime un département
  async deleteDepartment (req, res)  {
    try {
      await Department.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting department' });
    }}
};

export default DepartmentController;
