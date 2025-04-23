import React, { useState, useEffect } from 'react';
import axios from 'axios';
import  Header  from './Header.jsx';
import { useRouter } from 'next/router';

// URL de base de l'API
const API_BASE_URL = "http://localhost:5000";

const IntegrationBd = () => {
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [uploadingFaculties, setUploadingFaculties] = useState(false);
  const [uploadingDepartments, setUploadingDepartments] = useState(false);
  const [resultFaculties, setResultFaculties] = useState(null);
  const [resultDepartments, setResultDepartments] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    async function loadUniversities() {
      try {
        const response = await axios.get(`${API_BASE_URL}/universities`);
        console.log(response.data); // Vérifie les données ici
        setUniversities(response.data);
      } catch (error) {
        console.error(error);
      }
    }
   
    loadUniversities();
  }, []);
   
  useEffect(() => {
    const fetchFaculties = async () => {
      const universityId = localStorage.getItem('university_id');
      if (!universityId) {
        console.warn("ID université non trouvé !");
        return;
      }
  
      try {
        const response = await axios.get(`${API_BASE_URL}/faculties/${universityId}`, {
          headers: {
          Authorization: `Bearer ${localStorage.getItem('uni_token')}`,
            },
        });
  
        if (response.data.success) {
          setFaculties(response.data.data);
        } else {
          console.warn("Pas de facultés trouvées pour cette université");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des facultés:", error);
      }
    };
  
    fetchFaculties();
  }, []);

  
  // Téléchargement des facultés
  const handleFacultiesSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    // Vérification de la taille du fichier
    if (file.size > 5 * 1024 * 1024) { // 5 Mo max
      alert('Le fichier est trop volumineux. Veuillez télécharger un fichier de moins de 5 Mo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    const universityId = localStorage.getItem('university_id');
    console.log("universityId récupéré :", universityId);
     formData.append('universityId', universityId);
     setUploadingFaculties(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/faculties/upload`, formData);
      setResultFaculties(response.data);

      // Optionnel: Recharger les facultés de cette université
      const facultiesResponse  = await axios.get(`${API_BASE_URL}/faculties/${universityId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('uni_token')}`,
        }
    });
    setFaculties(facultiesResponse.data.data); // ✅

    } catch (error) {
      console.error('Erreur lors de l\'upload :', error.response ? error.response.data : error.message);
    } finally {
      setUploadingFaculties(false);
    }
  };

  // Téléchargement des départements
  const handleDepartmentsSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    // Vérification de la taille du fichier
    if (file.size > 5 * 1024 * 1024) { // 5 Mo max
      alert('Le fichier est trop volumineux. Veuillez télécharger un fichier de moins de 5 Mo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('facultyId', selectedFaculty);
    setUploadingDepartments(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/departments/upload`, formData);
      setResultDepartments(response.data);

      // Optionnel: Recharger les départements de cette faculté
      const departmentsResponse = await axios.get(`${API_BASE_URL}/departments/${selectedFaculty}`);
      setFaculties(departmentsResponse.data);  // Mettre à jour avec les départements, pas les facultés
    } catch (error) {
      console.error('Erreur lors de l\'upload des départements :', error.response ? error.response.data : error.message);
    } finally {
      setUploadingDepartments(false);
    }
  };

   const handleGoBack = () => {
      const token = localStorage.getItem('uni_token');
      if (token) {
        const safeToken = encodeURIComponent(token);
        router.push(`/university/${safeToken}`);
      }  };

      const handleGoGestion = () => {
        const token = localStorage.getItem('uni_token');
        if (token) {
          const safeToken = encodeURIComponent(token);
          router.push(`/university/GestionFacuDept?token=${safeToken}`);
  }  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
     <Header/>
      <div className="container" style={{ width: '80%', margin: '0 auto',marginTop: '100px', padding: '60px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ color: '#3498db', textAlign: 'center' }}>Gestion des Facultés et Départements</h1>

      

        {/* Étape 2 : Intégrer les facultés */}
        <form id="uploadFaculties" encType="multipart/form-data" onSubmit={handleFacultiesSubmit}>
          <input type="file" name="file" accept=".csv" required />
          <button type="submit" className="btn" style={{ backgroundColor: '#3498db', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }} disabled={uploadingFaculties}>
            {uploadingFaculties ? 'Téléchargement en cours...' : 'Téléchargez le fichier CSV des facultés'}
          </button>
        </form>

        {resultFaculties && (
          <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
            <p><strong>Statut:</strong> {resultFaculties.status}</p>
            <p><strong>Fichier:</strong> {resultFaculties.filename}</p>
            <p><strong>Message:</strong> {resultFaculties.message}</p>
            {resultFaculties.count && <p><strong>Facultés importées:</strong> {resultFaculties.count}</p>}
          </div>
        )}

        {/* Étape 3 : Choisir une faculté */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="faculty" style={{ fontWeight: 'bold' }}>Sélectionnez une faculté :</label>
          <select id="faculty" onChange={(e) => setSelectedFaculty(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
            <option value="">--Choisir une faculté--</option>
            {faculties.map((fac) => (
              <option key={fac.idFaculty} value={fac.idFaculty}>{fac.nomFaculty}</option>
            ))}
          </select>
        </div>

        {/* Étape 4 : Intégrer les départements */}
        <form id="uploadDepartments" encType="multipart/form-data" onSubmit={handleDepartmentsSubmit}>
          <input type="file" name="file" accept=".csv" required />
          <button type="submit" className="btn" style={{ backgroundColor: '#3498db', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }} disabled={uploadingDepartments}>
            {uploadingDepartments ? 'Téléchargement en cours...' : 'Téléchargez le fichier CSV des départements'}
          </button>
        </form>

        {resultDepartments && (
          <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
            <p><strong>Statut:</strong> {resultDepartments.status}</p>
            <p><strong>Fichier:</strong> {resultDepartments.filename}</p>
            <p><strong>Message:</strong> {resultDepartments.message}</p>
            {resultDepartments.count && <p><strong>Départements importés:</strong> {resultDepartments.count}</p>}
          </div>
        )}

        <button
          onClick={handleGoBack}
          style={{ backgroundColor: '#e74c3c', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}
        >
          Retour
        </button>
        <button
          onClick={handleGoGestion}
          style={{ backgroundColor: '#e74c3c', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}
        >
          Gestion
        </button>

      </div>
      
    </div>
  );
};

export default IntegrationBd;
