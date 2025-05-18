
import React, { useState } from "react";
import axios from "axios";
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSpinner, FaEnvelope, FaLock , FaUserCircle, FaSignInAlt, FaUserPlus, FaShieldAlt, FaExclamationTriangle} from 'react-icons/fa';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );
      
      // Stockage du token dans le localStorage (optionnel)
      localStorage.setItem('token', response.data.token);
    
      // Redirection DYNAMIQUE avec le token
// Redirection DYNAMIQUE avec le token
switch(response.data.account.role) {
  case 'UNIVERSITY': {
    const safeToken = encodeURIComponent(response.data.token);
    localStorage.setItem('uni_token', response.data.token);
    router.push(`/university/${safeToken}`);
    break;
  }
  case 'MINISTERE': {
    const safeToken = encodeURIComponent(response.data.token);
    localStorage.setItem('ministere_token', response.data.token); 
    router.push(`/ministry/${safeToken}`);
    break;
  }
 
  
  case 'ECOLE': {
  const safeToken = encodeURIComponent(response.data.token);
  localStorage.setItem('ecole_token', response.data.token);
  console.log("Token reçu:", response.data.token); // Pour débogage
  router.push(`/ecole/${safeToken}`);
  break;
}
  case 'STUDENT':
    const safeToken = encodeURIComponent(response.data.token);
    localStorage.setItem('student_token', response.data.token); 
    router.push(`/student/${safeToken}`);
  
    break;
  default:
    router.push('/');
}

    } catch (error) {
      setError(error.response?.data?.error || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const colors = {
    primary: '#2F855A',       // Vert validation
    secondary: '#2D3748',     // Gris charbon
    accent: '#38A169',        // Vert accent
    lightBg: '#F7FAFC',       // Fond clair
    darkBg: '#1A202C',        // Fond sombre
    textDark: '#1C1C1C',      // Texte principal
    textLight: '#718096',     // Texte secondaire
    border: '#CBD5E0',        // Bordures
    success: '#2F855A',       // Succès
    error: '#C53030',         // Erreur
    warning: '#D69E2E',       // Avertissement
    blockchain: '#4C6B8A',    // Couleur blockchain
  };
  
  return (
    <div style={{
      backgroundColor: "#f0f9f1",
      minHeight: '100vh',
      padding: '0rem',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>

       {/* Background elements */}
       <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '100%',
        height: '200%',
        background: `radial-gradient(circle at 30% 50%, ${colors.primary}20, transparent 40%)`,
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        right: '-30%',
        width: '80%',
        height: '80%',
        background: `radial-gradient(circle at 70% 70%, ${colors.accent}15, transparent 50%)`,
        zIndex: 0
      }} />
      
      {/* Floating icons */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          opacity: 0.1,
          zIndex: 0
        }}
      >
        <FaEnvelope size={120} color={colors.darkBlue} />
      </motion.div>
      
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '20%',
          opacity: 0.1,
          zIndex: 0
        }}
      >
        <FaLock size={150} color={colors.accent} />
      </motion.div>

      
      {/* Blockchain background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(to right, ${colors.blockchain}10 1px, transparent 1px),
          linear-gradient(to bottom, ${colors.blockchain}10 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        opacity: 0.3,
        zIndex: 0
      }} />
      
      {/* Blockchain nodes animation */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '15%',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: colors.primary,
        boxShadow: `0 0 20px ${colors.primary}`,
        zIndex: 0,
        animation: 'pulse 3s infinite'
      }} />
   

      

      
      {/* Blockchain connection lines */}
      <svg width="100%" height="100%" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        opacity: 0.1
      }}>
        <line x1="15%" y1="20%" x2="30%" y2="40%" stroke={colors.darkBg} strokeWidth="2" strokeDasharray="5,5" />
        <line x1="30%" y1="40%" x2="70%" y2="35%" stroke={colors.darkBg} strokeWidth="2" strokeDasharray="5,5" />
        <line x1="70%" y1="35%" x2="80%" y2="25%" stroke={colors.darkBg} strokeWidth="2" strokeDasharray="5,5" />
      </svg>
  
      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
          overflow: "hidden",
          width: "100%",
          maxWidth: "500px",
          zIndex: 1,
          border: `1px solid ${colors.border}`
        }}
      >
         <div style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          padding: "1rem 1rem 0.5rem",
          position: "relative",
          textAlign: "center",
          overflow: 'hidden'
        }}>
          
  
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "1.5rem",
              background: "rgba(255,255,255,0.2)",
              padding: "0.5rem",
              borderRadius: "8px",
      
            }}
            onClick={() => router.push('/')}
          >
            <FaArrowLeft color="white" />
          </motion.div>
  
          {/* University + Blockchain logo */}
          
  
          <h2 style={{
            color: "white",
            fontSize: "1.8rem",
            fontWeight: "500",
            margin: "0.5rem 0 0 0",
            position: 'relative',
            zIndex: 1
          }}>
            Connexion 
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "0.9rem",
            marginTop: "0.5rem",
            position: 'relative',
            zIndex: 1
          }}>
           Accédez à votre espace sécurisé
          </p>
        </div>
        
        {/* Form section */}
        <div style={{
          position: 'relative',
          padding: '2rem'
        }}>
         
          
          <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  color: colors.error, 
                  backgroundColor: '#fff5f5',
                  padding: "1rem",
                  borderRadius: "10px",
                  marginBottom: "1.5rem",
                  textAlign: "center",
                  border: `1px solid ${colors.error}20`,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaExclamationTriangle />
                {error}
              </motion.div>
            )}
  
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ marginBottom: "1.5rem" }}
            >
              <label style={{
                display: "flex",
                alignItems: 'center',
                color: colors.textDark,
                fontSize: "0.9rem",
                fontWeight: "500",
                marginBottom: "0.6rem",
                gap: '0.5rem'
              }}>
                <FaUserCircle color={colors.primary} />
                Identifiant
              </label>
              <div style={{ 
                position: 'relative',
                boxShadow: `0 4px 12px ${colors.primary}10`,
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@gmail.com"
                  style={{
                    width: "85%",
                    padding: "1rem 1rem 1rem 3rem",
                    borderRadius: "10px",
                    border: `1px solid ${colors.border}`,
                    fontSize: "0.95rem",
                    color: colors.textDark,
                    transition: "all 0.3s ease",
                    backgroundColor: 'white'
                  }}
                  required
                />
                <FaEnvelope style={{ 
                  position: "absolute", 
                  left: "1rem", 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  color: colors.textLight,
                  fontSize: "1rem"
                }} />
              </div>
            </motion.div>
  
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: "2rem" }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.6rem'
              }}>
                <label style={{
                  display: "flex",
                  alignItems: 'center',
                  color: colors.textDark,
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  gap: '0.5rem'
                }}>
                  <FaLock color={colors.primary} />
                  Mot de passe
                </label>
                <a href="#" style={{
                  color: colors.textLight,
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}>
                  Mot de passe oublié ?
                </a>
              </div>
              
              <div style={{ 
                position: 'relative',
                boxShadow: `0 4px 12px ${colors.primary}10`,
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: "85%",
                    padding: "1rem 1rem 1rem 3rem",
                    borderRadius: "10px",
                    border: `1px solid ${colors.border}`,
                    fontSize: "0.95rem",
                    color: colors.textDark,
                    transition: "all 0.3s ease",
                    backgroundColor: 'white'
                  }}
                  required
                />
                <FaLock style={{ 
                  position: "absolute", 
                  left: "1rem", 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  color: colors.textLight,
                  fontSize: "1rem"
                }} />
              </div>
            </motion.div>
  
            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: `0 8px 20px ${colors.primary}40`
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              
              style={{
                width: "100%",
                background: loading ? colors.textLight : `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "1rem",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: `0 6px 16px ${colors.primary}30`,
                transition: "all 0.3s ease",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                <>
                  <FaSpinner className="spin" />
                  <span>Vérification en cours...</span>
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  <span>Se connecter</span>
                </>
              )}
            </motion.button>
          </form>
        </div>
  
        {/* Footer */}
        <div style={{
          padding: '1rem 2rem',
          textAlign: 'center',
          borderTop: `1px solid ${colors.lightBg}`,
          color: colors.textLight,
          fontSize: '0.8rem',
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(5px)'
        }}>
          Pas encore de compte ?{' '}
          <a 
            href="#" 
            style={{ 
              color: colors.primary, 
              fontWeight: '600',
              textDecoration: 'none',
              position: 'relative'
            }}
            onClick={(e) => {
              e.preventDefault();
              router.push('/PageAcceuil/RolePage');
            }}
          >
            <span style={{
              position: 'relative',
              zIndex: 1
            }}>
              S'inscrire
            </span>
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '1px',
              backgroundColor: colors.primary,
              transform: 'scaleX(0)',
              transition: 'transform 0.3s ease',
              zIndex: 0
            }} />
          </a>
        </div>
      </motion.div>
  
      {/* Global styles */}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;