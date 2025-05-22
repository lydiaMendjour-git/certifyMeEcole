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
import EcoleController from '../controllers/EcoleController.js';
import FormationController from '../controllers/FormationController.js';
import EtudiantEcoleController from '../controllers/EtudiantEcoleController.js';
import EcoleAnneeController from '../controllers/EcoleAnneeController.js';
import CursusEcoleController from '../controllers/CursusEcoleController.js';
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
// Routes pour les diplômes des universités
router.get('/universites/:universityId/diplomes', DiplomasController.getUniversityDiplomas);
router.delete('/:diplomaId/rejeter', DiplomasController.deleteUniversityDiploma);


// 10. Ecole routes
router.get('/ecoles', EcoleController.getEcoles); // Récupérer toutes les écoles
router.get('/ecoles-with-account', EcoleController.getAllEcolesWithAccount); // Récupérer les écoles avec compte
router.get('/ecoles/:ecoleId', EcoleController.getEcoleById); // Récupérer une école par ID
router.get('/ecoles-by-role/:role', EcoleController.getEcolesByRole);


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



// Routes pour les formations
router.post('/formations/create', FormationController.createFormation);
router.put('/formations/update/:id', FormationController.updateFormation);
router.delete('/formations/delete/:id', FormationController.deleteFormation);
router.get('/ecoles/:ecoleId/formations', FormationController.getFormationsByEcole);
router.post('/formations/upload', upload.single('file'), FormationController.uploadFormations);
router.get('/students-by-anneeEcole/:idAnnee',EtudiantEcoleController.getStudentsByAnnee);

// Routes pour les étudiants des écoles
router.get('/formations/:formationId/etudiants', EtudiantEcoleController.getStudentsByFormation);
router.post('/etudiants-ecole/upload', upload.single('file'), EtudiantEcoleController.uploadStudents);
router.post('/etudiants-ecole/create', EtudiantEcoleController.createStudent);
router.put('/etudiants-ecole/update/:id', EtudiantEcoleController.updateStudent);
router.delete('/etudiants-ecole/delete/:id', EtudiantEcoleController.deleteStudent);

// Routes pour les cursus des écoles
router.get('/cursus-ecole/etudiant/:matricule', CursusEcoleController.getStudentByMatricule);
router.get('/cursus-ecole/formation/:formationId/etudiants', CursusEcoleController.getStudentsByFormation);
router.post('/cursus-ecole', CursusEcoleController.createCursus);

// Créer une année scolaire
router.post('/', EcoleAnneeController.create);

// Récupérer les années d'une école
router.get('/ecole/:ecoleId', EcoleAnneeController.getByEcole);

// Définir une année comme courante
router.put('/:id/set-current', EcoleAnneeController.setCurrent);

// Supprimer une année
router.delete('/:id', EcoleAnneeController.delete);


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
router.get('/historique', authenticateToken, DiplomasController.getHistorique);
router.post('/creer-diplomes', DiplomasController.creerDiplomes);

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


//route pour demander un diplôme par un étudiant
router.post('/demande-diplome', DiplomasController.demanderDiplome);
//route pour verifier un diplôme par url
router.get('/verifier-diplome/:hash', DiplomasController.verifierDiplome);


// Récupérer les étudiants d'une formation
router.get('/formations/:formationId/etudiants', FormationController.getStudentsByFormation);

router.get('/formations/:formationId/:idAnnee', EtudiantEcoleController.getStudentsByFormationAndAnnee);


// Créer des diplômes pour école
router.post('/creer-diplomes-ecole', DiplomasController.creerDiplomesEcole);
// Auth routes
router.post('/register', authController.register);
router.get('/universities-auth', authController.getUniversitiesAUTH);
router.get('/ecoles-auth', authController.getEcolesAUTH);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/login', authController.login);



// Routes pour les diplômes des écoles
router.get('/ecoles/:ecoleId/diplomes-a-valider', DiplomasController.getEcoleDiplomasToValidate);
router.post('/ecoles/:ecoleId/valider-tous-diplomes', DiplomasController.validateAllEcoleDiplomas);
router.post('/ecoles/diplomes/:diplomaId/valider', DiplomasController.validateEcoleDiploma);
router.get('/ecoles/:ecoleId/diplomes-valides', DiplomasController.getValidatedEcoleDiplomas);
router.post('/ecoles/diplomes/:diplomaId/rejeter', DiplomasController.rejectEcoleDiploma);
router.post('/demande-diplome-ecole', DiplomasController.demanderDiplomeEcole);
router.get('/verifier-diplome-ecole/:hash', DiplomasController.verifierDiplomeEcole);
router.get('/ecoles/:ecoleId/diplomes', DiplomasController.getEcoleDiplomes);
router.delete('/ecoles/diplomes/:diplomaId', DiplomasController.deleteEcoleDiploma);

router.get('/departments/:departmentId/students', StudentController.getStudentsByDepartment);
router.post('/students/create', StudentController.createStudent);
router.put('/students/update/:id', StudentController.updateStudent);
router.delete('/students/delete/:id', StudentController.deleteStudent);

export default router;