import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header.jsx';
import { useRouter } from 'next/router';

const IntegrationEcole = () => {
  const router = useRouter();
  const [ecoleId, setEcoleId] = useState('');
  const [uploadingFormations, setUploadingFormations] = useState(false);
  const [resultFormations, setResultFormations] = useState(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = localStorage.getItem('ecole_token');

  useEffect(() => {
    const id = localStorage.getItem('ecole_id');
    if (id) setEcoleId(id);
  }, []);

  const handleFormationsSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) {
      alert('Veuillez sélectionner un fichier CSV');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('ecoleId', ecoleId);
    setUploadingFormations(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/formations/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResultFormations(response.data);
    } catch (error) {
      console.error('Erreur upload:', error);
      setResultFormations({
        status: 'error',
        message: error.response?.data?.message || 'Erreur lors de l\'import'
      });
    } finally {
      setUploadingFormations(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <Header/>
      <div style={{ 
        width: '80%', 
        maxWidth: '600px',
        margin: '0 auto', 
        marginTop: '50px', 
        padding: '40px', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#2F855A',
          marginBottom: '30px'
        }}>
          Intégration des Formations
        </h1>

        <form 
          onSubmit={handleFormationsSubmit} 
          encType="multipart/form-data"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div>
            <label style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#2D3748'
            }}>
              Fichier CSV des formations
            </label>
            <input 
              type="file" 
              name="file" 
              accept=".csv" 
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #CBD5E0',
                borderRadius: '4px'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={uploadingFormations}
            style={{
              padding: '12px 20px',
              backgroundColor: uploadingFormations ? '#CBD5E0' : '#2F855A',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'background-color 0.2s',
              alignSelf: 'flex-start'
            }}
          >
            {uploadingFormations ? 'Import en cours...' : 'Importer les formations'}
          </button>
        </form>

        {resultFormations && (
  <div style={{ 
    marginTop: '30px',
    padding: '15px',
    background: resultFormations.status === 'ok' ? '#F0FFF4' : '#FFF5F5', // 'ok' au lieu de 'success'
    borderLeft: `4px solid ${resultFormations.status === 'ok' ? '#38A169' : '#C53030'}`,
    borderRadius: '4px'
  }}>
    <p style={{ 
      fontWeight: '600',
      color: resultFormations.status === 'ok' ? '#2F855A' : '#C53030',
      marginBottom: '8px'
    }}>
      {resultFormations.status === 'ok' ? 'Succès' : 'Erreur'}
    </p>
    <p style={{ color: '#4A5568' }}>{resultFormations.message}</p>
  </div>
)}

        <div style={{ marginTop: '40px', color: '#718096', fontSize: '14px' }}>
          <p>Le fichier CSV doit contenir les colonnes suivantes :</p>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>Nom de la formation</li>
            <li>Type de formation</li>
            <li>Durée (optionnel)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IntegrationEcole;