import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { FaUniversity, FaSearch, FaChartLine, FaUserGraduate, FaCheckCircle } from 'react-icons/fa';
import Header from "./HeaderMinistry.jsx";
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import axios from 'axios';

function App() {
  const router = useRouter();
  const { token } = router.query;
  const safeToken = encodeURIComponent(token || ''); 

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
  
  
  const [ministryInfo, setMinistryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [selectedUni, setSelectedUni] = useState(null);
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
          const storedToken = localStorage.getItem('ministere_token');
          if (storedToken) {
            router.push(`/ministry/${storedToken}`);
            return;
          }
          throw new Error("Token manquant");
        }
  
        // 2. Décodage et vérification
        const decoded = jwt.decode(token);
        console.log("Token décodé:", decoded);
  
        if (!decoded || decoded.role?.trim().toUpperCase() !== 'MINISTERE') {
          throw new Error("Accès non autorisé");
        }
  
        // 3. Mise à jour du state et localStorage
        setMinistryInfo({
          id: decoded.ministereId,
          name: decoded.ministereName,
        });
  
        localStorage.setItem('ministere_token', token);
        localStorage.setItem('ministere_id', decoded.ministereId);
        localStorage.setItem('ministere_name', decoded.ministereName);
  
        // 4. Chargement des données
        const response = await axios.get('http://localhost:5000/universites-with-account');
        setUniversities(response.data);
  
      } catch (error) {
        console.error("Erreur:", error);
        setAuthError(error.message);
        localStorage.removeItem('ministere_token'); // Nettoyage
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

  const filteredUniversities = universities.filter(uni =>
    uni.nomUni.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      overflowX: 'hidden' ,
      backgroundColor: colors.lightBg,
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <Header onSelect={() => {}} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {/* Section de recherche */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: colors.textDark,
            margin: 0
          }}>
            Gestion des Universités : 
          </h2>
          
          <div style={{
            position: 'relative',
            width: '300px'
          }}>
            <FaSearch style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.textLight
            }} />
            <input
              type="text"
              placeholder="Rechercher une université..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem 0.8rem 40px',
                borderRadius: '10px',
                border: `1px solid ${colors.primary}30`,
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s',
                ':focus': {
                  borderColor: colors.primary,
                  boxShadow: `0 0 0 3px ${colors.primary}20`
                }
              }}
            />
          </div>
        </motion.div>

        {/* Liste des universités */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {filteredUniversities.map((uni) => (
            <motion.div
              key={uni.idUni}
              whileHover={{ y: -5, boxShadow: `0 10px 25px ${colors.primary}20` }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedUni(uni)}
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '1.5rem',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                border: `1px solid ${colors.primary}20`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '80px',
                height: '80px',
                borderRadius: '0 15px 0 50px',
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
                zIndex: 0
              }} />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${colors.lightBg}, ${colors.border})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FaUniversity color="black" size={24} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: colors.textDark,
                    margin: 0
                  }}>
                    {uni.nomUni}
                  </h3>
                  <p style={{
                    color: colors.textLight,
                    fontSize: '0.9rem',
                    margin: '0.3rem 0 0'
                  }}>
                    {uni.adresseUni}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginTop: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: `${colors.primary}10`,
                  padding: '0.4rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  color: colors.primary,
                  fontWeight: '600'
                }}>
                  <FaUserGraduate size={12} />
                  <span>Université vérifiée</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: `${colors.accent}10`,
                  padding: '0.4rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  color: colors.accent,
                  fontWeight: '600'
                }}>
                  <FaCheckCircle size={12} />
                  <span>Compte actif</span>
                </div>
              </div>

              <div style={{
                marginTop: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{
                    color: colors.textLight,
                    fontSize: '0.8rem',
                    margin: '0.2rem 0'
                  }}>
                    Email: {uni.emailUni}
                  </p>
                  <p style={{
                    color: colors.textLight,
                    fontSize: '0.8rem',
                    margin: '0.2rem 0'
                  }}>
                    Tél: {uni.telephoneUni}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaChartLine size={14} />
                  Statistiques
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal pour les détails de l'université */}
      {selectedUni && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setSelectedUni(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '2rem',
              position: 'relative',
              boxShadow: `0 25px 50px -12px ${colors.primary}30`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedUni(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: colors.textLight
              }}
            >
              ×
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '15px',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FaUniversity color="white" size={30} />
              </div>
              <div>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  color: colors.textDark,
                  margin: '0 0 0.5rem'
                }}>
                  {selectedUni.nomUni}
                </h2>
                <p style={{
                  color: colors.textLight,
                  margin: '0'
                }}>
                  {selectedUni.adresseUni}
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: colors.textDark,
                  marginBottom: '1rem'
                }}>
                  Informations de contact
                </h3>
                <div style={{
                  backgroundColor: `${colors.lightBg}`,
                  borderRadius: '10px',
                  padding: '1.5rem'
                }}>
                  <p style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0 0 1rem'
                  }}>
                    <span style={{ fontWeight: '600', minWidth: '100px' }}>Email:</span>
                    <span>{selectedUni.emailUni}</span>
                  </p>
                  <p style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0 0 1rem'
                  }}>
                    <span style={{ fontWeight: '600', minWidth: '100px' }}>Téléphone:</span>
                    <span>{selectedUni.telephoneUni}</span>
                  </p>
                  <p style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0'
                  }}>
                    
                  </p>
                </div>
              </div>

              <div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: colors.textDark,
                  marginBottom: '1rem'
                }}>
                  Compte administrateur
                </h3>
                <div style={{
                  backgroundColor: `${colors.lightBg}`,
                  borderRadius: '10px',
                  padding: '1.5rem'
                }}>
                  <p style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0 0 1rem'
                  }}>
                    <span style={{ fontWeight: '600', minWidth: '100px' }}>Nom d'utilisateur:</span>
                    <span>{selectedUni.account.username}</span>
                  </p>
                  <p style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0 0 1rem'
                  }}>
                    <span style={{ fontWeight: '600', minWidth: '100px' }}>Email:</span>
                    <span>{selectedUni.account.email}</span>
                  </p>
                  <p style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0'
                  }}>
                   
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/ministry/${token}/DiplomeUniversite?universityId=${selectedUni.idUni}&token=${safeToken}`)}
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.8rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              > 
                Voir les diplômes
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default App;