import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import StudentManagement from './StudentManagement';

const colors = {
  primary: '#4F46E5', // Changement de couleur principale pour violet
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

const GestionFormations = () => {
  const router = useRouter();
  const [formations, setFormations] = useState([]);
  const [students, setStudents] = useState({});
  const [showFormationForm, setShowFormationForm] = useState(false);
  const [expandedFormations, setExpandedFormations] = useState({});
  const [selectedFormation, setSelectedFormation] = useState(null);
  
  // États pour les formulaires
  const [formationFormData, setFormationFormData] = useState({
    idFormation: null,
    nomFormation: '',
    typeFormation: 'Certification',
    duree: '',
    ecoleId: null
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [ecoleId, setEcoleId] = useState(null);
  const [token, setToken] = useState(null);
  const [annees, setAnnees] = useState([]);

  useEffect(() => {
    const storedId = localStorage.getItem('ecole_id');
    const storedToken = localStorage.getItem('ecole_token');
    setEcoleId(storedId);
    setToken(storedToken);
    if (storedId) {
      setFormationFormData(prev => ({ ...prev, ecoleId: parseInt(storedId) }));
    }
  }, []);

  // Chargement des formations
  useEffect(() => {
    if (!ecoleId || !token) return;

    const loadFormations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/ecoles/${ecoleId}/formations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormations(response.data);
      } catch (error) {
        console.error('Error loading formations:', error);
      }
    };

    const loadAnnees = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/ecole/${ecoleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnees(response.data);
      } catch (error) {
        console.error('Error loading academic years:', error);
      }
    };

    loadFormations();
    loadAnnees();
  }, [ecoleId, token]);

  // Chargement des étudiants
  const loadStudents = async (formationId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/formations/${formationId}/etudiants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(prev => ({ ...prev, [formationId]: response.data }));
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  // Toggle expansion des formations
  const toggleFormationExpansion = async (formationId) => {
    setExpandedFormations(prev => ({ ...prev, [formationId]: !prev[formationId] }));
    if (!expandedFormations[formationId] && !students[formationId]) {
      await loadStudents(formationId);
    }
  };

  // Gestion des formulaires
  const openFormationForm = (formation = null) => {
    setFormationFormData({
      idFormation: formation?.idFormation || null,
      nomFormation: formation?.nomFormation || '',
      typeFormation: formation?.typeFormation || 'Certification',
      duree: formation?.duree || '',
      ecoleId: ecoleId
    });
    setShowFormationForm(true);
  };

  // Actions CRUD
  const handleFormationSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formationFormData.idFormation) {
        // Mise à jour
        await axios.put(
          `${API_BASE_URL}/formations/update/${formationFormData.idFormation}`,
          { 
            nomFormation: formationFormData.nomFormation,
            typeFormation: formationFormData.typeFormation,
            duree: formationFormData.duree
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setFormations(prev => prev.map(f => 
          f.idFormation === formationFormData.idFormation 
            ? { ...f, ...formationFormData } 
            : f
        ));
      } else {
        // Création
        const response = await axios.post(
          `${API_BASE_URL}/formations/create`,
          formationFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setFormations(prev => [...prev, response.data]);
      }
      
      setShowFormationForm(false);
    } catch (error) {
      console.error('Error saving formation:', error);
    }
  };

  const handleDeleteFormation = async (formationId) => {
    if (!confirm('Supprimer cette formation et tous ses étudiants?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/formations/delete/${formationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setFormations(prev => prev.filter(f => f.idFormation !== formationId));
      setStudents(prev => {
        const newStudents = { ...prev };
        delete newStudents[formationId];
        return newStudents;
      });
    } catch (error) {
      console.error('Error deleting formation:', error);
    }
  };

  const handleGoBack = () => {
    const safeToken = encodeURIComponent(token);
    router.push(`/ecole/IntegrationEcole?token=${safeToken}`);
  };

  return (
    <div style={{ 
      backgroundColor: colors.lightBg,
      minHeight: '100vh',
      marginTop: '5rem',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      {/* Header serait ici si vous en avez un */}
    
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            marginBottom: '2rem',
            border: `1px solid ${colors.border}`
          }}
        >
          <div style={{
            padding: '1.5rem',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem',
              fontWeight: '600',
              margin: 0,
              color: colors.textDark,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primary}>
                <path d="M12 3v18m9-9H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Formations
            </h2>
            <div style={{display: "flex"}}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoBack}
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'transparent',
                  color: colors.textDark,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginRight: '1rem'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Retour
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openFormationForm()}
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: colors.accent,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Nouvelle formation
              </motion.button>
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {formations.length === 0 ? (
              <div style={{ 
                textAlign: 'center',
                padding: '2rem',
                color: colors.textLight
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.textLight} style={{ opacity: 0.5 }}>
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{ margin: '1rem 0 0' }}>Aucune formation enregistrée</p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid',
                gap: '0.75rem'
              }}>
                {formations.map(formation => (
                  <div 
                    key={formation.idFormation}
                    style={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <div 
                      style={{
                        padding: '1rem',
                        backgroundColor: expandedFormations[formation.idFormation] ? colors.lightBg : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onClick={() => toggleFormationExpansion(formation.idFormation)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: colors.primary,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600'
                        }}>
                          {formation.nomFormation.charAt(0).toUpperCase()}
                        </div>
                        
                        <div>
                          <span style={{ 
                            fontWeight: '500',
                            color: colors.textDark
                          }}>
                            {formation.nomFormation}
                          </span>
                          <div style={{
                            fontSize: '0.75rem',
                            color: colors.textLight,
                            marginTop: '0.25rem'
                          }}>
                            {formation.typeFormation} • {formation.duree || 'Durée non spécifiée'}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openFormationForm(formation);
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#EBF8F2',
                            color: colors.success,
                            border: `1px solid ${colors.success}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Modifier
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFormation(formation.idFormation);
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#FEEBEB',
                            color: colors.error,
                            border: `1px solid ${colors.error}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Supprimer
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFormation(formation.idFormation);
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#E6F7FF',
                            color: '#1890ff',
                            border: '1px solid #1890ff',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Gestion Étudiants
                        </button>
                        
                        <motion.div
                          animate={{ rotate: expandedFormations[formation.idFormation] ? 180 : 0 }}
                          style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textDark}>
                            <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.div>
                      </div>
                    </div>

                    {expandedFormations[formation.idFormation] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          padding: '1rem',
                          backgroundColor: colors.lightBg,
                          borderTop: `1px solid ${colors.border}`
                        }}
                      >
                        <div style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '1rem'
                        }}>
                          <h3 style={{ 
                            fontSize: '1rem',
                            fontWeight: '600',
                            margin: 0,
                            color: colors.textDark,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.textDark}>
                              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="9" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Étudiants
                          </h3>
                        </div>

                        {students[formation.idFormation] ? (
                          students[formation.idFormation].length === 0 ? (
                            <div style={{ 
                              textAlign: 'center',
                              padding: '1rem',
                              color: colors.textLight,
                              fontSize: '0.875rem'
                            }}>
                              Aucun étudiant enregistré
                            </div>
                          ) : (
                            <div style={{
                              display: 'grid',
                              gap: '0.5rem'
                            }}>
                              {students[formation.idFormation].map(student => (
                                <div 
                                  key={student.idEtudiantEcole}
                                  style={{
                                    padding: '0.75rem 1rem',
                                    backgroundColor: 'white',
                                    borderRadius: '6px',
                                    border: `1px solid ${colors.border}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                  }}
                                >
                                  <div style={{ 
                                    color: colors.textDark,
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}>
                                    {student.nom} {student.prenom}
                                    <span style={{
                                      fontSize: '0.75rem',
                                      color: colors.textLight,
                                      marginTop: '0.25rem'
                                    }}>
                                      {student.matricule} • Moyenne: {student.moyenne || 'N/A'}
                                    </span>
                                  </div>
                                  
                                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Ici vous pourriez ouvrir un modal d'édition
                                      }}
                                      style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#EBF8F2',
                                        color: colors.success,
                                        border: `1px solid ${colors.success}`,
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      Modifier
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteStudent(student.idEtudiantEcole);
                                      }}
                                      style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#FEEBEB',
                                        color: colors.error,
                                        border: `1px solid ${colors.error}`,
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      Supprimer
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        ) : (
                          <div style={{ 
                            textAlign: 'center',
                            padding: '1rem',
                            color: colors.textLight
                          }}>
                            Chargement des étudiants...
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal pour les formations */}
      {showFormationForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '500px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{
              padding: '1.5rem',
              borderBottom: `1px solid ${colors.border}`
            }}>
              <h3 style={{ 
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: 0,
                color: colors.textDark
              }}>
                {formationFormData.idFormation ? 'Modifier la formation' : 'Nouvelle formation'}
              </h3>
            </div>
            
            <form onSubmit={handleFormationSubmit} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Nom de la formation
                </label>
                <input
                  type="text"
                  placeholder="Ex: Formation en Développement Web"
                  value={formationFormData.nomFormation}
                  onChange={(e) => setFormationFormData({
                    ...formationFormData,
                    nomFormation: e.target.value
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    border: `1px solid ${colors.border}`,
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  autoFocus
                  required
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Type de formation
                </label>
                <select
                  value={formationFormData.typeFormation}
                  onChange={(e) => setFormationFormData({
                    ...formationFormData,
                    typeFormation: e.target.value
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    border: `1px solid ${colors.border}`,
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: 'white'
                  }}
                  required
                >
                  <option value="Certification">Certification</option>
                  <option value="Diplôme">Diplôme</option>
                  <option value="Attestation">Attestation</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Durée (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 6 mois, 1 an..."
                  value={formationFormData.duree}
                  onChange={(e) => setFormationFormData({
                    ...formationFormData,
                    duree: e.target.value
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    border: `1px solid ${colors.border}`,
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem'
              }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowFormationForm(false)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: 'transparent',
                    color: colors.textDark,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Annuler
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!formationFormData.nomFormation.trim()}
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: !formationFormData.nomFormation.trim() ? `${colors.accent}80` : colors.accent,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: !formationFormData.nomFormation.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  {formationFormData.idFormation ? 'Mettre à jour' : 'Enregistrer'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {selectedFormation && (
        <StudentManagement 
          formationId={selectedFormation} 
          onClose={() => setSelectedFormation(null)} 
          annees={annees}
        />
      )}
    </div>
  );
};

export default GestionFormations;