import React, { useState, useEffect } from 'react';
import { FaUserCog, FaBell, FaDatabase, FaChevronDown, FaSignOutAlt, FaCog, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import IntegrationBd from './IntegrationBd.jsx';
import IntegrationEtudiant from './IntegrationEtudiant.jsx'; // Importer le composant IntegrationEtudiant
import { useRouter } from 'next/router';


const Header = () => {
  const router = useRouter();  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDatabaseOptions, setShowDatabaseOptions] = useState(false);
  const [showIntegrationBd, setShowIntegrationBd] = useState(false);
  const [showIntegrationEtudiant, setShowIntegrationEtudiant] = useState(false); // Nouvel état pour l'intégration des étudiants
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const notifications = [
    { id: 1, text: "Nouveau certificat disponible", time: "2 min ago", read: false },
    { id: 2, text: "Mise à jour du système", time: "1h ago", read: true },
    { id: 3, text: "Rappel: Vérification requise", time: "3h ago", read: true },
  ];

  const markAllAsRead = () => {
    setUnreadNotifications(0);
  };

  const markAsRead = (id) => {
    setUnreadNotifications(prev => prev - 1);
  };

  const toggleDatabaseOptions = () => {
    setShowDatabaseOptions(!showDatabaseOptions);
    if (showIntegrationBd || showIntegrationEtudiant) {
      setShowIntegrationBd(false);
      setShowIntegrationEtudiant(false); // Ferme l'intégration d'étudiants si c'est ouvert
      setSelectedOption(null);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowDatabaseOptions(false);
    const token = localStorage.getItem('uni_token');
    if (token) {
      const safeToken = encodeURIComponent(token);
    if (option === 'faculty') {
      router.push(`/university/IntegrationBd?token=${safeToken}`);

    } else if (option === 'students') {
      router.push(`/university/IntegrationEtudiant?token=${safeToken}`); // Afficher l'intégration des étudiants
    }}
  };



  return (
    <div className="app-container">
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <motion.div 
          className="logo-container"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h1 className="logo-text">CertifyMe</h1>
        </motion.div>

        <div className="icons-container">
          <div className="database-container">
            <motion.button 
              className="icon-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Gestion de base de données"
              onClick={toggleDatabaseOptions}
            >
              <FaDatabase className="icon" />
            </motion.button>

            <AnimatePresence>
              {showDatabaseOptions && (
                <motion.div 
                  className="database-options-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: 'spring', damping: 25 }}
                >
                  <button 
                    className="database-option"
                    onClick={() => handleOptionSelect('faculty')}
                  >
                    Intégration et gestion faculté et départements
                  </button>
                  <button 
                    className="database-option"
                    onClick={() => handleOptionSelect('students')}
                  >
                    Intégration et gestion d'étudiants
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="notification-container">
            <motion.button 
              className={`notification-button ${unreadNotifications > 0 ? 'has-unread' : ''}`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <FaBell className="icon" />
              {unreadNotifications > 0 && (
                <span className="unread-count">{unreadNotifications}</span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  className="notification-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: 'spring', damping: 25 }}
                >
                  <div className="panel-header">
                    <h3>Notifications</h3>
                    <button 
                      className="mark-all-read"
                      onClick={markAllAsRead}
                      disabled={unreadNotifications === 0}
                    >
                      Tout marquer comme lu
                    </button>
                  </div>
                  <div className="notification-items">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`notification-item ${notif.read ? '' : 'unread'}`}
                        onClick={() => !notif.read && markAsRead(notif.id)}
                      >
                        <div className="notification-content">
                          <p className="notification-text">{notif.text}</p>
                          <span className="notification-time">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="panel-footer">
                    <button className="view-all">Voir toutes les notifications</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="user-menu-container">
            <motion.button 
              className="user-profile-button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              aria-expanded={showAccountMenu}
              aria-label="Menu utilisateur"
            >
              <div className="user-avatar">
                <FaUserCog className="avatar-icon" />
              </div>
              <span className="user-name">Mon Compte</span>
              <motion.span
                animate={{ rotate: showAccountMenu ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown size={12} />
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {showAccountMenu && (
                <motion.div 
                  className="user-menu-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: 'spring', damping: 25 }}
                >
                  <div className="user-info">
                    <div className="info-avatar">
                      <FaUserCog size={24} />
                    </div>
                    <div className="info-details">
                      <p className="user-display-name">Utilisateur</p>
                      <p className="user-email">user@certifyme.com</p>
                    </div>
                  </div>
                  <div className="menu-items">
                    <button className="menu-item">
                      <FaUser className="menu-icon" />
                      <span>Profil</span>
                    </button>
                    <button className="menu-item">
                      <FaCog className="menu-icon" />
                      <span>Paramètres</span>
                    </button>
                    <button className="menu-item logout">
                      <FaSignOutAlt className="menu-icon" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

    </div>
  );
};

export default Header;