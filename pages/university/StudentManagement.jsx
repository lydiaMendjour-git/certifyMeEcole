import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

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

const StudentManagement = ({ departmentId, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchMatricule, setSearchMatricule] = useState('');
const [searchMode, setSearchMode] = useState(false);
const [searchError, setSearchError] = useState(null);
  const [newStudent, setNewStudent] = useState({
    nom: '',
    prenom: '',
    email: '',
    matricule: '',
    telephone: '',
    dateNaissance: '',
    lieuNaissance: '',
    CursusUniversitaire: {
      section: '',
      groupe: '',
      filiere: '',
      specialite: '',
      niveau: '',
      moyenneAnnuelle: '',
      idFaculty: '',
      idDepart: departmentId,
      idAnnee: ''
    }
  });

  const [annees, setAnnees] = useState([]);
  const [anneeId, setAnneeId] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = localStorage.getItem('uni_token');
  

useEffect(() => {
  const fetchAnnees = async () => {
      const universityId = localStorage.getItem('university_id');
      console.log("Fetching annees for university:", universityId);
   
    try {
      const response = await axios.get(`${API_BASE_URL}/annee-uniID/${universityId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data) {
        setAnnees(response.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des années de l’université :", error);
    }
  };
  fetchAnnees();
}, [token]);
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const url = anneeId
          ? `${API_BASE_URL}/students-by-annee/${anneeId}`
          : `${API_BASE_URL}/departments/${departmentId}/students`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [departmentId, anneeId, token]);

const handleAddStudent = async (e) => {
  e.preventDefault();
  try {
    // Validation des champs obligatoires
    if (!newStudent.nom || !newStudent.prenom || !newStudent.email || !newStudent.matricule) {
      throw new Error("Nom, prénom, email et matricule sont obligatoires");
    }

    // Préparer les données avec conversion des types
    const studentData = {
      nom: newStudent.nom,
      prenom: newStudent.prenom,
      email: newStudent.email,
      matricule: newStudent.matricule,
      telephone: newStudent.telephone || null,
      dateNaissance: newStudent.dateNaissance 
        ? new Date(newStudent.dateNaissance).toISOString() 
        : new Date('2000-01-01').toISOString(), // Valeur par défaut
      lieuNaissance: newStudent.lieuNaissance || null,
      CursusUniversitaire: {
        section: newStudent.CursusUniversitaire.section || 'A', // Valeur par défaut
        groupe: newStudent.CursusUniversitaire.groupe || '1', // Valeur par défaut
        filiere: newStudent.CursusUniversitaire.filiere || 'Informatique',
        specialite: newStudent.CursusUniversitaire.specialite || null,
        niveau: parseInt(newStudent.CursusUniversitaire.niveau) || 1,
        moyenneAnnuelle: parseFloat(newStudent.CursusUniversitaire.moyenneAnnuelle) || null,
        idFaculty: newStudent.CursusUniversitaire.idFaculty 
          ? parseInt(newStudent.CursusUniversitaire.idFaculty) 
          : null,
        idDepart: departmentId,
        idAnnee: parseInt(newStudent.CursusUniversitaire.idAnnee) // Conversion en number
      }
    };

    console.log("Données envoyées:", JSON.stringify(studentData, null, 2));

    const response = await axios.post(`${API_BASE_URL}/students/create`, studentData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setStudents([...students, response.data]);
    setShowAddForm(false);
    setNewStudent({
      nom: '',
      prenom: '',
      email: '',
      matricule: '',
      telephone: '',
      dateNaissance: '',
      lieuNaissance: '',
      CursusUniversitaire: {
        section: '',
        groupe: '',
        filiere: '',
        specialite: '',
        niveau: '',
        moyenneAnnuelle: '',
        idFaculty: '',
        idDepart: departmentId,
        idAnnee: ''
      }
    });
  } catch (error) {
    console.error('Erreur détaillée:', error.response?.data || error.message);
    alert(`Erreur: ${error.response?.data?.message || error.message}`);
  }
};
const handleUpdateStudent = async (e) => {
  e.preventDefault();
  try {
    // Préparer les données dans le bon format
    const updateData = {
      nom: editingStudent.nom,
      prenom: editingStudent.prenom,
      email: editingStudent.email,
      matricule: editingStudent.matricule,
      telephone: editingStudent.telephone || null,
      dateNaissance: editingStudent.dateNaissance,
      lieuNaissance: editingStudent.lieuNaissance || null,
      CursusUniversitaire: {
        section: editingStudent.CursusUniversitaire[0]?.section || '',
        groupe: editingStudent.CursusUniversitaire[0]?.groupe || '',
        filiere: editingStudent.CursusUniversitaire[0]?.filiere || '',
        specialite: editingStudent.CursusUniversitaire[0]?.specialite || '',
        niveau: editingStudent.CursusUniversitaire[0]?.niveau || 1,
        moyenneAnnuelle: editingStudent.CursusUniversitaire[0]?.moyenneAnnuelle || null
      }
    };

    const response = await axios.put(
      `${API_BASE_URL}/students/update/${editingStudent.idEtudiant}`,
      updateData,
      { 
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000 // Augmenter le timeout
      }
    );

    setStudents(students.map(student =>
      student.idEtudiant === editingStudent.idEtudiant ? response.data : student
    ));
    setEditingStudent(null);
  } catch (error) {
    console.error('Error updating student:', error);
    alert(`Erreur lors de la mise à jour: ${error.response?.data?.message || error.message}`);
  }
};
 const handleSearch = async () => {
  if (!searchMatricule.trim()) {
    setSearchError("Veuillez entrer un matricule");
    return;
  }

  try {
    setLoading(true);
    setSearchError(null);
    
    const response = await axios.get( 
      `${API_BASE_URL}/students/${searchMatricule}`,
      { 
        headers: { Authorization: `Bearer ${token}` },
        params: { anneeId }
      }
    );
    
    // Si l'API retourne un seul étudiant, le mettre dans un tableau
    const result = Array.isArray(response.data) ? response.data : [response.data];
    setStudents(result);
    setSearchMode(true);
  } catch (err) {
    if (err.response?.status === 404) {
      setSearchError("Aucun étudiant trouvé avec ce matricule");
    } else {
      console.error("Erreur de recherche:", err);
      setSearchError("Erreur lors de la recherche");
    }
    setStudents([]);
  } finally {
    setLoading(false);
  }
};

const handleResetSearch = () => {
  setSearchMatricule('');
  setSearchMode(false);
  setSearchError(null);
  // Recharger tous les étudiants
  fetchStudents();
};

  const handleDeleteStudent = async (id) => {
    if (typeof window !== 'undefined' && !window.confirm('Supprimer cet étudiant?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/students/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(students.filter(student => student.idEtudiant !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const filteredStudents = students.filter(student =>
    student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
      {editingStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              width: '600px',
              maxWidth: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <h3 style={{ marginTop: 0 }}>Modifier l'étudiant</h3>
            
            <form onSubmit={handleUpdateStudent}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nom</label>
                  <input
                    type="text"
                    value={editingStudent.nom}
                    onChange={(e) => setEditingStudent({
                      ...editingStudent,
                      nom: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: `1px solid ${colors.border}`
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Prénom</label>
                  <input
                    type="text"
                    value={editingStudent.prenom}
                    onChange={(e) => setEditingStudent({
                      ...editingStudent,
                      prenom: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: `1px solid ${colors.border}`
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({
                      ...editingStudent,
                      email: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: `1px solid ${colors.border}`
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Matricule</label>
                  <input
                    type="text"
                    value={editingStudent.matricule}
                    onChange={(e) => setEditingStudent({
                      ...editingStudent,
                      matricule: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: `1px solid ${colors.border}`
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Téléphone</label>
                  <input
                    type="text"
                    value={editingStudent.telephone || ''}
                    onChange={(e) => setEditingStudent({
                      ...editingStudent,
                      telephone: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: `1px solid ${colors.border}`
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Date de naissance</label>
                  <input
                    type="date"
                    value={editingStudent.dateNaissance ? new Date(editingStudent.dateNaissance).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditingStudent({
                      ...editingStudent,
                      dateNaissance: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: `1px solid ${colors.border}`
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Lieu de naissance</label>
                  <input
                    type="text"
                    value={editingStudent.lieuNaissance || ''}
                    onChange={(e) => setEditingStudent({
                      ...editingStudent,
                      lieuNaissance: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: `1px solid ${colors.border}`
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Cursus Universitaire</h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: colors.lightBg,
                    borderRadius: '8px'
                  }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>Filière</label>
                      <input
                        type="text"
                        value={editingStudent.CursusUniversitaire[0]?.filiere || ''}
                        onChange={(e) => setEditingStudent({
                          ...editingStudent,
                          CursusUniversitaire: [{
                            ...editingStudent.CursusUniversitaire[0] || {},
                            filiere: e.target.value
                          }]
                        })}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: `1px solid ${colors.border}`
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>Spécialité</label>
                      <input
                        type="text"
                        value={editingStudent.CursusUniversitaire[0]?.specialite || ''}
                        onChange={(e) => setEditingStudent({
                          ...editingStudent,
                          CursusUniversitaire: [{
                            ...editingStudent.CursusUniversitaire[0] || {},
                            specialite: e.target.value
                          }]
                        })}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: `1px solid ${colors.border}`
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>Niveau</label>
                      <input
                        type="number"
                        value={editingStudent.CursusUniversitaire[0]?.niveau || ''}
                        onChange={(e) => setEditingStudent({
                          ...editingStudent,
                          CursusUniversitaire: [{
                            ...editingStudent.CursusUniversitaire[0] || {},
                            niveau: parseInt(e.target.value) || 0
                          }]
                        })}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: `1px solid ${colors.border}`
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>Moyenne annuelle</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingStudent.CursusUniversitaire[0]?.moyenneAnnuelle || ''}
                        onChange={(e) => setEditingStudent({
                          ...editingStudent,
                          CursusUniversitaire: [{
                            ...editingStudent.CursusUniversitaire[0] || {},
                            moyenneAnnuelle: parseFloat(e.target.value) || 0
                          }]
                        })}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: `1px solid ${colors.border}`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem'
              }}>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    border: `1px solid ${colors.error}`,
                    color: colors.error,
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: colors.accent,
                    border: 'none',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{
          padding: '1.5rem',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 10
        }}>
          <h2 style={{ 
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: 0,
            color: colors.textDark
          }}>
            Gestion des Étudiants
          </h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.25rem',
            color: colors.textLight
          }}>
            ×
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            gap: '4.5rem'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Sélectionner l'année</label>
              <select
  value={anneeId}
  onChange={(e) => setAnneeId(e.target.value)}
  style={{
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: `1px solid ${colors.border}`
  }}
>
  <option value=''>Tous les étudiants</option>
  {annees.map((annee) => (
    <option key={annee.idAnnee} value={annee.idAnnee}>{annee.annee}</option>
  ))}
</select>
            </div>

            <div style={{
  flex: 1,
  position: 'relative',
  display: 'flex',
  gap: '0.5rem'
}}>
  <input
    type="text"
    placeholder="Rechercher par matricule..."
    value={searchMatricule}
    onChange={(e) => setSearchMatricule(e.target.value)}
    style={{
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      fontSize: '0.875rem'
    }}
  />
  <svg style={{
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1rem',
    height: '1rem',
    color: colors.textLight
  }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
  
  <button
    onClick={handleSearch}
    style={{
      padding: '0.75rem 1.25rem',
      backgroundColor: colors.accent,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer'
    }}
  >
    Rechercher
  </button>
  
  {searchMode && (
    <button
      onClick={handleResetSearch}
      style={{
        padding: '0.75rem 1.25rem',
        backgroundColor: colors.error,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
      }}
    >
      Annuler
    </button>
  )}
</div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              style={{
                padding: '0.75rem 1.25rem',
                backgroundColor: colors.accent,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Ajouter un étudiant
            </motion.button>
          </div>
{showAddForm && (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    style={{
      marginBottom: '1.5rem',
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      overflow: 'hidden'
    }}
  >
    <form onSubmit={handleAddStudent}>
      <div style={{
        padding: '1.5rem',
        backgroundColor: colors.lightBg
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          margin: '0 0 1rem 0',
          color: colors.textDark
        }}>
          Nouvel étudiant
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {/* Informations de base */}
          <div>
            <label>Nom</label>
            <input
              type="text"
              value={newStudent.nom}
              onChange={(e) => setNewStudent({...newStudent, nom: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label>Prénom</label>
            <input
              type="text"
              value={newStudent.prenom}
              onChange={(e) => setNewStudent({...newStudent, prenom: e.target.value})}
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              value={newStudent.email}
              onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label>Matricule</label>
            <input
              type="text"
              value={newStudent.matricule}
              onChange={(e) => setNewStudent({...newStudent, matricule: e.target.value})}
              required
            />
          </div>

          <div>
            <label>Téléphone</label>
            <input
              type="text"
              value={newStudent.telephone}
              onChange={(e) => setNewStudent({...newStudent, telephone: e.target.value})}
            />
          </div>

          <div>
            <label>Date de naissance</label>
            <input
              type="date"
              value={newStudent.dateNaissance}
              onChange={(e) => setNewStudent({...newStudent, dateNaissance: e.target.value})}
              required
            />
          </div>

          <div>
            <label>Lieu de naissance</label>
            <input
              type="text"
              value={newStudent.lieuNaissance}
              onChange={(e) => setNewStudent({...newStudent, lieuNaissance: e.target.value})}
            />
          </div>

          {/* Cursus Universitaire */}
          <div>
            <label>Section</label>
            <input
              type="text"
              value={newStudent.CursusUniversitaire.section}
              onChange={(e) => setNewStudent({
                ...newStudent,
                CursusUniversitaire: {
                  ...newStudent.CursusUniversitaire,
                  section: e.target.value
                }
              })}
              required
            />
          </div>

          <div>
            <label>Groupe</label>
            <input
              type="text"
              value={newStudent.CursusUniversitaire.groupe}
              onChange={(e) => setNewStudent({
                ...newStudent,
                CursusUniversitaire: {
                  ...newStudent.CursusUniversitaire,
                  groupe: e.target.value
                }
              })}
              required
            />
          </div>

          <div>
            <label>Filière</label>
            <input
              type="text"
              value={newStudent.CursusUniversitaire.filiere}
              onChange={(e) => setNewStudent({
                ...newStudent,
                CursusUniversitaire: {
                  ...newStudent.CursusUniversitaire,
                  filiere: e.target.value
                }
              })}
              required
            />
          </div>

          <div>
            <label>Spécialité</label>
            <input
              type="text"
              value={newStudent.CursusUniversitaire.specialite}
              onChange={(e) => setNewStudent({
                ...newStudent,
                CursusUniversitaire: {
                  ...newStudent.CursusUniversitaire,
                  specialite: e.target.value
                }
              })}
            />
          </div>

          <div>
            <label>Niveau</label>
            <input
              type="number"
              value={newStudent.CursusUniversitaire.niveau}
              onChange={(e) => setNewStudent({
                ...newStudent,
                CursusUniversitaire: {
                  ...newStudent.CursusUniversitaire,
                  niveau: e.target.value
                }
              })}
              required
            />
          </div>

          <div>
            <label>Moyenne annuelle</label>
            <input
              type="number"
              step="0.01"
              value={newStudent.CursusUniversitaire.moyenneAnnuelle}
              onChange={(e) => setNewStudent({
                ...newStudent,
                CursusUniversitaire: {
                  ...newStudent.CursusUniversitaire,
                  moyenneAnnuelle: e.target.value
                }
              })}
            />
          </div>

          <div>
            <label>Année universitaire</label>
            <select
              value={newStudent.CursusUniversitaire.idAnnee}
              onChange={(e) => setNewStudent({
                ...newStudent,
                CursusUniversitaire: {
                  ...newStudent.CursusUniversitaire,
                  idAnnee: e.target.value
                }
              })}
              required
            >
              <option value="">Sélectionner une année</option>
              {annees.map(annee => (
                <option key={annee.idAnnee} value={annee.idAnnee}>
                  {annee.annee}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          marginTop: '1.5rem'
        }}>
          <motion.button
            type="button"
            onClick={() => setShowAddForm(false)}
          >
            Annuler
          </motion.button>
          
          <motion.button
            type="submit"
          >
            Enregistrer
          </motion.button>
        </div>
      </div>
    </form>
  </motion.div>
)}
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: colors.textLight
            }}>
              Chargement en cours...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: colors.textLight
            }}>
              Aucun étudiant trouvé
            </div>
          ) : (
            <div style={{
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: colors.lightBg,
                    borderBottom: `1px solid ${colors.border}`
                  }}>
                    <th style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: colors.textDark
                    }}>
                      Nom
                    </th>
                    <th style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: colors.textDark
                    }}>
                      Prénom
                    </th>
                    <th style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: colors.textDark
                    }}>
                      Matricule
                    </th>
                    <th style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: colors.textDark
                    }}>
                      Filière
                    </th>
                    <th style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'right',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: colors.textDark
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.idEtudiant} style={{
                      borderBottom: `1px solid ${colors.border}`
                    }}>
                      <td style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        color: colors.textDark
                      }}>
                        {student.nom}
                      </td>
                      <td style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        color: colors.textDark
                      }}>
                        {student.prenom}
                      </td>
                      <td style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        color: colors.textDark
                      }}>
                        {student.matricule}
                      </td>
                      <td style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        color: colors.textDark
                      }}>
                        {student.CursusUniversitaire[0]?.filiere || 'N/A'}
                      </td>
                      <td style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'right'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: '0.75rem'
                        }}>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setEditingStudent(student)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#EBF8F2',
                              color: colors.success,
                              border: `1px solid ${colors.success}`,
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.success} strokeWidth="2">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Modifier
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleDeleteStudent(student.idEtudiant)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#FEEBEB',
                              color: colors.error,
                              border: `1px solid ${colors.error}`,
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.error} strokeWidth="2">
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Supprimer
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentManagement;

