import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from "./Header.jsx";

function ListeDiplomesUniversite() {
  const router = useRouter();
  const { token } = router.query;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // États
  const [diplomes, setDiplomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filters, setFilters] = useState({
    statut: 'TOUS', // 'TOUS', 'VALIDES', 'EN_ATTENTE'
    annee: ''
  });

  // Récupérer l'ID de l'université
  const universityId = typeof window !== 'undefined' ? localStorage.getItem('university_id') : null;

  // Charger les diplômes
  useEffect(() => {
    const chargerDiplomes = async () => {
  try {
    setLoading(true);
    setError(null);
    
    if (!universityId) {
      throw new Error("ID de l'université non trouvé");
    }

    // Toujours utiliser le même endpoint
    const response = await axios.get(`${API_BASE_URL}/universites/${universityId}/diplomes`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { annee: filters.annee || undefined }
    });

    // Filtrer côté client en fonction du statut
    let filteredDiplomes = response.data || [];
    
    if (filters.statut === 'VALIDES') {
      filteredDiplomes = filteredDiplomes.filter(d => d.complete);
    } else if (filters.statut === 'EN_ATTENTE') {
      filteredDiplomes = filteredDiplomes.filter(d => !d.complete);
    }

    setDiplomes(filteredDiplomes);
  } catch (err) {
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

    if (universityId && token) {
      chargerDiplomes();
    }
  }, [universityId, token, filters.statut, filters.annee]);

  // Supprimer un diplôme
  const supprimerDiplome = async (diplomeId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce diplôme ? Cette action est irréversible.")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.delete(`${API_BASE_URL}/universites/${universityId}/diplomes/${diplomeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccessMessage("Diplôme supprimé avec succès");
        // Recharger la liste
        setDiplomes(prev => prev.filter(d => d.id !== diplomeId));
      } else {
        throw new Error(response.data.message || "Erreur lors de la suppression");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  // Formater la date
  const formaterDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };



  return (
    <div>
      <Header /> {/* Ajoutez le Header ici */}
      
      <div className="container" style={{ marginTop: '100px' }}> {/* Ajoutez une marge pour compenser le header fixe */}
        <h1>Gestion des diplômes</h1>
        <p className="subtitle">Liste des diplômes créés par votre établissement</p>
        
        {/* Filtres */}
        <div className="filters">
          <select
            value={filters.statut}
            onChange={(e) => setFilters({...filters, statut: e.target.value})}
          >
            <option value="TOUS">Tous les diplômes</option>
            <option value="VALIDES">Diplômes validés</option>
            <option value="EN_ATTENTE">En attente de validation</option>
          </select>

          <input
            type="text"
            placeholder="Filtrer par année (ex: 2023)"
            value={filters.annee}
            onChange={(e) => setFilters({...filters, annee: e.target.value})}
          />
        </div>

        {/* Messages */}
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Liste des diplômes */}
        {loading ? (
          <div className="loading">Chargement en cours...</div>
        ) : diplomes.length === 0 ? (
          <div className="no-data">Aucun diplôme trouvé</div>
        ) : (
          <div className="diplomes-list">
            <table>
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Type de diplôme</th>
                  <th>Spécialité</th>
                  <th>Date de création</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {diplomes.map(diplome => (
                  <tr key={diplome.id}>
                    <td>{diplome.studentName}</td>
                    <td>{diplome.diplomaTitle}</td>
                    <td>{diplome.speciality}</td>
                    <td>{formaterDate(diplome.dateOfIssue)}</td>
                    <td>
                      <span className={`status-badge ${diplome.complete ? 'validated' : 'pending'}`}>
                        {diplome.complete ? 'Validé' : 'En attente'}
                      </span>
                    </td>
                    <td>
                      {!diplome.complete && (
                        <button 
                          onClick={() => supprimerDiplome(diplome.id)}
                          className="delete-btn"
                          disabled={loading}
                        >
                          Supprimer
                        </button>
                      )}
                      {diplome.complete && <span className="no-action">Aucune action</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        h1 {
          color: #2c3e50;
          margin-bottom: 5px;
        }
        
        .subtitle {
          color: #7f8c8d;
          margin-bottom: 20px;
          font-size: 1.1rem;
        }
        
        .filters {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
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
        
        input {
          flex-grow: 1;
          max-width: 200px;
        }
        
        .success-message {
          background-color: #d4edda;
          color: #155724;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .loading, .no-data {
          text-align: center;
          padding: 20px;
          color: #7f8c8d;
        }
        
        .diplomes-list {
          overflow-x: auto;
          margin-top: 20px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
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
        
        .status-badge {
          padding: 5px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .status-badge.validated {
          background-color: #d4edda;
          color: #155724;
        }
        
        .status-badge.pending {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .delete-btn {
          padding: 5px 10px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .delete-btn:hover {
          background-color: #c82333;
        }
        
        .delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .no-action {
          color: #6c757d;
          font-style: italic;
        }
        
        @media (max-width: 768px) {
          .filters {
            flex-direction: column;
          }
          
          select, input {
            width: 100%;
            max-width: none;
          }
          
          th, td {
            padding: 8px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ListeDiplomesUniversite;