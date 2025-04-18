import React, { useState, useEffect } from "react";
import axios from "axios";
import  Header  from '../../components/Header';
import { useRouter } from 'next/router';

// URL de base de l'API
const API_BASE_URL = "http://localhost:3000";

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

  // Charger les universités et années académiques au démarrage
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Charger les universités
        const universitiesResponse = await axios.get(`${API_BASE_URL}/universities`);
        setUniversities(universitiesResponse.data);

        // Charger les années académiques
        const yearsResponse = await axios.get(`${API_BASE_URL}/annee`);
        setAcademicYears(yearsResponse.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données initiales:", error);
      }
    }

    loadInitialData();
  }, []);

  // Gestion du changement d'université
  const handleUniversityChange = async (event) => {
    const universityId = event.target.value;
    setSelectedUniversity(universityId);
    setSelectedFaculty("");
    setSelectedDepartment("");
    
    if (universityId) {
      try {
        const facultiesResponse = await axios.get(`${API_BASE_URL}/faculties-by-university`, { params: { universityId } });
        setFaculties(facultiesResponse.data);
      } catch (error) {
        console.error("Erreur lors du chargement des facultés:", error);
      }
    }
  };

  // Gestion du changement de faculté
  const handleFacultyChange = async (event) => {
    const facultyId = event.target.value;
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

  // Gestion du changement d'année académique
  const handleAcademicYearChange = (event) => {
    setSelectedAcademicYear(event.target.value);
  };

  // Gestion du changement de fichier
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Gestion de l'upload du fichier
  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file || !selectedUniversity || !selectedFaculty || !selectedDepartment || !selectedAcademicYear) {
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
    router.push('/university/universityPage'); // Redirige vers la page universityPage
  };


  return (
    <div>
      <Header />
      <div style={{ marginTop: '100px' }}>
        <h1>Intégration des données étudiantes</h1>
      </div>
      <div className="form-group">
        <label htmlFor="university">Université:</label>
        <select
          id="university"
          value={selectedUniversity}
          onChange={handleUniversityChange}
          required
        >
          <option value="">-- Choisir Université --</option>
          {universities.map((uni) => (
            <option key={uni.idUni} value={uni.idUni}>
              {uni.nomUni}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="faculty">Faculté:</label>
        <select
          id="faculty"
          value={selectedFaculty}
          onChange={handleFacultyChange}
          disabled={!selectedUniversity}
          required
        >
          <option value="">-- Choisir d'abord une université --</option>
          {faculties.map((fac) => (
            <option key={fac.idFaculty} value={fac.idFaculty}>
              {fac.nomFaculty}
            </option>
          ))}
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
        <select
          id="academicYear"
          value={selectedAcademicYear}
          onChange={handleAcademicYearChange}
          required
        >
          <option value="">-- Choisir année --</option>
          {academicYears.map((year) => (
            <option key={year.idAnnee} value={year.idAnnee}>
              {year.annee}
            </option>
          ))}
        </select>
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
