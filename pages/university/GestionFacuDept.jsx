import Header from './Header.jsx';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import StudentManagement from './StudentManagement';

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

const GestionFacuDept = () => {
  const router = useRouter();
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState({});
  const [showFacultyForm, setShowFacultyForm] = useState(false);
  const [expandedFaculties, setExpandedFaculties] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  
  // États pour les formulaires modaux
  const [facultyFormData, setFacultyFormData] = useState({
    idFaculty: null,
    nomFaculty: '',
    idUni: null
  });
  
  const [departmentFormData, setDepartmentFormData] = useState({
    idDepart: null,
    nomDepart: '',
    idFaculty: null,
    idUni: null
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [universityId, setUniversityId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('university_id');
    const storedToken = localStorage.getItem('uni_token');
    setUniversityId(storedId);
    setToken(storedToken);
    if (storedId) {
      setFacultyFormData(prev => ({ ...prev, idUni: parseInt(storedId) }));
    }
  }, []);

  // Chargement des facultés
  useEffect(() => {
    if (!universityId || !token) return;

    const loadFaculties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/faculties/${universityId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFaculties(response.data.data);
      } catch (error) {
        console.error('Error loading faculties:', error);
      }
    };

    loadFaculties();
  }, [universityId, token]);

  // Chargement des départements
  const loadDepartments = async (facultyId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/departments/${facultyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(prev => ({ ...prev, [facultyId]: response.data }));
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  // Toggle expansion des facultés
  const toggleFacultyExpansion = async (facultyId) => {
    setExpandedFaculties(prev => ({ ...prev, [facultyId]: !prev[facultyId] }));
    if (!expandedFaculties[facultyId] && !departments[facultyId]) {
      await loadDepartments(facultyId);
    }
  };

  // Gestion des formulaires
  const openFacultyForm = (faculty = null) => {
    setFacultyFormData({
      idFaculty: faculty?.idFaculty || null,
      nomFaculty: faculty?.nomFaculty || '',
      idUni: universityId
    });
    setShowFacultyForm(true);
  };

  const openDepartmentForm = (facultyId, department = null) => {
    setDepartmentFormData({
      idDepart: department?.idDepart || null,
      nomDepart: department?.nomDepart || '',
      idFaculty: department?.idFaculty || facultyId,
      idUni: universityId
    });
  };

  // Actions CRUD
  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    try {
      if (facultyFormData.idFaculty) {
        // Mise à jour
        await axios.put(
          `${API_BASE_URL}/facultiesupdate/${facultyFormData.idFaculty}`,
          { nomFaculty: facultyFormData.nomFaculty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setFaculties(prev => prev.map(f => 
          f.idFaculty === facultyFormData.idFaculty 
            ? { ...f, nomFaculty: facultyFormData.nomFaculty } 
            : f
        ));
      } else {
        // Création
        const response = await axios.post(
          `${API_BASE_URL}/facultiescreate`,
          facultyFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setFaculties(prev => [...prev, response.data]);
      }
      
      setShowFacultyForm(false);
    } catch (error) {
      console.error('Error saving faculty:', error);
    }
  };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (departmentFormData.idDepart) {
        // Mise à jour
        await axios.put(
          `${API_BASE_URL}/departmentsupdate/${departmentFormData.idDepart}`,
          { 
            nomDepart: departmentFormData.nomDepart,
            idFaculty: departmentFormData.idFaculty
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Mettre à jour l'état local
        setDepartments(prev => {
          const updatedDepartments = { ...prev };
          
          // Retirer de l'ancienne faculté si nécessaire
          Object.keys(updatedDepartments).forEach(fId => {
            updatedDepartments[fId] = updatedDepartments[fId].filter(
              d => d.idDepart !== departmentFormData.idDepart
            );
          });
          
          // Ajouter à la nouvelle faculté
          if (!updatedDepartments[departmentFormData.idFaculty]) {
            updatedDepartments[departmentFormData.idFaculty] = [];
          }
          
          updatedDepartments[departmentFormData.idFaculty].push({
            idDepart: departmentFormData.idDepart,
            nomDepart: departmentFormData.nomDepart,
            idFaculty: departmentFormData.idFaculty,
            idUni: departmentFormData.idUni
          });
          
          return updatedDepartments;
        });
      } else {
        // Création
        const response = await axios.post(
          `${API_BASE_URL}/departmentscreate`,
          departmentFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        await loadDepartments(departmentFormData.idFaculty);
      }
      
      setDepartmentFormData({
        idDepart: null,
        nomDepart: '',
        idFaculty: null,
        idUni: null
      });
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    if (!confirm('Supprimer cette faculté et tous ses départements?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/facultiesdelete/${facultyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setFaculties(prev => prev.filter(f => f.idFaculty !== facultyId));
      setDepartments(prev => {
        const newDepts = { ...prev };
        delete newDepts[facultyId];
        return newDepts;
      });
    } catch (error) {
      console.error('Error deleting faculty:', error);
    }
  };

  const handleDeleteDepartment = async (deptId) => {
    if (!confirm('Supprimer ce département et tous ses étudiants?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/departmentsdelete/${deptId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const facultyId = Object.keys(departments).find(fId => 
        departments[fId].some(d => d.idDepart === deptId)
      );

      if (facultyId) {
        setDepartments(prev => ({
          ...prev,
          [facultyId]: prev[facultyId].filter(d => d.idDepart !== deptId),
        }));
      }
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const handleGoBack = () => {
    const safeToken = encodeURIComponent(token);
    router.push(`/university/IntegrationBd?token=${safeToken}`);
  };

  return (
    <div style={{ 
      backgroundColor: colors.lightBg,
      minHeight: '100vh',
      marginTop: '5rem',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      <Header token={token} />
    
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
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Facultés
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
                onClick={() => openFacultyForm()}
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
                Nouvelle faculté
              </motion.button>
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {faculties.length === 0 ? (
              <div style={{ 
                textAlign: 'center',
                padding: '2rem',
                color: colors.textLight
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.textLight} style={{ opacity: 0.5 }}>
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{ margin: '1rem 0 0' }}>Aucune faculté enregistrée</p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid',
                gap: '0.75rem'
              }}>
                {faculties.map(faculty => (
                  <div 
                    key={faculty.idFaculty}
                    style={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <div 
                      style={{
                        padding: '1rem',
                        backgroundColor: expandedFaculties[faculty.idFaculty] ? colors.lightBg : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onClick={() => toggleFacultyExpansion(faculty.idFaculty)}
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
                          {faculty.nomFaculty.charAt(0).toUpperCase()}
                        </div>
                        
                        <span style={{ 
                          fontWeight: '500',
                          color: colors.textDark
                        }}>
                          {faculty.nomFaculty}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openFacultyForm(faculty);
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
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: '#D5F5E3'
                            }
                          }}
                        >
                          Modifier
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFaculty(faculty.idFaculty);
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
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: '#FADBD8'
                            }
                          }}
                        >
                          Supprimer
                        </button>
                        
                        <motion.div
                          animate={{ rotate: expandedFaculties[faculty.idFaculty] ? 180 : 0 }}
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

                    {expandedFaculties[faculty.idFaculty] && (
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
                              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M9 22V12h6v10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Départements
                          </h3>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openDepartmentForm(faculty.idFaculty);
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: colors.accent,
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Ajouter
                          </motion.button>
                        </div>

                        {departments[faculty.idFaculty] ? (
                          departments[faculty.idFaculty].length === 0 ? (
                            <div style={{ 
                              textAlign: 'center',
                              padding: '1rem',
                              color: colors.textLight,
                              fontSize: '0.875rem'
                            }}>
                              Aucun département enregistré
                            </div>
                          ) : (
                            <div style={{
                              display: 'grid',
                              gap: '0.5rem'
                            }}>
                              {departments[faculty.idFaculty].map(dept => (
                                <div 
                                  key={dept.idDepart}
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
                                    {dept.nomDepart}
                                    <span style={{
                                      fontSize: '0.75rem',
                                      color: colors.textLight,
                                      marginTop: '0.25rem'
                                    }}>
                                      Faculté: {faculties.find(f => f.idFaculty === dept.idFaculty)?.nomFaculty || 'Inconnue'}
                                    </span>
                                  </div>
                                  
                                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDepartmentForm(faculty.idFaculty, dept);
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
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          backgroundColor: '#D5F5E3'
                                        }
                                      }}
                                    >
                                      Modifier
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteDepartment(dept.idDepart);
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
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          backgroundColor: '#FADBD8'
                                        }
                                      }}
                                    >
                                      Supprimer
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedDepartment(dept.idDepart);
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
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          backgroundColor: '#BAE7FF'
                                        }
                                      }}
                                    >
                                      Gestion Étudiants
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
                            Chargement des départements...
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

      {/* Modal pour les facultés */}
      {showFacultyForm && (
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
                {facultyFormData.idFaculty ? 'Modifier la faculté' : 'Nouvelle faculté'}
              </h3>
            </div>
            
            <form onSubmit={handleFacultySubmit} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Nom de la faculté
                </label>
                <input
                  type="text"
                  placeholder="Ex: Faculté des Sciences"
                  value={facultyFormData.nomFaculty}
                  onChange={(e) => setFacultyFormData({
                    ...facultyFormData,
                    nomFaculty: e.target.value
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
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem'
              }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowFacultyForm(false)}
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
                  disabled={!facultyFormData.nomFaculty.trim()}
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: !facultyFormData.nomFaculty.trim() ? `${colors.accent}80` : colors.accent,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: !facultyFormData.nomFaculty.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  {facultyFormData.idFaculty ? 'Mettre à jour' : 'Enregistrer'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal pour les départements */}
      {departmentFormData.idFaculty && (
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
                {departmentFormData.idDepart ? 'Modifier le département' : 'Nouveau département'}
              </h3>
            </div>
            
            <form onSubmit={handleDepartmentSubmit} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Nom du département
                </label>
                <input
                  type="text"
                  placeholder="Ex: Informatique"
                  value={departmentFormData.nomDepart}
                  onChange={(e) => setDepartmentFormData({
                    ...departmentFormData,
                    nomDepart: e.target.value
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
                  Faculté associée
                </label>
                <select
                  value={departmentFormData.idFaculty}
                  onChange={(e) => setDepartmentFormData({
                    ...departmentFormData,
                    idFaculty: parseInt(e.target.value)
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
                  <option value="">Sélectionnez une faculté</option>
                  {faculties.map(faculty => (
                    <option key={faculty.idFaculty} value={faculty.idFaculty}>
                      {faculty.nomFaculty}
                    </option>
                  ))}
                </select>
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
                  onClick={() => setDepartmentFormData({
                    idDepart: null,
                    nomDepart: '',
                    idFaculty: null,
                    idUni: null
                  })}
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
                  disabled={!departmentFormData.nomDepart.trim() || !departmentFormData.idFaculty}
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: !departmentFormData.nomDepart.trim() || !departmentFormData.idFaculty ? `${colors.accent}80` : colors.accent,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: !departmentFormData.nomDepart.trim() || !departmentFormData.idFaculty ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  {departmentFormData.idDepart ? 'Mettre à jour' : 'Enregistrer'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {selectedDepartment && (
        <StudentManagement 
          departmentId={selectedDepartment} 
          onClose={() => setSelectedDepartment(null)} 
        />
      )}
    </div>
  );
};

export default GestionFacuDept;