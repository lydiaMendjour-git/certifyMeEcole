import express from 'express';
import multer from 'multer'; // Ajouter l'import pour multer
import AnneeController from '../controllers/AnneeController.js';
import FacultyController from '../controllers/FacultyController.js';
import DepartmentController from '../controllers/DepartmentController.js';
import CursusController from '../controllers/CursusController.js';
import StudentController from '../controllers/StudentController.js';
import UniversityController from '../controllers/UniversityController.js';
import StudentMinistryController from '../controllers/StudentMinistryController.js';
import DiplomasController from '../controllers/DiplomaController.js';


import path from 'path';
import fs from 'fs';

const router = express.Router();

// Utilisez `__dirname` pour obtenir le chemin absolu du répertoire actuel
const __dirname = path.resolve();

// Créez un répertoire 'uploads' dans le même répertoire que votre code
const uploadDir = path.join(__dirname, 'src', 'routes', 'uploads');

// Vérifiez si le répertoire existe, sinon créez-le
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration Multer pour l'upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Assurez-vous que le chemin est correct
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// 1. Universités
router.get('/universities', UniversityController.getUniversities);

// 2. Étudiants
router.get('/students', StudentController.getStudents);
router.post('/students/upload', upload.single('file'), StudentController.uploadStudents);

// 3. Facultés
router.get('/faculties', FacultyController.getAll);
router.get('/faculties-by-university', FacultyController.getFaculties); // Renommer la route pour éviter le conflit
router.post('/faculties/upload', upload.single('file'), FacultyController.uploadFaculties);

// 4. Départements
router.get('/departments/:facultyId', DepartmentController.getByFaculty);
router.post('/departments/upload', upload.single('file'), DepartmentController.uploadDepartments);

// 5. Cursus
router.get('/specialties/:departmentId', CursusController.getSpecialties);
router.get('/levels/:specialty', CursusController.getLevels);
router.get('/sections/:level', CursusController.getSections);
router.get("/students-with-cursus", CursusController.getStudentsWithCursus);
router.get('/students/:matricule', CursusController.getStudentByMatricule);
  
//6. Annee
router.get('/annee', AnneeController.getAnnee);

//7. Etudiants ministere
router.post('/verifier-etudiants', StudentMinistryController.verifierEtudiants);
//8.creation de diplome
router.post('/creer-diplomes', DiplomasController.creerDiplomes);
router.get('/students-by-annee/:idAnnee', StudentController.getStudentsByAnnee);


export default router;
