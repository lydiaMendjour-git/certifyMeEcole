import express from 'express';
import multer from 'multer';
import AnneeController from '../controllers/AnneeController.js';
import FacultyController from '../controllers/FacultyController.js';
import DepartmentController from '../controllers/DepartmentController.js';
import CursusController from '../controllers/CursusController.js';
import StudentController from '../controllers/StudentController.js';
import UniversityController from '../controllers/UniversityController.js';
import authController from '../controllers/authController.js';
import { authenticateToken } from  '../controllers/authenticateToken.js';
import StudentMinistryController from '../controllers/StudentMinistryController.js';
import DiplomasController from '../controllers/DiplomaController.js';
import path from 'path';
import fs from 'fs';


const router = express.Router();

// Get absolute directory path
const __dirname = path.resolve();

// Create uploads directory
const uploadDir = path.join(__dirname, 'src', 'routes', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// 1. University routes
//recupere toutes les universites possible
router.get('/universities', UniversityController.getUniversities);
router.get('/universites-with-account', UniversityController.getAllUniversitiesWithAccount);
router.get('/universites/:universityId', UniversityController.getUniversityById);


// 2. Student routes
router.get('/students-by-annee/:idAnnee', StudentController.getStudentsByAnnee);
router.post('/students/upload', upload.single('file'), StudentController.uploadStudents);

const validateFaculty = (req, res, next) => {
  if (!req.body.nomFaculty || !req.body.idUni) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  next();
};

// 3. Faculty routes
router.get('/faculties', FacultyController.getAll);
//recupere les annees d'une universite
router.get('/faculties-by-university', FacultyController.getFaculties);
router.post('/faculties/upload', upload.single('file'), FacultyController.uploadFaculties);
router.post('/facultiescreate', validateFaculty, FacultyController.createFaculty);
router.put('/facultiesupdate/:id', FacultyController.updateFaculty);
router.delete('/facultiesdelete/:id', FacultyController.deleteFaculty);


// Protéger les routes
router.get('/faculties/:universityId',  authenticateToken, FacultyController.getFacultiesByUniversity);

const validateDepartment = (req, res, next) => {
  if (!req.body.nomDepart || !req.body.idFaculty || !req.body.idUni) {
      return res.status(400).json({ error: 'Missing required fields' });
  }
  next();
};

// 4. Department routes
router.get('/departments/:facultyId', DepartmentController.getByFaculty);
router.post('/departments/upload', upload.single('file'), DepartmentController.uploadDepartments);
router.post('/departmentscreate', validateDepartment, DepartmentController.createDepartment);
router.put('/departmentsupdate/:id', DepartmentController.updateDepartment);
router.delete('/departmentsdelete/:id', DepartmentController.deleteDepartment);


// 5. Cursus routes
router.get('/specialties/:departmentId', CursusController.getSpecialties);
router.get('/levels/:specialty', CursusController.getLevels);
router.get('/sections/:level', CursusController.getSections);
router.get('/students-with-cursus', CursusController.getStudentsWithCursus);
router.get('/students/:matricule', CursusController.getStudentByMatricule);

// 6. Year routes
router.get('/annee', AnneeController.getAnnee);
router.post('/annee-universitaire', AnneeController.addAnneeUniversitaire);
router.get('/annee-uniID/:idUni', AnneeController.getAnneesByUniversity);

//7. Etudiants ministere
router.post('/verifier-etudiants', StudentMinistryController.verifierEtudiants);
//8.creation de diplome
router.post('/creer-diplomes', DiplomasController.creerDiplomes);
router.get('/students-by-annee/:idAnnee', StudentController.getStudentsByAnnee);

//9. validation diplome 
// Diplômes non validés pour une université
router.get('/:universityId/recuperer-diplomes', DiplomasController.getDiplomasToValidate);
// Valider tous les diplômes d'une université
router.post('/:universityId/valider-tous', DiplomasController.validateAllDiplomas);
// Valider un diplôme individuel (pas besoin de l'université ici)
router.post('/:diplomaId/valider', DiplomasController.validateDiploma);
// Diplômes validés pour une université 
router.get('/:universityId/diplomes-valides', DiplomasController.getValidatedDiplomas);
router.post('/:diplomaId/rejeter', DiplomasController.rejectDiploma);


// Auth routes
router.post('/register', authController.register);
router.get('/universities-auth', authController.getUniversitiesAUTH);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/login', authController.login);

// Récupère les infos de l'université connectée via le token


export default router;