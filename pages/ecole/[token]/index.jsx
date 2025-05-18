import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { FaFileUpload, FaUsers, FaGraduationCap, FaFileAlt } from 'react-icons/fa';
import Header from "./Header.jsx";
import IntegrationEcole from "./IntegrationEcole";
import IntegrationEtudiantEcole from "./IntegrationEtudiantEcole";
import GestionFormations from "./GestionFormations";
import CreerDiplomeEcole from "./CreerDiplomeEcole";
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

function App() {
  const colors = {
    primary: '#2F855A',
    secondary: '#2D3748',
    accent: '#38A169',
    lightBg: '#F7FAFC',
    darkBg: '#1A202C',
    textDark: '#1C1C1C',
    textLight: '#718096',
    border: '#CBD5E0',
    success: '#2F855A',
    error: '#C53030',
    warning: '#D69E2E'
  };
  
  const router = useRouter();
  const { token } = router.query;
  const [ecoleInfo, setEcoleInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [activeSection, setActiveSection] = useState('gestion');

  useEffect(() => {
    const verifyTokenAndLoadData = async () => {
      try {
        setLoading(true);
        setAuthError(null);

        if (!token) {
          const storedToken = localStorage.getItem('ecole_token');
          if (storedToken) {
            router.push(`/ecole/${storedToken}`);
            return;
          }
          throw new Error("Token manquant");
        }

        const decoded = jwt.decode(token);
        if (!decoded || decoded.role?.trim().toUpperCase() !== 'ECOLE') {
          throw new Error("Accès non autorisé");
        }

        setEcoleInfo({
          id: decoded.ecoleId,
          name: decoded.ecoleName,
        });

        localStorage.setItem('ecole_token', token);
        localStorage.setItem('ecole_id', decoded.ecoleId);
        localStorage.setItem('ecole_name', decoded.ecoleName);

      } catch (error) {
        console.error("Erreur:", error);
        setAuthError(error.message);
        localStorage.removeItem('ecole_token');
      } finally {
        setLoading(false);
      }
    };

    verifyTokenAndLoadData();
  }, [token, router]);

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: colors.lightBg
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: `5px solid ${colors.primary}`,
          borderTopColor: 'transparent'
        }}
      />
    </div>
  );

  if (authError) return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      color: colors.textDark,
      background: colors.lightBg,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h2 style={{ color: colors.accent }}>Erreur d'authentification</h2>
      <p>{authError}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/PageAcceuil/Login')}
        style={{
          marginTop: '1rem',
          padding: '0.8rem 1.5rem',
          background: colors.primary,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        Retour à la connexion
      </motion.button>
    </div>
  );

  return (
    <div style={{
      marginTop: '4.5rem',
      overflowX: 'hidden',
      backgroundColor: "#f6fcf7",
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <Header />
      
      <div style={{
        display: 'flex',
        minHeight: 'calc(100vh - 4.5rem)'
      }}>
        {/* Sidebar Navigation */}
        <div style={{
          width: '250px',
          background: 'white',
          borderRight: `1px solid ${colors.border}`,
          padding: '1.5rem 0',
          boxShadow: '2px 0 10px rgba(0,0,0,0.05)'
        }}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.8rem 1.5rem',
              margin: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              color: activeSection === 'gestion' ? colors.primary : colors.textLight,
              background: activeSection === 'gestion' ? colors.lightBg : 'transparent',
              fontWeight: activeSection === 'gestion' ? '600' : '400',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveSection('gestion')}
          >
            <FaGraduationCap style={{ marginRight: '0.8rem', fontSize: '1.1rem' }} />
            <span>Gestion Formations</span>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.8rem 1.5rem',
              margin: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              color: activeSection === 'integration-ecole' ? colors.primary : colors.textLight,
              background: activeSection === 'integration-ecole' ? colors.lightBg : 'transparent',
              fontWeight: activeSection === 'integration-ecole' ? '600' : '400',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveSection('integration-ecole')}
          >
            <FaFileUpload style={{ marginRight: '0.8rem', fontSize: '1.1rem' }} />
            <span>Intégration Formations</span>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.8rem 1.5rem',
              margin: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              color: activeSection === 'integration-etudiants' ? colors.primary : colors.textLight,
              background: activeSection === 'integration-etudiants' ? colors.lightBg : 'transparent',
              fontWeight: activeSection === 'integration-etudiants' ? '600' : '400',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveSection('integration-etudiants')}
          >
            <FaUsers style={{ marginRight: '0.8rem', fontSize: '1.1rem' }} />
            <span>Intégration Étudiants</span>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.8rem 1.5rem',
              margin: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              color: activeSection === 'creer-diplome' ? colors.primary : colors.textLight,
              background: activeSection === 'creer-diplome' ? colors.lightBg : 'transparent',
              fontWeight: activeSection === 'creer-diplome' ? '600' : '400',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveSection('creer-diplome')}
          >
            <FaFileAlt style={{ marginRight: '0.8rem', fontSize: '1.1rem' }} />
            <span>Créer Diplômes</span>
          </motion.div>
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          padding: '2rem',
          background: colors.lightBg
        }}>
          {activeSection === 'gestion' && <GestionFormations />}
          {activeSection === 'integration-ecole' && <IntegrationEcole />}
          {activeSection === 'integration-etudiants' && <IntegrationEtudiantEcole />}
          {activeSection === 'creer-diplome' && <CreerDiplomeEcole />}
        </div>
      </div>
    </div>
  );
}

export default App;