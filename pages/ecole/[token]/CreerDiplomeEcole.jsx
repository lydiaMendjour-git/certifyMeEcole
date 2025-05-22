import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import axios from 'axios';
import jwt from 'jsonwebtoken';

function CreerDiplomeEcole() {
  const router = useRouter();
  const { token } = router.query;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // États des données
  const [formations, setFormations] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [students, setStudents] = useState([]);
  const [ecoleType, setEcoleType] = useState(null);
  const [diplomeTypes, setDiplomeTypes] = useState([]);
  const [defaultDiplomeType, setDefaultDiplomeType] = useState("");
  const [customDiplomaName, setCustomDiplomaName] = useState("");
  const [showCustomDiplomaInput, setShowCustomDiplomaInput] = useState(false);
  
  // États de l'interface
  const [etudiantsSelectionnes, setEtudiantsSelectionnes] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [titreDiplome, setTitreDiplome] = useState("");
  const [diplomeType, setDiplomeType] = useState("");
  const [loading, setLoading] = useState({
    annees: false,
    formations: false,
    students: false,
    creation: false,
    search: false
  });
  const [error, setError] = useState(null);
  const [searchMatricule, setSearchMatricule] = useState("");

  // Filtres
  const [filters, setFilters] = useState({
    anneeId: "",
    formationId: "",
  });

  // Déterminer le type d'école et les diplômes disponibles
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const token = localStorage.getItem('ecole_token') || token;
        const decoded = jwt.decode(token);
        const type = decoded?.roleEcole;
        setEcoleType(type);

        if (type === 'ECOLE_SUPERIEURE') {
          setDiplomeTypes([
            'Licence académique',
            'Licence professionnelle',
            'Master académique',
            'Master professionnel',
            'Diplôme d\'Ingénieur d\'État',
            'Diplôme de l\'École Normale Supérieure (ENS)',
            'Diplôme de l\'École Supérieure de Commerce (ESC)',
            'Autre (à préciser)'
          ]);
          setDefaultDiplomeType('Licence académique');
          setDiplomeType('SUPERIEUR');
        } else {
          setDiplomeTypes([
            'Certificat de Qualification Professionnelle (CQP)',
            'Certificat d\'Aptitude Professionnelle (CAP)',
            'Brevet de Technicien (BT)',
            'Brevet de Technicien Supérieur (BTS)',
            'Technicien Spécialisé (TS)',
            'Diplôme de Technicien Supérieur (DTS)',
            'Technicien (T)',
            'Agent Technique',
            'Autre (à préciser)'
          ]);
          setDefaultDiplomeType('Brevet de Technicien Supérieur (BTS)');
          setDiplomeType('PROFESSIONNEL');
        }

        setTitreDiplome(defaultDiplomeType);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    loadInitialData();
  }, [token]);

  // Gérer la sélection du diplôme
  const handleDiplomaTypeChange = (e) => {
    const selectedValue = e.target.value;
    setTitreDiplome(selectedValue);
    setShowCustomDiplomaInput(selectedValue === 'Autre (à préciser)');
    if (selectedValue !== 'Autre (à préciser)') {
      setCustomDiplomaName("");
    }
  };

  // Chargement des années scolaires
  useEffect(() => {
    const loadAnnees = async () => {
      try {
        setLoading(prev => ({...prev, annees: true}));
        setError(null);
        
        const ecoleId = localStorage.getItem('ecole_id');
        if (!ecoleId) throw new Error("ID de l'école non trouvé");

        const response = await axios.get(`${API_BASE_URL}/ecole/${ecoleId}`, { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        });
        
        setAnnees(response.data?.data || response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(prev => ({...prev, annees: false}));
      }
    };

    if (token) loadAnnees();
  }, [token]);

  // Chargement des formations
  useEffect(() => {
    const loadFormations = async () => {
      if (!filters.anneeId) return;

      try {
        setLoading(prev => ({...prev, formations: true}));
        setError(null);
        
        const ecoleId = localStorage.getItem('ecole_id');
        const response = await axios.get(`${API_BASE_URL}/ecoles/${ecoleId}/formations`, { 
          params: { anneeId: filters.anneeId },
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        });
        
        setFormations(response.data?.data || response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(prev => ({...prev, formations: false}));
      }
    };

    if (token) loadFormations();
  }, [filters.anneeId, token]);

  // Chargement des étudiants
  useEffect(() => {
    const loadStudents = async () => {
      if (!filters.anneeId) return;

      try {
        setLoading(prev => ({...prev, students: true}));
        setError(null);

        let endpoint = filters.formationId 
          ? `${API_BASE_URL}/formations/${filters.formationId}/etudiants`
          : `${API_BASE_URL}/students-by-anneeEcole/${filters.anneeId}`;
          
        const response = await axios.get(endpoint, {
          params: { anneeId: filters.anneeId },
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        });

        setStudents(response.data?.data || response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(prev => ({...prev, students: false}));
      }
    };

    if (token && !searchMatricule) loadStudents();
  }, [filters.anneeId, filters.formationId, token, searchMatricule]);

  // Gestion des sélections
  const handleCheckboxChange = (id) => {
    setEtudiantsSelectionnes(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setEtudiantsSelectionnes(prev => 
      prev.length === students.length ? [] : students.map(s => s.idEtudiantEcole)
    );
  };

  // Création des diplômes
  const confirmerCreationDiplomes = async () => {
    try {
      setLoading(prev => ({...prev, creation: true}));
      setError(null);

      // Validate all required fields
      const finalDiplomaName = showCustomDiplomaInput ? customDiplomaName : titreDiplome;
      
      if (!finalDiplomaName) {
        throw new Error("Veuillez sélectionner ou saisir un type de diplôme");
      }
      
      if (etudiantsSelectionnes.length === 0) {
        throw new Error("Veuillez sélectionner au moins un étudiant");
      }

      const payload = {
        anneeId: Number(filters.anneeId),
        titreDiplome: finalDiplomaName,
        diplomeType: ecoleType === 'ECOLE_SUPERIEURE' ? 'SUPERIEUR' : 'PROFESSIONNEL',
        etudiants: etudiantsSelectionnes.map(id => ({ idEtudiantEcole: Number(id) })),
        etablissement: localStorage.getItem('ecole_name') || "Établissement non spécifié"
      };

      const response = await axios.post(`${API_BASE_URL}/creer-diplomes-ecole`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (!response.data.success) {
        if (response.data.errors) {
          const errorMessages = response.data.errors.map(e => 
            `Étudiant ${e.idEtudiantEcole}: ${e.error}`
          ).join('\n');
          throw new Error(`Erreurs de création:\n${errorMessages}`);
        }
        throw new Error(response.data.message || "Erreur lors de la création");
      }

      alert(`${response.data.count} diplôme(s) créé(s) avec succès !`);
      setFormVisible(false);
      setEtudiantsSelectionnes([]);
      setSearchMatricule("");
      setCustomDiplomaName("");
      setShowCustomDiplomaInput(false);
    } catch (error) {
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.map(e => e.error).join('\n')
        : error.message;
      
      setError(errorMessage);
    } finally {
      setLoading(prev => ({...prev, creation: false}));
    }
  };

  // Fonction de recherche par matricule
  const rechercherParMatricule = async () => {
    if (!searchMatricule.trim()) {
      setError("Veuillez entrer un matricule");
      return;
    }

    try {
      setLoading(prev => ({...prev, search: true}));
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/cursus-ecole/etudiant/${encodeURIComponent(searchMatricule)}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      });

      if (response.data) {
        const studentData = response.data;
        const formattedStudent = {
          idEtudiantEcole: studentData.id || studentData.idEtudiantEcole,
          nom: studentData.nom,
          prenom: studentData.prenom,
          matricule: studentData.matricule
        };
        setStudents([formattedStudent]);
      } else {
        setError("Aucun étudiant trouvé avec ce matricule");
        setStudents([]);
      }
    } catch (err) {
      console.error("Erreur recherche:", err);
      setError(err.response?.data?.error || err.message || "Erreur lors de la recherche");
      setStudents([]);
    } finally {
      setLoading(prev => ({...prev, search: false}));
    }
  };

  // Réinitialiser la recherche
  const resetSearch = () => {
    setSearchMatricule("");
    setError(null);
    if (filters.anneeId) {
      const loadStudents = async () => {
        try {
          setLoading(prev => ({...prev, students: true}));
          
          let endpoint = filters.formationId 
            ? `${API_BASE_URL}/formations/${filters.formationId}/etudiants`
            : `${API_BASE_URL}/students-by-anneeEcole/${filters.anneeId}`;

          const response = await axios.get(endpoint, {
            params: { anneeId: filters.anneeId },
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000
          });

          setStudents(response.data?.data || response.data || []);
        } catch (err) {
          setError(err.response?.data?.message || err.message);
        } finally {
          setLoading(prev => ({...prev, students: false}));
        }
      };
      loadStudents();
    }
  };

  return (
    <div className="container">
      <h1>Création de diplômes</h1>
      
      {/* Filtres */}
      <div className="filters">
        <select
          value={filters.anneeId}
          onChange={(e) => setFilters({...filters, anneeId: e.target.value, formationId: ""})}
          disabled={loading.annees}
        >
          <option value="">Sélectionnez une année</option>
          {annees.map(a => (
            <option key={a.id} value={a.id}>{a.annee}</option>
          ))}
        </select>

        <select
          value={filters.formationId}
          onChange={(e) => setFilters({...filters, formationId: e.target.value})}
          disabled={!filters.anneeId || loading.formations}
        >
          <option value="">Sélectionnez une formation</option>
          {formations.map(f => (
            <option key={f.idFormation} value={f.idFormation}>{f.nomFormation}</option>
          ))}
        </select>
      </div>

      {/* Recherche par matricule */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Rechercher par matricule"
          value={searchMatricule}
          onChange={(e) => setSearchMatricule(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && rechercherParMatricule()}
        />
        <button 
          onClick={rechercherParMatricule}
          disabled={loading.search || !searchMatricule.trim()}
        >
          {loading.search ? "Recherche..." : "Rechercher"}
        </button>
        {searchMatricule && (
          <button onClick={resetSearch}>
            Réinitialiser
          </button>
        )}
      </div>

      {/* Liste des étudiants */}
      <div className="student-list">
        <div className="action-buttons">
          <button onClick={handleSelectAll}>
            {etudiantsSelectionnes.length === students.length ? "Tout désélectionner" : "Tout sélectionner"}
          </button>

          <button 
            onClick={() => setFormVisible(true)} 
            disabled={!etudiantsSelectionnes.length}
          >
            Créer diplômes ({etudiantsSelectionnes.length})
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <table>
          <thead>
            <tr>
              <th>Sélection</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Matricule</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map(student => (
                <tr key={student.idEtudiantEcole}>
                  <td>
                    <input
                      type="checkbox"
                      checked={etudiantsSelectionnes.includes(student.idEtudiantEcole)}
                      onChange={() => handleCheckboxChange(student.idEtudiantEcole)}
                    />
                  </td>
                  <td>{student.nom}</td>
                  <td>{student.prenom}</td>
                  <td>{student.matricule}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{textAlign: 'center'}}>
                  {loading.students ? "Chargement..." : "Aucun étudiant trouvé"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmation */}
      {formVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirmer la création</h2>
            
            <div className="form-group">
              <label>Type de diplôme:</label>
              <select
                value={titreDiplome}
                onChange={handleDiplomaTypeChange}
                required
              >
                {diplomeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {showCustomDiplomaInput && (
              <div className="form-group">
                <label>
                  Nom du diplôme personnalisé ({ecoleType === 'ECOLE_SUPERIEURE' 
                    ? 'Reconnu par le Ministère de l\'Enseignement Supérieur' 
                    : 'Reconnu par le Ministère de la Formation Professionnelle'})
                </label>
                <input
                  type="text"
                  value={customDiplomaName}
                  onChange={(e) => setCustomDiplomaName(e.target.value)}
                  placeholder="Entrez le nom officiel du diplôme"
                  required={showCustomDiplomaInput}
                />
                <p className="hint-text">
                  Ce diplôme doit être préalablement reconnu par le {ecoleType === 'ECOLE_SUPERIEURE' 
                    ? 'Ministère de l\'Enseignement Supérieur' 
                    : 'Ministère de la Formation Professionnelle'}
                </p>
              </div>
            )}

            <div className="form-group">
              <label>Type d'établissement:</label>
              <input
                type="text"
                value={ecoleType === 'ECOLE_SUPERIEURE' 
                  ? 'Établissement d\'Enseignement Supérieur' 
                  : 'Centre de Formation Professionnelle'}
                readOnly
                disabled
              />
            </div>

            <div className="selected-count">
              {etudiantsSelectionnes.length} étudiant(s) sélectionné(s)
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setFormVisible(false);
                  setError(null);
                  setCustomDiplomaName("");
                  setShowCustomDiplomaInput(false);
                }}
              >
                Annuler
              </button>
              <button 
                className="confirm-btn"
                onClick={confirmerCreationDiplomes}
                disabled={
                  !titreDiplome || 
                  loading.creation || 
                  (showCustomDiplomaInput && !customDiplomaName)
                }
              >
                {loading.creation ? "Création en cours..." : "Confirmer la création"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .container { 
          padding: 20px; 
          max-width: 1200px;
          margin: 0 auto;
        }
        h1 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        .filters, .search-box { 
          display: flex; 
          gap: 10px; 
          margin-bottom: 20px; 
          align-items: center;
          flex-wrap: wrap;
        }
        select, input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        select {
          min-width: 200px;
        }
        .search-box input {
          flex-grow: 1;
          max-width: 300px;
        }
        button {
          padding: 8px 16px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #2980b9;
        }
        button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        .action-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }
        .student-list {
          margin-top: 20px;
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        th, td {
          padding: 12px 15px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
          font-weight: 600;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
        .error-message {
          color: #e74c3c;
          padding: 10px;
          margin: 10px 0;
          background-color: #fdecea;
          border-radius: 4px;
          border-left: 4px solid #e74c3c;
        }
        .modal { 
          position: fixed; 
          top: 0; 
          left: 0; 
          width: 100%; 
          height: 100%; 
          background: rgba(0,0,0,0.5); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          z-index: 1000;
        }
        .modal-content { 
          background: white; 
          padding: 25px; 
          border-radius: 8px; 
          width: 450px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .modal-content h2 {
          margin-top: 0;
          color: #2c3e50;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .selected-count {
          margin: 15px 0;
          font-style: italic;
          color: #7f8c8d;
        }
        .modal-actions { 
          display: flex; 
          justify-content: flex-end; 
          gap: 10px; 
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }
        .cancel-btn {
          background-color: #95a5a6;
        }
        .cancel-btn:hover {
          background-color: #7f8c8d;
        }
        .confirm-btn {
          background-color: #27ae60;
        }
        .confirm-btn:hover {
          background-color: #219955;
        }
        .hint-text {
          font-size: 0.8rem;
          color: #666;
          margin-top: 0.5rem;
          font-style: italic;
        }
        @media (max-width: 768px) {
          .filters, .search-box {
            flex-direction: column;
            align-items: stretch;
          }
          select, input {
            width: 100%;
            max-width: none;
          }
          .modal-content {
            width: 90%;
          }
        }
      `}</style>
    </div>
  );
}

export default CreerDiplomeEcole;