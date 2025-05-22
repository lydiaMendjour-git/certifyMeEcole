import React, { useState, useEffect } from 'react';
import { FaUserCog, FaBell, FaDatabase, FaChevronDown, FaSignOutAlt, FaCog, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import IntegrationBd from './IntegrationBd.jsx';
import IntegrationEtudiant from './IntegrationEtudiant.jsx'; // Importer le composant IntegrationEtudiant
import ListeDiplomesUniversite from './ListeDiplomesUniversite'; 
import GestionFacuDept from './GestionFacuDept.jsx';
import { useRouter } from 'next/router';


const Header = () => {
  const router = useRouter();  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDatabaseOptions, setShowDatabaseOptions] = useState(false);
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
        router.push(`/university/IntegrationEtudiant?token=${safeToken}`);
      } else if (option === 'diplomas') { // Nouvelle option pour les diplômes
        router.push(`/university/ListeDiplomesUniversite?token=${safeToken}`); // Redirige vers la gestion des diplômes
      }
      else if (option === 'gestion') { // Nouvelle option pour les diplômes
        router.push(`/university/GestionFacuDept?token=${safeToken}`); // Redirige vers la gestion des diplômes
      }
    }
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
                    Intégration des facultés et des départements
                  </button>
                  <button 
                    className="database-option"
                    onClick={() => handleOptionSelect('students')}
                  >
                    Intégration d'étudiants
                  </button>
                  <button 
                    className="database-option"
                    onClick={() => handleOptionSelect('diplomas')} // Nouvelle option
                  >
                    Gestion des diplômes
                  </button>
                  <button 
                    className="database-option"
                    onClick={() => handleOptionSelect('gestion')} // Nouvelle option
                  >
                    Gestion de la bd 
                  </button>
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