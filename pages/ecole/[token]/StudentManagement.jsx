import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

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

const StudentManagement = ({ formationId, onClose, annees }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchMatricule, setSearchMatricule] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [selectedAnnee, setSelectedAnnee] = useState('');
 const [newStudent, setNewStudent] = useState({
  nom: '',
  prenom: '',
  email: '',
  matricule: '',
  telephone: '',
  dateNaissance: '2000-01-01',
  lieuNaissance: '',
  CursusEcole: {
    moyenne: '',
    anneeId: ''
  }
});


  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = localStorage.getItem('ecole_token');
  const ecoleId = localStorage.getItem('ecole_id');
  const [anneeId, setAnneeId] = useState('');

  

  useEffect(() => {
    const fetchAnnees = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/ecole/${ecoleId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Handle response if needed
      } catch (error) {
        console.error("Erreur lors du chargement des années de l'école :", error);
      }
    };
    fetchAnnees();
  }, [token, ecoleId, API_BASE_URL]);

  useEffect(() => {
     const fetchStudents = async () => {
  setLoading(true);
  try {
    const url = anneeId
      ? `${API_BASE_URL}/formations/${formationId}/students?anneeId=${anneeId}`
      : `${API_BASE_URL}/formations/${formationId}/etudiants`;

    console.log("Fetching students from URL:", url);
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
  }, [formationId, anneeId, token]);



  const handleSearch = async () => {
    if (!searchMatricule.trim()) {
      setSearchError("Veuillez entrer un matricule");
      return;
    }

    try {
      setLoading(true);
      setSearchError(null);
      
      const response = await axios.get(
        `${API_BASE_URL}/cursus-ecole/etudiant/${searchMatricule}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          params: { formationId, anneeId: selectedAnnee }
        }
      );
      
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
    fetchStudents();
  };


const handleAddStudent = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `${API_BASE_URL}/etudiants-ecole/create`,
      {
        nom: newStudent.nom,
        prenom: newStudent.prenom,
        email: newStudent.email,
        matricule: newStudent.matricule,
        telephone: newStudent.telephone,
        dateNaissance: newStudent.dateNaissance,
        lieuNaissance: newStudent.lieuNaissance,
        formationId: parseInt(formationId),
        anneeId: parseInt(newStudent.CursusEcole.anneeId),  // <-- déplacer ici
        moyenne: newStudent.CursusEcole.moyenne
          ? parseFloat(newStudent.CursusEcole.moyenne)
          : null
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setStudents([...students, response.data]);
    setShowAddForm(false);
    setNewStudent({
      nom: '',
      prenom: '',
      email: '',
      matricule: '',
      telephone: '',
      dateNaissance: '2000-01-01',
      lieuNaissance: '',
      CursusEcole: {
        moyenne: '',
        anneeId: ''
      }
    });
  } catch (error) {
    console.error('Error adding student:', error);
  }
};



  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/etudiants-ecole/update/${editingStudent.idEtudiantEcole}`,
        {
          nom: editingStudent.nom,
          prenom: editingStudent.prenom,
          email: editingStudent.email,
          matricule: editingStudent.matricule,
          telephone: editingStudent.telephone,
          dateNaissance: editingStudent.dateNaissance,
          lieuNaissance: editingStudent.lieuNaissance,
          moyenne: editingStudent.moyenne ? parseFloat(editingStudent.moyenne) : null,
          anneeId: parseInt(editingStudent.anneeId)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setStudents(students.map(student =>
        student.idEtudiantEcole === editingStudent.idEtudiantEcole ? response.data : student
      ));
      setEditingStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm('Supprimer cet étudiant?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/etudiants-ecole/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(students.filter(student => student.idEtudiantEcole !== id));
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
                    value={editingStudent.telephone}
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
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Date de Naissance</label>
                  <input
                    type="date"
                    value={editingStudent.dateNaissance}
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
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Lieu de Naissance</label>
                  <input
                    type="text"
                    value={editingStudent.lieuNaissance}
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

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Moyenne</label>
                  <input
                    type="number"
                    value={editingStudent.moyenne}
                    onChange={(e) => setEditingStudent({
                      ...editingStudent,
                      moyenne: e.target.value
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    color: colors.textDark,
                    border: `1px solid ${colors.border}`,
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
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Mettre à jour
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
          padding: '2rem',
          width: '600px',
          maxWidth: '90%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <h3 style={{ marginTop: 0 }}>Gestion des Étudiants</h3>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Rechercher par matricule..."
            value={searchMatricule}
            onChange={(e) => setSearchMatricule(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: `1px solid ${colors.border}`
            }}
          />
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
    <option key={annee.idAnnee} value={annee.id}>{annee.annee}</option>

  ))}
</select>
            </div>
          <button
            onClick={handleSearch}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '0.5rem'
            }}
          >
            Rechercher
          </button>
          {searchError && <p style={{ color: colors.error }}>{searchError}</p>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: colors.accent,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showAddForm ? 'Annuler' : 'Ajouter un Étudiant'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddStudent} style={{ marginBottom: '1rem' }}>
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
                  value={newStudent.nom}
                  onChange={(e) => setNewStudent({ ...newStudent, nom: e.target.value })}
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
                  value={newStudent.prenom}
                  onChange={(e) => setNewStudent({ ...newStudent, prenom: e.target.value })}
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
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
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
                  value={newStudent.matricule}
                  onChange={(e) => setNewStudent({ ...newStudent, matricule: e.target.value })}
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
                  value={newStudent.telephone}
                  onChange={(e) => setNewStudent({ ...newStudent, telephone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: `1px solid ${colors.border}`
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Date de Naissance</label>
                <input
                  type="date"
                  value={newStudent.dateNaissance}
                  onChange={(e) => setNewStudent({ ...newStudent, dateNaissance: e.target.value })}
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
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Lieu de Naissance</label>
                <input
                  type="text"
                  value={newStudent.lieuNaissance}
                  onChange={(e) => setNewStudent({ ...newStudent, lieuNaissance: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: `1px solid ${colors.border}`
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Moyenne</label>
                <input
                  type="number"
                  value={newStudent.moyenne}
                  onChange={(e) => setNewStudent({ ...newStudent, moyenne: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: `1px solid ${colors.border}`
                  }}
                />
              </div>
           

               <div>
            <label>Année</label>
            <select
              value={newStudent.CursusEcole.anneeId}
              onChange={(e) => setNewStudent({
                ...newStudent,
                CursusEcole: {
                  ...newStudent.CursusEcole,
                  anneeId: e.target.value
                }
              })}
              required
            >
              <option value="">Sélectionner une année</option>
              {annees.map(annee => (
                <option key={annee.id} value={annee.id}>
                  {annee.annee}
                </option>
              ))}
            </select>
          </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: colors.textDark,
                  border: `1px solid ${colors.border}`,
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
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Ajouter
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p>Chargement des étudiants...</p>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            {filteredStudents.length === 0 ? (
              <p>Aucun étudiant trouvé.</p>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {filteredStudents.map(student => (
                  <li key={student.idEtudiantEcole} style={{
                    padding: '0.5rem',
                    borderBottom: `1px solid ${colors.border}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <strong>{student.nom} {student.prenom}</strong> - Matricule: {student.matricule}
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setEditingStudent(student);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: colors.accent,
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '0.5rem'
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.idEtudiantEcole)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: colors.error,
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentManagement;
