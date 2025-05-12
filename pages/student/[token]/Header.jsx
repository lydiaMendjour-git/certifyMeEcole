import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaGraduationCap, FaSignOutAlt, FaCog, FaUser, FaHistory } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

const colors = {
  primary: '#2F855A',
  secondary: '#2D3748',
  accent: '#38A169',
  darkBg: '#1A202C',
  lightBg: '#F7FAFC',
  textDark: '#1C1C1C',
  textLight: '#718096',
  border: '#CBD5E0',
  blockchain: '#5F6FF9',
  error: '#C53030'
};

const Header = ({ token }) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const safeToken = encodeURIComponent(token);

  // 🆕 Récupérer l'historique
  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch('http://localhost:5000/api/historique', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
  
      // Le reste du code reste inchangé...
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Réponse inattendue: ${text.substring(0, 100)}`);
      }
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur serveur');
      }
  
      setHistoryItems(data.historique || []);
    } catch (error) {
      console.error('Erreur fetchHistory:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  const handleLogout = () => {
    localStorage.removeItem('university_token');
    localStorage.removeItem('university_id');
    router.push('/PageAcceuil/Login');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: isScrolled ? 'rgba(255,255,255,0.98)' : 'white',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
      borderBottom: `1px solid ${colors.border}`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      height: '72px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 2rem',
        height: '100%'
      }}>
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => router.push(`/ministry?token=${safeToken}`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            cursor: 'pointer'
          }}
        >
          <div style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            width: '45px',
            height: '45px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${colors.primary}40`
          }}>
            <FaGraduationCap color="white" size={20} />
          </div>
          <span style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>CertifyMe</span>
        </motion.div>

        {/* Côté Droit - Utilisateur */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* 🆕 Bouton Historique */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowHistory(!showHistory)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              backgroundColor: showHistory ? `${colors.primary}10` : 'transparent',
              border: 'none',
              color: colors.textDark,
              fontSize: '0.95rem',
              fontWeight: '500'
            }}
          >
            <FaHistory color={colors.primary} />
            Historique
          </motion.button>

          {/* Menu Utilisateur */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              backgroundColor: showAccountMenu ? `${colors.primary}10` : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <FaUserCircle size={18} />
            </div>
            <FaChevronDown size={14} style={{
              transition: 'transform 0.3s ease',
              transform: showAccountMenu ? 'rotate(180deg)' : 'rotate(0)'
            }} />
          </motion.div>
        
          {/* 🆕 Dropdown Historique */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: '80px',
                  right: '300px',
                  width: '400px',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  zIndex: 1001,
                  border: `1px solid ${colors.primary}20`,
                  padding: '1rem'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{
                  margin: '0 0 1rem',
                  color: colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FaHistory /> Historique des vérifications
                </h3>
                
                {isLoadingHistory ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                    <div className="spinner"></div>
                  </div>
                ) : historyItems.length === 0 ? (
                  <p style={{ color: colors.textLight, textAlign: 'center' }}>
                    Aucun diplôme vérifié récemment
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {historyItems.map((item) => (
                      <div key={item.id} style={{
                        padding: '0.8rem',
                        borderRadius: '10px',
                        border: `1px solid ${colors.border}`,
                        transition: 'all 0.3s ease',
                        ':hover': {
                          boxShadow: `0 2px 8px ${colors.primary}20`
                        }
                      }}>
                        <h4 style={{ margin: '0 0 0.3rem', color: colors.textDark }}>
                          {item.titreDiplome}
                        </h4>
                        <p style={{ 
                          margin: '0 0 0.3rem', 
                          fontSize: '0.85rem',
                          color: colors.textLight 
                        }}>
                          {item.etablissement}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            fontSize: '0.8rem',
                            color: colors.textLight
                          }}>
                            {new Date(item.dateDemande).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(item.lienVerification);
                              // Vous pourriez ajouter une notification ici
                            }}
                            style={{
                              marginLeft: 'auto',
                              background: 'none',
                              border: 'none',
                              color: colors.primary,
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            Copier le lien
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Account Dropdown */}
          <AnimatePresence>
            {showAccountMenu && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: '80px',
                  right: '20px',
                  width: '250px',
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  zIndex: 1001,
                  overflow: 'hidden',
                  border: `1px solid ${colors.primary}20`
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* ... (le reste du menu compte utilisateur reste inchangé) ... */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;