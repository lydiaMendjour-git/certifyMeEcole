import { motion } from 'framer-motion';
import { FaArrowLeft, FaUser, FaLock, FaSchool, FaShieldAlt, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

const EcolePage = () => {
  const router = useRouter();
  const authContext = useAuth();
  
  // État local par défaut
  const [localAuthState, setLocalAuthState] = useState({
    formData: {
      username: "",
      password: "",
      roleEcole: ""
    },
    ecoles: [],
    selectedEcole: null,
    errors: {}
  });
   


  // Synchronisation avec le contexte
  useEffect(() => {
    if (authContext) {
      setLocalAuthState(prev => ({
        ...prev,
        ...authContext,
        formData: {
          ...prev.formData,
          ...(authContext.formData || {})
        }
      }));
    }
  }, [authContext]);

  const colors = {
    primary: '#4F46E5',
    secondary: '#1E40AF',
    accent: '#7C3AED',
    lightBg: '#F5F3FF',
    darkBg: '#1E1B4B',
    textDark: '#1E1B4B',
    textLight: '#6B7280',
    border: '#DDD6FE',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B'
  };

 const roleOptions = [
  { value: 'ECOLE_SUPERIEURE', label: 'École Supérieure' },
  { value: 'ECOLE_FORMATION', label: 'École/Institut de Formation' }
];

  const handleEcoleSelect = (e) => {
    const ecoleId = parseInt(e.target.value);
    setLocalAuthState(prev => ({
      ...prev,
      selectedEcole: ecoleId
    }));
    if (authContext?.handleEcoleSelect) {
      authContext.handleEcoleSelect(e);
    }
  };

  const handleRoleEcoleSelect = (role) => {
    setLocalAuthState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        roleEcole: role
      }
    }));
    if (authContext?.handleRoleEcoleSelect) {
      authContext.handleRoleEcoleSelect(role);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalAuthState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value
      }
    }));
    if (authContext?.handleChange) {
      authContext.handleChange(e);
    }
  };
