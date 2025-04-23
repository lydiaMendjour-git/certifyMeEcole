import { useAuth } from './AuthContext';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUser, FaLock, FaPhone, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';

const FormPage = () => {
  const {
    role,
    formData,
    errors,
    handleChange,
    handleSubmit,
    setAuthState
  } = useAuth();
  
  const router = useRouter();
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
  

  const getRoleTitle = () => {
    switch(role) {
      case "STUDENT": return "Inscription Étudiant";
      case "ECOLE": return "Inscription École";
      default: return "Inscription";
    }
  };

  return (
    <div style={{
      backgroundColor: colors.lightBg,
      minHeight: '100vh',
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
        <FaUser size={120} color={colors.darkBlue} />
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
          maxWidth: "500px",
          zIndex: 1,
          border: `1px solid ${colors.primary}20`
        }}
      >
        {/* Header with subtle pattern */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          padding: "2rem 2rem 1.5rem",
          position: "relative",
          textAlign: "center",
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.3
          }} />
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
                       onClick={() => router.push('/PageAcceuil/RolePage')}
                     >
                       <FaArrowLeft color="white" />
                     </motion.div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            marginBottom: '0.8rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${colors.primary}40`
            }}>
              <FaShieldAlt color="white" size={16} />
            </div>
            <span style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: 'white',
              letterSpacing: '0.5px'
            }}>CertifyMe</span>
          </div>
          
          <h2 style={{
            color: "white",
            fontSize: "1.4rem",
            fontWeight: "600",
            margin: "0.3rem 0 0 0",
            position: 'relative',
            zIndex: 1
          }}>
            {getRoleTitle()}
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "0.85rem",
            marginTop: "0.5rem",
            position: 'relative',
            zIndex: 1
          }}>
            Veuillez remplir tous les champs requis
          </p>
        </div>
        
        {/* Form with subtle background */}
        <div style={{
          position: 'relative',
          padding: '2rem'
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
                Nom d'utilisateur
              </label>
              <div style={{ 
                position: 'relative',
                boxShadow: `0 2px 8px ${colors.primary}10`
              }}>
                <input
                  type="text"
                  name="username"
                  placeholder="john.doe"
                  onChange={handleChange}
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
                <FaUser style={{ 
                  position: "absolute", 
                  left: "1rem", 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  color: colors.primary,
                  fontSize: "0.9rem"
                }} />
              </div>
            </motion.div>

            {role === "STUDENT" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{ marginBottom: "1.5rem" }}
              >
                <label style={{
                  display: "block",
                  color: colors.textDark,
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  marginBottom: "0.6rem"
                }}>
                  Prénom
                </label>
                <div style={{ 
                  position: 'relative',
                  boxShadow: `0 2px 8px ${colors.primary}10`
                }}>
                  <input
                    type="text"
                    name="prenom"
                    placeholder="John"
                    onChange={handleChange}
                    style={{
                        width: "90%",
                      padding: "0.9rem 1rem",
                      borderRadius: "10px",
                      border: `1px solid ${colors.primary}30`,
                      fontSize: "0.9rem",
                      color: colors.textDark,
                      transition: "all 0.3s ease"
                    }}
                    required
                  />
                </div>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: "1.5rem" }}
            >
              <label style={{
                display: "block",
                color: colors.textDark,
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "0.6rem"
              }}>
                {role === "STUDENT" ? "Nom" : "Nom de l'école"}
              </label>
              <div style={{ 
                position: 'relative',
                boxShadow: `0 2px 8px ${colors.primary}10`
              }}>
                <input
                  type="text"
                  name="name"
                  placeholder={role === "STUDENT" ? "Doe" : "Nom de l'établissement"}
                  onChange={handleChange}
                  style={{
                    width: "90%",
                    padding: "0.9rem 1rem",
                    borderRadius: "10px",
                    border: `1px solid ${colors.primary}30`,
                    fontSize: "0.9rem",
                    color: colors.textDark,
                    transition: "all 0.3s ease"
                  }}
                  required
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{ marginBottom: "1.5rem" }}
            >
              <label style={{
                display: "block",
                color: colors.textDark,
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "0.6rem"
              }}>
                Téléphone
              </label>
              <div style={{ 
                position: 'relative',
                boxShadow: `0 2px 8px ${colors.primary}10`
              }}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+33 6 12 34 56 78"
                  onChange={handleChange}
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
                <FaPhone style={{ 
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
              transition={{ delay: 0.3 }}
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
                  placeholder="john.doe@example.com"
                  onChange={handleChange}
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
              transition={{ delay: 0.35 }}
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
                  placeholder="••••••••"
                  onChange={handleChange}
                  style={{
                    width: "85%",
                    padding: "0.9rem 1rem 0.9rem 3rem",
                    borderRadius: "10px",
                    border: errors.password ? `1px solid #e74c3c` : `1px solid ${colors.primary}30`,
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
                  color: errors.password ? '#e74c3c' : colors.primary,
                  fontSize: "0.9rem"
                }} />
              </div>
              {errors.password ? (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ 
                    color: '#e74c3c', 
                    fontSize: '0.75rem',
                    marginTop: '0.4rem',
                    fontWeight: '500'
                  }}
                >
                  {errors.password}
                </motion.p>
              ) : formData.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ 
                    color: '#2ecc71', 
                    fontSize: '0.75rem',
                    marginTop: '0.4rem',
                    fontWeight: '500'
                  }}
                >
                  ✓ Mot de passe sécurisé
                </motion.p>
              )}
            </motion.div>

            {role === "ECOLE" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ marginBottom: "1.5rem" }}
              >
                <label style={{
                  display: "block",
                  color: colors.textDark,
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  marginBottom: "0.6rem"
                }}>
                  Type d'établissement
                </label>
                <div style={{ 
                  position: 'relative',
                  boxShadow: `0 2px 8px ${colors.primary}10`
                }}>
                  <select
                    name="roleEcole"
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.9rem 1rem",
                      borderRadius: "10px",
                      border: `1px solid ${colors.primary}30`,
                      backgroundColor: "white",
                      fontSize: "0.9rem",
                      color: colors.textDark,
                      cursor: "pointer",
                      appearance: "none",
                      transition: "all 0.3s ease"
                    }}
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="PROFESSIONNEL">Professionnel</option>
                    <option value="PRIVEE">Privée</option>
                    <option value="FORMATION">Formation</option>
                  </select>
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: `0 5px 15px ${colors.primary}40`
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{
                width: "100%",
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "1rem",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: `0 4px 12px ${colors.primary}30`,
                transition: "all 0.3s ease"
              }}
            >
              Finaliser l'inscription
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
          Vous avez déjà un compte ?{' '}
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
              router.push('login')
            }}
          >
            <span style={{
              position: 'relative',
              zIndex: 1
            }}>
              Connectez-vous ici
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
FormPage.getInitialProps = async () => ({});
export default FormPage;