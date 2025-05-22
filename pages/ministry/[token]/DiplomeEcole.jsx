import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import HeaderMinistry from './HeaderMinistry.jsx';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaCheckDouble,
  FaUniversity,
  FaUserGraduate,
  FaBook,
  FaIdCard
} from 'react-icons/fa';

const DiplomeEcole = () => {
  const router = useRouter();
  const { ecoleId } = router.query;
  const [error, setError] = useState(null);
  const [diplomas, setDiplomas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ecoleInfo, setEcoleInfo] = useState(null);
  const [selectedDiplomas, setSelectedDiplomas] = useState([]);
  const [token, setToken] = useState(null);

  const colors = {
    primary: '#2F855A',
    secondary: '#2D3748',
    accent: '#38A169',
    lightBg: '#F7FAFC',
    darkBg: '#1A202C',
    textDark: '#1C1C1C',
    textLight: '#718096',
    border: '#CBD5E0',
    success: '#2F855A',
    error: '#C53030',
    warning: '#D69E2E'
  };

  const diplomaTypeColors = {
    'PROFESSIONNEL': colors.primary,
    'SUPERIEUR': colors.secondary
  };

  const diplomaTypeIcons = {
    'PROFESSIONNEL': <FaUserGraduate />,
    'SUPERIEUR': <FaUniversity />
  };

  useEffect(() => {
    const token = localStorage.getItem('ministere_token');
    setToken(token);
    
    if (!ecoleId) {
      console.error("ID d'école manquant !");
      router.push('/ministry/Ecoles?token=' + encodeURIComponent(token));
    }
  }, [ecoleId, router]);

  useEffect(() => {
    if (!ecoleId || !token) return;

    const fetchData = async () => {
      try {
        const ecoleResponse = await axios.get(`http://localhost:5000/ecoles/${ecoleId}`);
        setEcoleInfo(ecoleResponse.data);

        const diplomasResponse = await axios.get(`http://localhost:5000/ecoles/${ecoleId}/diplomes-a-valider`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDiplomas(diplomasResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ecoleId, token]);

  const handleDiplomeValidesClick = () => {
    router.push(`/ministry/${token}/DiplomesEcoleValides?ecoleId=${ecoleInfo.idEcole}`);
  };

  const handleValidate = async (diplomaId) => {
    try {
      await axios.post(`http://localhost:5000/ecoles/diplomes/${diplomaId}/valider`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDiplomas(diplomas.filter(d => d.id !== diplomaId));
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la validation');
    }
  };

  const handleReject = async (diplomaId) => {
    try {
      await axios.post(`http://localhost:5000/ecoles/diplomes/${diplomaId}/rejeter`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDiplomas(diplomas.filter(d => d.id !== diplomaId));
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du rejet');
    }
  };

  const handleValidateAll = async () => {
    try {
      await axios.post(`http://localhost:5000/ecoles/${ecoleId}/valider-tous-diplomes`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDiplomas([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la validation globale');
    }
  };

  const toggleSelectDiploma = (diplomaId) => {
    setSelectedDiplomas(prev => 
      prev.includes(diplomaId) 
        ? prev.filter(id => id !== diplomaId) 
        : [...prev, diplomaId]
    );
  };

  if (loading) {
    return (
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
  }

  if (error) {
    return (
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
        <h2 style={{ color: colors.accent }}>Erreur</h2>
        <p>{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
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
          Retour
        </motion.button>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: colors.lightBg,
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      paddingBottom: '3rem'
    }}>
      <HeaderMinistry />
    
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '1rem 0.3rem',
          margin: '1rem 0',
        }}>
          {ecoleInfo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <motion.button
                  whileHover={{ backgroundColor: `${colors.primary}08`, transform: 'translateY(-1px)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.back()}
                  style={{
                    backgroundColor: 'transparent',
                    color: colors.primary,
                    border: `1px solid ${colors.primary}50`,
                    borderRadius: '8px',
                    padding: '0.5rem 0,5rem',
                    fontSize: '0.82rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    minWidth: '50px',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.button>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '500', color: colors.textLight, opacity: 0.85, marginBottom: '0.2rem' }}>
                    Diplômes en attente pour
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: '520', color: colors.textDark, margin: 0, letterSpacing: '-0.015em' }}>
                    {ecoleInfo.nomEcole}
                  </h2>
                </div>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', margin: '1rem 0' }}>
            <motion.button
              whileHover={diplomas.length > 0 ? { transform: 'translateY(-1px)', boxShadow: `0 2px 8px ${colors.primary}20` } : {}}
              whileTap={diplomas.length > 0 ? { scale: 0.98 } : {}}
              onClick={handleValidateAll}
              disabled={diplomas.length === 0}
              style={{
                backgroundColor: diplomas.length === 0 ? `${colors.primary}05` : colors.primary,
                color: diplomas.length === 0 ? `${colors.primary}40` : 'white',
                border: `1px solid ${colors.primary}20`,
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.82rem',
                fontWeight: '500',
                cursor: diplomas.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                opacity: diplomas.length === 0 ? 0.6 : 1,
                minWidth: '140px',
                justifyContent: 'center'
              }}
            >
              <FaCheckDouble size={12} style={{ opacity: 0.9 }} />
              Valider ({diplomas.length})
            </motion.button>

            <motion.button
              whileHover={{ backgroundColor: `${colors.accent}08`, transform: 'translateY(-1px)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDiplomeValidesClick}
              style={{
                backgroundColor: 'transparent',
                color: colors.accent,
                border: `1px solid ${colors.accent}20`,
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.82rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                minWidth: '160px',
                justifyContent: 'center'
              }}
            >
              <FaCheckCircle size={12} style={{ opacity: 0.9 }} />
              Diplômes validés
            </motion.button>
          </div>
        </div>

        {diplomas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              border: '1px solid rgba(0, 0, 0, 0.03)'
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              background: `${colors.lightBg}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaCheckCircle size={28} color={colors.primary} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: colors.textDark, marginBottom: '0.5rem' }}>
              Aucun diplôme en attente
            </h3>
            <p style={{ color: colors.textLight, maxWidth: '400px', margin: '0 auto', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Tous les diplômes de cette école ont été validés ou rejetés.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.04)',
              overflow: 'hidden',
              border: '1px solid rgba(0, 0, 0, 0.03)'
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: '50px 1.5fr 1fr 1fr 120px 140px',
              padding: '1rem 1.5rem',
              backgroundColor: 'white',
              borderBottom: `1px solid ${colors.lightBg}`,
              fontWeight: '600',
              color: colors.textDark,
              fontSize: '0.85rem',
              letterSpacing: '0.02em'
            }}>
              <div></div>
              <div>Étudiant</div>
              <div>Type de diplôme</div>
              <div>Formation</div>
              <div>Date</div>
              <div style={{ textAlign: 'right', paddingRight: '1rem' }}>Actions</div>
            </div>

            <AnimatePresence>
              {diplomas.map((diploma, index) => (
                <motion.div
                  key={diploma.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1.5fr 1fr 1fr 120px 140px',
                    padding: '1rem 1.5rem',
                    borderBottom: `1px solid ${colors.lightBg}`,
                    alignItems: 'center',
                    transition: 'background 0.2s ease',
                    ':hover': { backgroundColor: `${colors.lightBg}20` }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <motion.label
                      whileHover={{ scale: 1.1 }}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '5px',
                        border: `1.5px solid ${colors.primary}50`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: selectedDiplomas.includes(diploma.id) ? colors.primary : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDiplomas.includes(diploma.id)}
                        onChange={() => toggleSelectDiploma(diploma.id)}
                        style={{ display: 'none' }}
                      />
                      {selectedDiplomas.includes(diploma.id) && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </motion.label>
                  </div>

                  <div>
                    <div style={{ fontWeight: '500', color: colors.textDark, marginBottom: '0.15rem', fontSize: '0.95rem' }}>
                      {diploma.studentName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: colors.textLight, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      {new Date(diploma.birthDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.35rem 0.8rem',
                      borderRadius: '20px',
                      background: `${diplomaTypeColors[diploma.diplomaType]}10`,
                      color: diplomaTypeColors[diploma.diplomaType],
                      fontWeight: '500',
                      fontSize: '0.8rem',
                      border: `1px solid ${diplomaTypeColors[diploma.diplomaType]}20`
                    }}>
                      {diplomaTypeIcons[diploma.diplomaType]}
                      {diploma.diplomaType === 'SUPERIEUR' ? 'Supérieur' : 'Professionnel'}
                    </div>
                  </div>

                  <div style={{ fontWeight: '500', color: colors.textDark, fontSize: '0.9rem' }}>
                    {diploma.specialite}
                  </div>

                  <div style={{ color: colors.textLight, fontSize: '0.85rem' }}>
                    {new Date(diploma.dateOfIssue).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <motion.button
                      whileHover={{ scale: 1.03, backgroundColor: `${colors.success}10`, borderColor: colors.success }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleValidate(diploma.id);
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        color: colors.success,
                        border: `1px solid ${colors.success}30`,
                        borderRadius: '6px',
                        padding: '0.45rem 0.9rem',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <FaCheckCircle size={12} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03, backgroundColor: `${colors.error}10`, borderColor: colors.error }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(diploma.id);
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        color: colors.error,
                        border: `1px solid ${colors.error}30`,
                        borderRadius: '6px',
                        padding: '0.45rem 0.9rem',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <FaTimesCircle size={12} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {selectedDiplomas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'fixed',
                  bottom: '1.5rem',
                  right: '1.5rem',
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '0.8rem 1.2rem',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  zIndex: 100
                }}
              >
                <span style={{ color: colors.textDark, fontWeight: '500', fontSize: '0.85rem' }}>
                  {selectedDiplomas.length} sélectionné(s)
                </span>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <motion.button
                    whileHover={{ scale: 1.03, backgroundColor: `${colors.success}10`, borderColor: colors.success }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      try {
                        await Promise.all(
                          selectedDiplomas.map(id =>
                            axios.post(`http://localhost:5000/ecoles/diplomes/${id}/valider`, {}, {
                              headers: { Authorization: `Bearer ${token}` }
                            })
                          )
                        );
                        setDiplomas(prev => prev.filter(d => !selectedDiplomas.includes(d.id)));
                        setSelectedDiplomas([]);
                      } catch (err) {
                        setError(err.response?.data?.message || 'Erreur lors de la validation');
                      }
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: colors.success,
                      border: `1px solid ${colors.success}30`,
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FaCheckCircle size={12} />
                    Valider
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03, backgroundColor: `${colors.error}10`, borderColor: colors.error }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      try {
                        await Promise.all(
                          selectedDiplomas.map(id =>
                            axios.post(`http://localhost:5000/ecoles/diplomes/${id}/rejeter`, {}, {
                              headers: { Authorization: `Bearer ${token}` }
                            })
                          )
                        );
                        setDiplomas(prev => prev.filter(d => !selectedDiplomas.includes(d.id)));
                        setSelectedDiplomas([]);
                      } catch (err) {
                        setError(err.response?.data?.message || 'Erreur lors du rejet');
                      }
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: colors.error,
                      border: `1px solid ${colors.error}30`,
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FaTimesCircle size={12} />
                    Rejeter
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DiplomeEcole;