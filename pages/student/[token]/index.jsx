import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { FaUniversity, FaSearch, FaChartLine, FaUserGraduate, FaCheckCircle } from 'react-icons/fa';
import Header from "./Header.jsx";
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import DemandeDiplome from './DemandeDiplome';
import VerificationDiplome from "./VerificationDiplome.jsx";

function App() {
 
  const colors = {
    primary: '#2F855A',       // Vert validation – sérieux, rassurant
    secondary: '#2D3748',     // Gris charbon – autorité, modernité
    accent: '#38A169',        // Vert accent – pour boutons/CTA
    lightBg: '#F7FAFC',       // Fond clair neutre – pro et clean
    darkBg: '#1A202C',        // Fond sombre – header/footer élégant
    textDark: '#1C1C1C',      // Texte principal – bonne lisibilité
    textLight: '#718096',     // Texte secondaire – descriptions, placeholders
    border: '#CBD5E0',        // Bordures subtiles – pour structurer sans surcharger
    success: '#2F855A',       // Succès – même que primary pour cohérence
    error: '#C53030',         // Erreur – rouge sérieux
    warning: '#D69E2E'        // Avertissement – or doux, pas criard
  };
   
  const router = useRouter();
  const { token } = router.query;
  const safeToken = encodeURIComponent(token || ''); 

  
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Chargement trop long, vérifiez la connexion");
        setAuthError("Timeout de chargement");
        setLoading(false);
      }
    }, 50000); // 10 secondes
  
    return () => clearTimeout(timeout);
  }, [loading]);
useEffect(() => {
  console.log("Token from URL:", token); // Debug
}, [token]);

  

  useEffect(() => {
    const verifyTokenAndLoadData = async () => {
      try {
        setLoading(true); // Commence le chargement
        setAuthError(null); // Reset les erreurs
  
        // 1. Vérification du token
        if (!token) {
          const storedToken = localStorage.getItem('student_token');
          if (storedToken) {
            router.push(`/student/${storedToken}`);
            return;
          }
          throw new Error("Token manquant");
        }
  
        // 2. Décodage et vérification
        const decoded = jwt.decode(token);
        console.log("Token décodé:", decoded);
  
        if (!decoded || decoded.role?.trim().toUpperCase() !== 'STUDENT') {
          throw new Error("Accès non autorisé");
        }
  
        // 3. Mise à jour du state et localStorage
        setStudentInfo({
          id: decoded.studentId,
          name: decoded.studentName,
          email : decoded.studentEmail , 
          prenom : decoded.studentPrenom
        });
  
        localStorage.setItem('student_token', token);
        localStorage.setItem('student_id', decoded.studentId);
        localStorage.setItem('student_name', decoded.studentName);
        localStorage.setItem('student_email', decoded.studentEmail);
        localStorage.setItem('student_prenom', decoded.studentPrenom);
  
      
      } catch (error) {
        console.error("Erreur:", error);
        setAuthError(error.message);
        localStorage.removeItem('student_token'); // Nettoyage
      } finally {
        setLoading(false); // <-- IMPORTANT: Toujours désactiver le loading
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
      <DemandeDiplome />
      <VerificationDiplome />
      
    </div>
  );
}

export default App ;
