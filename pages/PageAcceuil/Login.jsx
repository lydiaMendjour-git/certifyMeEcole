
import React, { useState } from "react";
import axios from "axios";
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEnvelope, FaLock } from 'react-icons/fa';
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
    localStorage.setItem('ministere_token', response.data.token); // si tu veux le garder aussi
    router.push(`/ministry/${safeToken}`);
    break;
  }
  case 'ECOLE':
    router.push('/ecole');
    break;
  case 'STUDENT':
    router.push('/student');
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
  

  return (
    <div style={{
      backgroundColor: colors.lightBg,
      minHeight: '50vh',
      padding: '1rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
          overflow: "hidden",
          width: "100%",
          maxWidth: "450px",
          zIndex: 1,
          border: `1px solid ${colors.primary}20`
        }}
      >
        {/* Header with subtle pattern */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          padding: "1rem 1rem 0.2rem",
          position: "relative",
          textAlign: "center",
          overflow: 'hidden'
        }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                zIndex: 999,
                position: "absolute",
                top: "1rem",
                left: "1rem",
                background: "rgba(255,255,255,0.2)",
                padding: "0.5rem",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={() => router.push('/')}
            >
              <FaArrowLeft color="white" />
            </motion.div>

          <h2 style={{
            color: "white",
            fontSize: "1.4rem",
            fontWeight: "700",
            margin: "0.3rem 0 0 0",
            position: 'relative',
            zIndex: 1
          }}>
            Connexion
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "0.85rem",
            marginTop: "0.5rem",
            position: 'relative',
            zIndex: 1
          }}>
            Accédez à votre espace sécurisé
          </p>
        </div>
        
        {/* Form with subtle background */}
        <div style={{
          position: 'relative',
          padding: '1rem'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(to bottom, transparent 95%, rgba(76, 201, 240, 0.05) 100%)',
            zIndex: 0
          }} />
          
          <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  color: '#e53e3e', 
                  backgroundColor: '#fff5f5',
                  padding: "0.75rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                  textAlign: "center",
                  border: '1px solid #fed7d7',
                  fontSize: '0.85rem'
                }}
              >
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
                display: "block",
                color: colors.textDark,
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "0.6rem"
              }}>
                Email
              </label>
              <div style={{ 
                position: 'relative',
                boxShadow: `0 2px 8px ${colors.primary}10`
              }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  style={{
                    width: "85%",
                    padding: "0.9rem 1rem 0.9rem 3rem",
                    borderRadius: "10px",
                    border: `1px solid ${colors.primary}30`,
                    fontSize: "0.9rem",
                    color: colors.textDark,
                    transition: "all 0.3s ease"
                  }}
                  required
                />
                <FaEnvelope style={{ 
                  position: "absolute", 
                  left: "1rem", 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  color: colors.primary,
                  fontSize: "0.9rem"
                }} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: "1.8rem" }}
            >
              <label style={{
                display: "block",
                color: colors.textDark,
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "0.6rem"
              }}>
                Mot de passe
              </label>
              <div style={{ 
                position: 'relative',
                boxShadow: `0 2px 8px ${colors.primary}10`
              }}>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: "85%",
                    padding: "0.9rem 1rem 0.9rem 3rem",
                    borderRadius: "10px",
                    border: `1px solid ${colors.primary}30`,
                    fontSize: "0.9rem",
                    color: colors.textDark,
                    transition: "all 0.3s ease"
                  }}
                  required
                />
                <FaLock style={{ 
                  position: "absolute", 
                  left: "1rem", 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  color: colors.primary,
                  fontSize: "0.9rem"
                }} />
              </div>
            </motion.div>

            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: `0 5px 15px ${colors.primary}40`
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? colors.textLight : `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "1rem",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: `0 4px 12px ${colors.primary}30`,
                transition: "all 0.3s ease"
              }}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </motion.button>
          </form>
        </div>

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
    </div>
  );
};

export default Login;