const handleEcoleSubmit = async (e) => {
  e.preventDefault();

  try {
    const ecoleSelectionnee = localAuthState.ecoles.find(
      e => e.idEcole === localAuthState.selectedEcole
    );

    const payload = {
      username: localAuthState.formData.username,
      password: localAuthState.formData.password,
      role: "ECOLE",
      ecoleId: ecoleSelectionnee.idEcole,
      email: ecoleSelectionnee.emailEcole,
      name: ecoleSelectionnee.nomEcole,
      phone: ecoleSelectionnee.telephoneEcole,
      roleEcole: ecoleSelectionnee.role,
      adresseEcole: ecoleSelectionnee.adresseEcole
    };

    console.log("Envoi à /register avec payload:", payload);

    const response = await axios.post("http://localhost:5000/register", payload, {
      headers: { 
        'Content-Type': 'application/json' 
      }
    });

    router.push("/PageAcceuil/EmailVerification");

  } catch (err) {
    console.error("Erreur complète:", {
      message: err.message,
      response: err.response?.data,
      config: err.config
    });
    
    setLocalAuthState(prev => ({
      ...prev,
      errors: {
        server: err.response?.data?.error || 
               "Erreur lors de l'inscription (vérifiez la console)"
      }
    }));
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
        <FaSchool size={120} color={colors.darkBg} />
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
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          padding: "2rem 2rem 1.5rem",
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
            onClick={() => router.push('/PageAcceuil/RolePage')}
          >
            <FaArrowLeft color="white" />
          </motion.div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.2rem',
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
            Inscription École
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "0.85rem",
            marginTop: "0.5rem",
            position: 'relative',
            zIndex: 1
          }}>
            Sélectionnez votre type d'établissement et créez votre compte
          </p>
        </div>
        
        {/* Form */}
        <div style={{
          position: 'relative',
          padding: '2rem'
        }}>
          <form onSubmit={handleEcoleSubmit} style={{ position: 'relative', zIndex: 1 }}>
            {!localAuthState.formData.roleEcole ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ marginBottom: "1.5rem" }}
              >
                <h3 style={{
                  color: colors.textDark,
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "1.5rem",
                  textAlign: "center"
                }}>
                  Sélectionnez le type de votre établissement
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {roleOptions.map((option) => (
                    <motion.div
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoleEcoleSelect(option.value)}
                      style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        border: `1px solid ${colors.border}`,
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: `${colors.primary}10`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <FaSchool color={colors.primary} />
                        </div>
                        <span style={{ 
                          fontWeight: '600',
                          color: colors.textDark
                        }}>
                          {option.label}
                        </span>
                      </div>
                      <FaChevronRight color={colors.textLight} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
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
    {localAuthState.formData.roleEcole === 'ECOLE_SUPERIEURE' 
      ? "Sélectionnez votre école supérieure" 
      : "Sélectionnez votre centre de formation"}
  </label>
  <div style={{ 
    position: 'relative',
    boxShadow: `0 2px 8px ${colors.primary}10`
  }}>
    <select
      onChange={handleEcoleSelect}
      value={localAuthState.selectedEcole || ''}
      style={{
        width: "100%",
        padding: "0.9rem 1rem 0.9rem 3rem",
        borderRadius: "10px",
        border: `1px solid ${colors.primary}30`,
        backgroundColor: "white",
        fontSize: "0.9rem",
        color: colors.textDark,
        cursor: "pointer",
        appearance: "none",
        transition: "all 0.3s ease",
        zIndex: 1
      }}
      required
    >
      <option value="">Sélectionnez votre école</option>
      {localAuthState.ecoles.length > 0 ? (
        localAuthState.ecoles.map((ecole) => (
          <option key={ecole.idEcole} value={ecole.idEcole}>
            {ecole.nomEcole}
          </option>
        ))
      ) : (
        <option value="" disabled>
          Aucune école disponible pour ce type
        </option>
      )}
    </select>
    <div style={{
      position: "absolute",
      left: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: colors.primary,
      fontSize: "1rem",
      zIndex: 2
    }}>
      <FaSchool />
    </div>
  </div>
</motion.div>

                {localAuthState.selectedEcole && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.4 }}
                    style={{ overflow: "hidden" }}
                  >
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
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
                        Identifiant administrateur
                      </label>
                      <div style={{ 
                        position: 'relative',
                        boxShadow: `0 2px 8px ${colors.primary}10`
                      }}>
                        <input
                          type="text"
                          name="username"
                          placeholder="admin.ecole"
                          value={localAuthState.formData.username}
                          onChange={handleChange}
                          style={{
                            width: "100%",
                            padding: "0.9rem 1rem 0.9rem 3rem",
                            borderRadius: "10px",
                            border: `1px solid ${colors.primary}30`,
                            fontSize: "0.9rem",
                            color: colors.textDark,
                            transition: "all 0.3s ease"
                          }}
                          required
                        />
                        <div style={{
                          position: "absolute",
                          left: "1rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: colors.primary,
                          fontSize: "0.9rem"
                        }}>
                          <FaUser />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
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
                          value={localAuthState.formData.password}
                          onChange={handleChange}
                          style={{
                            width: "100%",
                            padding: "0.9rem 1rem 0.9rem 3rem",
                            borderRadius: "10px",
                            border: localAuthState.errors.password ? `1px solid ${colors.error}` : `1px solid ${colors.primary}30`,
                            fontSize: "0.9rem",
                            color: colors.textDark,
                            transition: "all 0.3s ease"
                          }}
                          required
                        />
                        <div style={{
                          position: "absolute",
                          left: "1rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: localAuthState.errors.password ? colors.error : colors.primary,
                          fontSize: "0.9rem"
                        }}>
                          <FaLock />
                        </div>
                      </div>
                      {localAuthState.errors.password ? (
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{ 
                            color: colors.error, 
                            fontSize: '0.75rem',
                            marginTop: '0.4rem',
                            fontWeight: '500'
                          }}
                        >
                          {localAuthState.errors.password}
                        </motion.p>
                      ) : localAuthState.formData.password && (
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{ 
                            color: colors.success, 
                            fontSize: '0.75rem',
                            marginTop: '0.4rem',
                            fontWeight: '500'
                          }}
                        >
                          ✓ Mot de passe sécurisé
                        </motion.p>
                      )}
                    </motion.div>

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

                    {localAuthState.errors.server && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ 
                          color: colors.error,
                          textAlign: 'center',
                          marginTop: '1rem',
                          fontSize: '0.9rem'
                        }}
                      >
                        {localAuthState.errors.server}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </>
            )}
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
          >
            <span style={{
              position: 'relative',
              zIndex: 1
            }}>
              Connectez-vous ici
            </span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default EcolePage;