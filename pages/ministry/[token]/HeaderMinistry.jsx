import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGraduationCap, 
  FaBell, 
  FaUserCircle, 
  FaCog, 
  FaSignOutAlt,
  FaChevronDown,
  FaEnvelope,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

function Header() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('ministere_token') : null;
  const safeToken = encodeURIComponent(token || '');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const colors ={
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
  

  // Simuler des notifications (à remplacer par un appel API réel)
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "Nouvelle demande de validation",
        message: "5 nouveaux diplômes en attente de validation",
        type: "warning",
        time: "10 min",
        read: false
      },
      {
        id: 2,
        title: "Validation réussie",
        message: "Votre validation a été enregistrée sur la blockchain",
        type: "success",
        time: "1h",
        read: false
      },
      {
        id: 3,
        title: "Mise à jour système",
        message: "Nouvelle version disponible (v2.1.0)",
        type: "info",
        time: "2j",
        read: true
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
    setUnreadCount(unreadCount - 1);
  };

  const handleLogout = () => {
    localStorage.removeItem('ministere_token');
    localStorage.removeItem('ministere_id');
    localStorage.removeItem('ministere_name');
    router.push('/PageAcceuil/Login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        width: '95%',
        padding: '0.5rem 2.5%',
        background: 'white',
        boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
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

      {/* Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        alignItems: 'center',
        marginRight: 'auto',
        marginLeft: '2rem'
      }}>
        
      </div>

      {/* Icons */}
      <div style={{ 
        display: 'flex', 
        gap: '1.5rem', 
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Notifications */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNotifications(!showNotifications)}
          style={{
            position: 'relative',
            cursor: 'pointer',
            color: colors.textDark,
            fontSize: '1.2rem'
          }}
        >
          <FaBell />
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: colors.accent,
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}>
              {unreadCount}
            </div>
          )}
        </motion.div>

        {/* Account Menu */}
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
      </div>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '80px',
              right: '20px',
              width: '350px',
              backgroundColor: 'white',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              zIndex: 1001,
              overflow: 'hidden',
              border: `1px solid ${colors.primary}20`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '1rem',
              borderBottom: `1px solid ${colors.lightBg}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ 
                fontSize: '1.1rem',
                fontWeight: '700',
                margin: 0,
                color: colors.textDark
              }}>
                Notifications
              </h3>
              <button 
                onClick={() => setShowNotifications(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.textLight,
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    whileHover={{ backgroundColor: colors.lightBg }}
                    style={{
                      padding: '1rem',
                      borderBottom: `1px solid ${colors.lightBg}`,
                      backgroundColor: !notification.read ? `${colors.primary}05` : 'white',
                      cursor: 'pointer'
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div style={{ 
                      display: 'flex',
                      gap: '0.8rem',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{
                        flexShrink: 0,
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 
                          notification.type === 'success' ? `${colors.primary}20` :
                          notification.type === 'warning' ? `${colors.accent}20` :
                          `${colors.textLight}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 
                          notification.type === 'success' ? colors.primary :
                          notification.type === 'warning' ? colors.accent :
                          colors.textLight
                      }}>
                        {notification.type === 'success' ? <FaCheckCircle /> : 
                         notification.type === 'warning' ? <FaExclamationTriangle /> : 
                         <FaEnvelope />}
                      </div>
                      <div>
                        <h4 style={{ 
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          margin: '0 0 0.3rem',
                          color: colors.textDark
                        }}>
                          {notification.title}
                        </h4>
                        <p style={{ 
                          fontSize: '0.85rem',
                          margin: '0 0 0.3rem',
                          color: colors.textLight
                        }}>
                          {notification.message}
                        </p>
                        <span style={{ 
                          fontSize: '0.75rem',
                          color: colors.textLight
                        }}>
                          {notification.time}
                        </span>
                      </div>
                      {!notification.read && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: colors.primary,
                          marginLeft: 'auto'
                        }} />
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div style={{ 
                  padding: '2rem',
                  textAlign: 'center',
                  color: colors.textLight
                }}>
                  Aucune notification
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div style={{
                padding: '0.8rem',
                textAlign: 'center',
                borderTop: `1px solid ${colors.lightBg}`
              }}>
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: colors.primary,
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  Marquer tout comme lu
                </button>
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
            <div style={{
              padding: '1.2rem',
              borderBottom: `1px solid ${colors.lightBg}`,
              display: 'flex',
              gap: '0.8rem',
              alignItems: 'center'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <FaUserCircle size={20} />
              </div>
              <div>
                <h4 style={{ 
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  margin: '0 0 0.1rem',
                  color: colors.textDark
                }}>
                  Ministère
                </h4>
                <p style={{ 
                  fontSize: '0.85rem',
                  margin: 0,
                  color: colors.textLight
                }}>
                  Administrateur
                </p>
              </div>
            </div>
            
            <div style={{ padding: '0.5rem 0' }}>
              <motion.button
                whileHover={{ backgroundColor: colors.lightBg }}
                onClick={() => router.push(`/ministry/account?token=${safeToken}`)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1.2rem',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  cursor: 'pointer',
                  color: colors.textDark,
                  fontSize: '0.95rem',
                  textAlign: 'left'
                }}
              >
                <FaUserCircle color={colors.textLight} />
                Mon compte
              </motion.button>
              
              <motion.button
                whileHover={{ backgroundColor: colors.lightBg }}
                onClick={() => router.push(`/ministry/settings?token=${safeToken}`)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1.2rem',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  cursor: 'pointer',
                  color: colors.textDark,
                  fontSize: '0.95rem',
                  textAlign: 'left'
                }}
              >
                <FaCog color={colors.textLight} />
                Paramètres
              </motion.button>
            </div>
            
            <div style={{
              padding: '0.5rem 0',
              borderTop: `1px solid ${colors.lightBg}`
            }}>
              <motion.button
                whileHover={{ backgroundColor: colors.lightBg }}
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '0.8rem 1.2rem',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  cursor: 'pointer',
                  color: colors.textDark,
                  fontSize: '0.95rem',
                  textAlign: 'left'
                }}
              >
                <FaSignOutAlt color={colors.textLight} />
                Déconnexion
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Header;