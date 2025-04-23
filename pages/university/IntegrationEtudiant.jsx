import React, { useState, useEffect } from "react";
import axios from "axios";
import  Header  from './Header.jsx';
import { useRouter } from 'next/router';

// URL de base de l'API
const API_BASE_URL = "http://localhost:5000";

const IntegrationEtudiant = () => {
  // États locaux pour stocker les données des formulaires
  const [universities, setUniversities] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const router = useRouter();


  useEffect(() => {
    const universityId = localStorage.getItem('university_id');
    
    if (!universityId) {
      console.warn("ID université non trouvé !");
      return;
    }
  
    setSelectedUniversity(universityId);
    setSelectedFaculty("");
    setSelectedDepartment("");
  
    // Charger les facultés dès que l'université est trouvée
    const fetchFaculties = async () => {
      try {
        const facultiesResponse = await axios.get(`${API_BASE_URL}/faculties-by-university`, { params: { universityId } });
        setFaculties(facultiesResponse.data);  // On suppose que la réponse est un tableau de facultés
      } catch (error) {
        console.error("Erreur lors du chargement des facultés:", error);
      }
    };
  
    fetchFaculties();
  }, []);  // Ce useEffect ne s'exécute qu'une fois au démarrage du composant
  


  // Gestion du changement de faculté
  const handleFacultyChange = async (event) => {
    const facultyId = event.target.value;
    console.log("ID faculté sélectionnée :", facultyId);
    setSelectedFaculty(facultyId);
    setSelectedDepartment("");
    
    if (facultyId) {
      try {
        const departmentsResponse = await axios.get(`${API_BASE_URL}/departments/${facultyId}`, { params: { facultyId } });
        setDepartments(departmentsResponse.data);
      } catch (error) {
        console.error("Erreur lors du chargement des départements:", error);
      }
    }
  };

  // Gestion du changement de département
  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };
    
  const [academicYearInput, setAcademicYearInput] = useState("");
const [academicYearError, setAcademicYearError] = useState("");

const handleAcademicYearInput = async (e) => {
  const inputValue = e.target.value;
  setAcademicYearInput(inputValue);
  setAcademicYearError("");

  if (!/^\d{4}\/\d{4}$/.test(inputValue)) {
    setAcademicYearError("Le format doit être AAAA/AAAA");
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/annee-universitaire`, { annee: inputValue });
    setSelectedAcademicYear(response.data.data.idAnnee);
    console.log("Réponse année académique :", response.data.data.idAnnee);

  } catch (err) {
    if (err.response?.data?.error) {
      setAcademicYearError(err.response.data.error);
    } else {
      setAcademicYearError("Erreur serveur. Veuillez réessayer.");
    }
  }
};


  // Gestion du changement de fichier
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Gestion de l'upload du fichier
  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file  || !selectedFaculty || !selectedDepartment ) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("facultyId", selectedFaculty);
    formData.append("departmentId", selectedDepartment);
    formData.append("anneeId", selectedAcademicYear);

    try {
      const response = await axios.post(`${API_BASE_URL}/students/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadResult(response.data);
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier:", error);
      setUploadResult({ status: "fail", message: "Erreur lors de l'upload du fichier." });
    }
  };
   const handleGoBack = () => {
      const token = localStorage.getItem('uni_token');
      if (token) {
        const safeToken = encodeURIComponent(token);
        router.push(`/university/${safeToken}`);
      }  };


  return (
    <div>
      <Header />
      <div style={{ marginTop: '100px' }}>
        <h1>Intégration des données étudiantes</h1>
      </div>

      <div className="form-group">
  <label htmlFor="faculty">Faculté:</label>
  <select
    id="faculty"
    value={selectedFaculty}
    onChange={handleFacultyChange}  // La gestion du changement de faculté
    required
  >
    <option value="">-- Choisir une faculté --</option>
    {faculties.length > 0 ? (
      faculties.map((fac) => (
        <option key={fac.idFaculty} value={fac.idFaculty}>
          {fac.nomFaculty}
        </option>
      ))
    ) : (
      <option value="">Aucune faculté disponible</option>
    )}
  </select>
</div>



      <div className="form-group">
        <label htmlFor="department">Département:</label>
        <select
          id="department"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          disabled={!selectedFaculty}
          required
        >
          <option value="">-- Choisir d'abord une faculté --</option>
          {departments.map((dept) => (
            <option key={dept.idDepart} value={dept.idDepart}>
              {dept.nomDepart}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
  <label htmlFor="academicYear">Année académique:</label>
  <input
    type="text"
    id="academicYear"
    value={academicYearInput}
    onChange={handleAcademicYearInput}
    placeholder="ex: 2024/2025"
    required
  />
  {academicYearError && (
    <p style={{ color: "red", marginTop: "5px" }}>{academicYearError}</p>
  )}
</div>


      <h2>Upload de fichier CSV</h2>
      <form id="uploadForm" onSubmit={handleUpload} encType="multipart/form-data">
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Importer Étudiants</button>
        <button
          onClick={handleGoBack}
          style={{ backgroundColor: '#e74c3c', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}
        >
          Retour à la page principale
        </button>
      </form>

      {uploadResult && (
        <div id="result" style={{ marginTop: "20px", padding: "10px", background: "#f0f0f0" }}>
          <p><strong>Statut:</strong> {uploadResult.status}</p>
          <p><strong>Fichier:</strong> {uploadResult.filename}</p>
          <p><strong>Message:</strong> {uploadResult.message}</p>
          {uploadResult.count && <p><strong>Étudiants importés:</strong> {uploadResult.count}</p>}
        </div>
      )}
    </div>
  );
};

export default IntegrationEtudiant;
