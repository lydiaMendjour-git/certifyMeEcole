// controllers/EtudiantEcoleController.js
import fs from 'fs';
import path from 'path';
import csv from 'fast-csv';
import { fileURLToPath } from 'url';
import { prisma } from '../prismaClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EtudiantEcoleController = {
  async getStudentsByFormation(req, res) {
    try {
      const { formationId } = req.params;
      const students = await prisma.etudiantEcole.findMany({
        where: { 
          cursus: {
            some: {
              formationId: parseInt(formationId)
            }
          }
        }
      });
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

async uploadStudents(req, res) {
  try {
    const { formationId, annee, ecoleId } = req.body;
    const filePath = path.join(__dirname, '../routes/uploads/', req.file.filename);

    // Vérifier et créer l'année scolaire si nécessaire
    const [anneeDebut, anneeFin] = annee.split('/');
    const ecoleAnnee = await prisma.ecoleAnnee.upsert({
      where: {
        annee_ecoleId: {
          annee: annee,
          ecoleId: parseInt(ecoleId)
        }
      },
      create: {
        annee: annee,
        anneediplome: parseInt(anneeFin),
        isCurrent: true,
        ecoleId: parseInt(ecoleId)
      },
      update: {}
    });

    // Vérifier la formation
    const formation = await prisma.formation.findUnique({
      where: { idFormation: parseInt(formationId) }
    });

    if (!formation) {
      fs.unlinkSync(filePath);
      return res.status(404).json({ 
        status: "error",
        message: "Formation introuvable"
      });
    }

    const students = [];
    const errors = [];
    let lineNumber = 1;

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('data', (row) => {
          lineNumber++;
          try {
            if (!row.nom || !row.prenom || !row.email || !row.matricule) {
              throw new Error("Champs obligatoires manquants");
            }

            // Ajout de la date de naissance avec valeur par défaut si absente
            const dateNaissance = row.dateNaissance 
              ? new Date(row.dateNaissance)
              : new Date('2000-01-01');

            students.push({
              nom: row.nom.trim(),
              prenom: row.prenom.trim(),
              email: row.email.toLowerCase().trim(),
              matricule: row.matricule.trim(),
              telephone: row.telephone?.trim() || '',
              dateNaissance: dateNaissance, // Champ obligatoire ajouté
              lieuNaissance: row.lieuNaissance?.trim() || null,
              moyenne: row.moyenne ? parseFloat(row.moyenne) : null
            });
          } catch (err) {
            errors.push({
              line: lineNumber,
              data: row,
              error: err.message
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (errors.length > 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        status: "partial",
        message: `${errors.length} erreurs de validation`,
        errors,
        validCount: students.length
      });
    }

    // Insertion en transaction
    const results = await prisma.$transaction(async (prisma) => {
      const createdStudents = [];
      
      for (const student of students) {
        const etudiant = await prisma.etudiantEcole.upsert({
          where: { email: student.email },
          create: {
            ...student,
            dateNaissance: student.dateNaissance // Inclus dans create et update
          },
          update: {
            ...student,
            dateNaissance: student.dateNaissance // Inclus dans create et update
          }
        });

        await prisma.cursusEcole.upsert({
          where: {
            etudiantId_anneeId_formationId: {
              etudiantId: etudiant.idEtudiantEcole,
              anneeId: ecoleAnnee.id,
              formationId: parseInt(formationId)
            }
          },
          create: {
            etudiantId: etudiant.idEtudiantEcole,
            formationId: parseInt(formationId),
            anneeId: ecoleAnnee.id,
            moyenne: student.moyenne
          },
          update: {
            moyenne: student.moyenne
          }
        });

        createdStudents.push(etudiant);
      }

      return createdStudents;
    });

    fs.unlink(filePath, () => {});

    res.json({
      status: "success",
      count: results.length,
      message: `${results.length} étudiants importés`,
      anneeId: ecoleAnnee.id
    });

  } catch (error) {
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }
    console.error("Erreur d'upload:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur serveur",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
},

  async createStudent(req, res) {
    try {
      const { nom, prenom, email, matricule, formationId, anneeId } = req.body;
      
      if (!nom || !prenom || !email || !matricule || !formationId || !anneeId) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
      }

      const result = await prisma.$transaction(async (prisma) => {
        const student = await prisma.etudiantEcole.create({
  data: {
    nom,
    prenom,
    email,
    matricule,
    telephone: req.body.telephone || '',
    dateNaissance: new Date(req.body.dateNaissance || '2000-01-01'), // Champ obligatoire
    lieuNaissance: req.body.lieuNaissance || null,
    moyenne: req.body.moyenne ? parseFloat(req.body.moyenne) : null
  }
});

        await prisma.cursusEcole.create({
          data: {
            etudiantId: student.idEtudiantEcole,
            formationId: parseInt(formationId),
            anneeId: parseInt(anneeId),
            moyenne: req.body.moyenne ? parseFloat(req.body.moyenne) : null
          }
        });

        return student;
      });

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erreur lors de la création de l\'étudiant',
        details: error.message 
      });
    }
  },

 async updateStudent(req, res) {
  try {
    const { id } = req.params;
    const { nom, prenom, email, matricule, telephone, dateNaissance, lieuNaissance, moyenne } = req.body;

    // Validation des champs obligatoires
    if (!nom || !prenom || !email || !matricule) {
      return res.status(400).json({ error: 'Nom, prénom, email et matricule sont obligatoires' });
    }

    const student = await prisma.etudiantEcole.update({
      where: { idEtudiantEcole: parseInt(id) },
      data: {
        nom,
        prenom,
        email,
        matricule,
        telephone: telephone || '',
        dateNaissance: dateNaissance ? new Date(dateNaissance) : new Date('2000-01-01'),
        lieuNaissance: lieuNaissance || null,
        moyenne: moyenne ? parseFloat(moyenne) : null
      }
    });
    
    res.json(student);

    console.log('Updating student:', req.params.id, req.body);

  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ 
      error: 'Error updating student',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
},
  
async getStudentsByAnnee(req, res) {
  try {
    const { idAnnee } = req.params;
    const parsedAnneeId = parseInt(idAnnee);
    
    if (isNaN(parsedAnneeId)) {
      return res.status(400).json({ 
        error: "L'ID de l'année doit être un nombre valide" 
      });
    }

    const students = await prisma.etudiantEcole.findMany({
      where: { cursus: { some: { anneeId: parsedAnneeId } } },
      include: {
        cursus: {
          where: { anneeId: parsedAnneeId },
          include: { formation: true }
        }
      }
    });

    // Retourne directement le tableau comme l'université
    res.json(students.map(student => ({
      ...student,
      formations: student.cursus.map(c => c.formation)
    })));
    
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
},
async deleteStudent(req, res) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    // Supprimer d'abord tous les enregistrements liés
    await prisma.$transaction([
      // Supprimer les diplômes associés
      prisma.diplomeEcole.deleteMany({
        where: { etudiantEcoleId: parsedId }
      }),
      
      // Supprimer les cursus associés
      prisma.cursusEcole.deleteMany({
        where: { etudiantId: parsedId }
      }),
      
      // Enfin supprimer l'étudiant
      prisma.etudiantEcole.delete({
        where: { idEtudiantEcole: parsedId }
      })
    ]);

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ 
      error: 'Error deleting student',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
};

export default EtudiantEcoleController;