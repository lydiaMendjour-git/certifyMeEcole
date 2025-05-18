import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const GestionFormations = () => {
  const router = useRouter();
  const [formations, setFormations] = useState([]);
  const [students, setStudents] = useState({});
  const [showFormationForm, setShowFormationForm] = useState(false);
  const [newFormationName, setNewFormationName] = useState('');
  const [newFormationType, setNewFormationType] = useState('Certification');
  const [newFormationDuration, setNewFormationDuration] = useState('');
  const [expandedFormations, setExpandedFormations] = useState({});
  const [showStudentForms, setShowStudentForms] = useState({});
  const [newStudentData, setNewStudentData] = useState({});
  const [annees, setAnnees] = useState([]);
  const [loading, setLoading] = useState({
    formations: false,
    students: {}
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showEditFormationModal, setShowEditFormationModal] = useState(false);
  const [currentEditFormation, setCurrentEditFormation] = useState(null);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [currentEditStudent, setCurrentEditStudent] = useState(null);
  const studentFormRef = useRef(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [ecoleId, setEcoleId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('ecole_id');
    const storedToken = localStorage.getItem('ecole_token');

    if (!storedId || !storedToken) {
      router.push('/ecole/login');
      return;
    }

    setEcoleId(storedId);
    setToken(storedToken);
  }, [router]);

  useEffect(() => {
    if (!ecoleId || !token) return;

    const loadFormations = async () => {
      try {
        setLoading(prev => ({ ...prev, formations: true }));
        setError(null);
        
        const response = await axios.get(`${API_BASE_URL}/ecoles/${ecoleId}/formations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setFormations(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des formations');
        console.error('Error loading formations:', err);
      } finally {
        setLoading(prev => ({ ...prev, formations: false }));
      }
    };

    const loadAnnees = async () => {
      try { 
        const response = await axios.get(
          `${API_BASE_URL}/ecole/${ecoleId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAnnees(response.data);
      } catch (error) {
        console.error("Erreur chargement années:", error);
      }
    };

    loadFormations();
    loadAnnees();
  }, [ecoleId, token, API_BASE_URL]);

  const loadStudents = async (formationId) => {
    try {
      setLoading(prev => ({
        ...prev,
        students: { ...prev.students, [formationId]: true }
      }));
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/formations/${formationId}/etudiants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setStudents(prev => ({
        ...prev,
        [formationId]: response.data,
      }));
    } catch (err) {
      setError(`Erreur lors du chargement des étudiants`);
      console.error('Error loading students:', err);
    } finally {
      setLoading(prev => ({
        ...prev,
        students: { ...prev.students, [formationId]: false }
      }));
    }
  };

  const toggleFormationExpansion = async (formationId) => {
    const isExpanded = !expandedFormations[formationId];
    setExpandedFormations(prev => ({
      ...prev,
      [formationId]: isExpanded,
    }));

    if (isExpanded && !students[formationId]) {
      await loadStudents(formationId);
    }
  };

  const handleAddFormation = async (e) => {
    e.preventDefault();
    if (!newFormationName.trim()) {
      setError('Veuillez entrer un nom de formation');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, formations: true }));
      setError(null);
      
      await axios.post(`${API_BASE_URL}/formations/create`, {
        nomFormation: newFormationName,
        typeFormation: newFormationType,
        duree: newFormationDuration,
        ecoleId: ecoleId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await axios.get(`${API_BASE_URL}/ecoles/${ecoleId}/formations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setFormations(response.data);
      setNewFormationName('');
      setNewFormationType('Certification');
      setNewFormationDuration('');
      setShowFormationForm(false);
      setSuccess('Formation créée avec succès');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
      console.error('Error adding formation:', err);
    } finally {
      setLoading(prev => ({ ...prev, formations: false }));
    }
  };

  const handleUpdateFormation = async (formationId, currentData) => {
    setCurrentEditFormation({ id: formationId, ...currentData });
    setShowEditFormationModal(true);
  };

  const submitUpdateFormation = async (e) => {
    e.preventDefault();
    if (!currentEditFormation?.nomFormation.trim()) {
      setError('Veuillez entrer un nom de formation');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, formations: true }));
      setError(null);
      
      await axios.put(`${API_BASE_URL}/formations/update/${currentEditFormation.id}`, {
        nomFormation: currentEditFormation.nomFormation.trim(),
        typeFormation: currentEditFormation.typeFormation,
        duree: currentEditFormation.duree,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormations(prev =>
        prev.map(f =>
          f.idFormation === currentEditFormation.id ? { ...f, ...currentEditFormation } : f
        )
      );
      setSuccess('Formation mise à jour avec succès');
      setShowEditFormationModal(false);
    } catch (err) {
      setError('Échec de la mise à jour');
      console.error('Error updating formation:', err);
    } finally {
      setLoading(prev => ({ ...prev, formations: false }));
    }
  };

  const handleDeleteFormation = async (formationId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation?')) return;

    try {
      setLoading(prev => ({ ...prev, formations: true }));
      setError(null);
      
      await axios.delete(`${API_BASE_URL}/formations/delete/${formationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormations(prev => prev.filter(f => f.idFormation !== formationId));
      setSuccess('Formation supprimée avec succès');
    } catch (err) {
      setError('Échec de la suppression');
      console.error('Error deleting formation:', err);
    } finally {
      setLoading(prev => ({ ...prev, formations: false }));
    }
  };

  const toggleStudentForm = (formationId) => {
    setShowStudentForms(prev => ({
      ...prev,
      [formationId]: !prev[formationId],
    }));
    setNewStudentData(prev => ({
      ...prev,
      [formationId]: {
        nom: '',
        prenom: '',
        email: '',
        matricule: '',
        telephone: '',
        moyenne: '',
        dateNaissance: '2000-01-01',
        lieuNaissance: '',
        anneeId: ''
      },
    }));

    setTimeout(() => {
      if (studentFormRef.current) {
        studentFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const handleAddStudent = async (formationId) => {
    const student = newStudentData[formationId];
    
    if (!student?.nom?.trim() || !student?.prenom?.trim() || 
        !student?.email?.trim() || !student?.matricule?.trim() || !student?.anneeId) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(prev => ({
        ...prev,
        students: { ...prev.students, [formationId]: true }
      }));
      setError(null);
      
      const response = await axios.post(
        `${API_BASE_URL}/etudiants-ecole/create`,
        {
          nom: student.nom.trim(),
          prenom: student.prenom.trim(),
          email: student.email.trim(),
          matricule: student.matricule.trim(),
          telephone: student.telephone?.trim() || null,
          dateNaissance: student.dateNaissance,
          lieuNaissance: student.lieuNaissance || null,
          moyenne: student.moyenne ? parseFloat(student.moyenne) : null,
          formationId: parseInt(formationId),
          anneeId: parseInt(student.anneeId),
          ecoleId: parseInt(ecoleId)
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await loadStudents(formationId);
      setShowStudentForms(prev => ({
        ...prev,
        [formationId]: false,
      }));
      setSuccess('Étudiant ajouté avec succès');
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de l'ajout");
      console.error('Error adding student:', error);
    } finally {
      setLoading(prev => ({
        ...prev,
        students: { ...prev.students, [formationId]: false }
      }));
    }
  };

  const handleUpdateStudent = async (studentId, currentData) => {
    setCurrentEditStudent({ id: studentId, ...currentData });
    setShowEditStudentModal(true);
  };

 const submitUpdateStudent = async (e) => {
  e.preventDefault();
  try {
    const formationId = Object.keys(students).find(fId =>
      students[fId].some(s => s.idEtudiantEcole === currentEditStudent.id)
    );
    
    if (!formationId) throw new Error('Formation non trouvée');

    setLoading(prev => ({
      ...prev,
      students: { ...prev.students, [formationId]: true }
    }));
    setError(null);
    
    // Formatage des données avant envoi
    const studentData = {
      nom: currentEditStudent.nom,
      prenom: currentEditStudent.prenom,
      email: currentEditStudent.email,
      matricule: currentEditStudent.matricule,
      telephone: currentEditStudent.telephone || '',
      dateNaissance: currentEditStudent.dateNaissance || '2000-01-01',
      lieuNaissance: currentEditStudent.lieuNaissance || null,
      moyenne: currentEditStudent.moyenne ? parseFloat(currentEditStudent.moyenne) : null
    };

    await axios.put(`${API_BASE_URL}/etudiants-ecole/update/${currentEditStudent.id}`, 
      studentData,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    setStudents(prev => ({
      ...prev,
      [formationId]: prev[formationId].map(s =>
        s.idEtudiantEcole === currentEditStudent.id ? { ...s, ...currentEditStudent } : s
      ),
    }));
    setSuccess('Étudiant mis à jour avec succès');
    setShowEditStudentModal(false);
  } catch (err) {
    setError(err.response?.data?.error || 'Échec de la mise à jour');
    console.error('Error updating student:', err);
  } finally {
    const formationId = Object.keys(students).find(fId =>
      students[fId].some(s => s.idEtudiantEcole === currentEditStudent.id)
    );
    
    if (formationId) {
      setLoading(prev => ({
        ...prev,
        students: { ...prev.students, [formationId]: false }
      }));
    }
  }
};

  const handleDeleteStudent = async (studentId) => {
    if (!confirm('Supprimer cet étudiant ?')) return;

    try {
      const formationId = Object.keys(students).find(fId =>
        students[fId].some(s => s.idEtudiantEcole === studentId)
      );
      
      if (!formationId) throw new Error('Formation non trouvée');

      setLoading(prev => ({
        ...prev,
        students: { ...prev.students, [formationId]: true }
      }));
      setError(null);
      
      await axios.delete(`${API_BASE_URL}/etudiants-ecole/delete/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudents(prev => ({
        ...prev,
        [formationId]: prev[formationId].filter(s => s.idEtudiantEcole !== studentId),
      }));
      setSuccess('Étudiant supprimé avec succès');
    } catch (err) {
      setError('Échec de la suppression');
      console.error('Error deleting student:', err);
    } finally {
      const formationId = Object.keys(students).find(fId =>
        students[fId].some(s => s.idEtudiantEcole === studentId)
      );
      
      if (formationId) {
        setLoading(prev => ({
          ...prev,
          students: { ...prev.students, [formationId]: false }
        }));
      }
    }
  };

  const handleGoBack = () => {
    const token = localStorage.getItem('ecole_token');
    if (token) {
      const safeToken = encodeURIComponent(token);
      router.push(`/ecole/IntegrationEcole?token=${safeToken}`);
    } else {
      router.push('/ecole/login');
    }
  };

  return (
    <div className="admin-dashboard">
      <style jsx>{`
        .admin-dashboard {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .dashboard-header {
          margin-bottom: 30px;
          text-align: center;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          overflow: hidden;
          margin-bottom: 30px;
        }
        
        .card-header {
          padding: 20px;
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .card-body {
          padding: 20px;
          max-height: 600px;
          overflow-y: auto;
        }
        
        .accordion-item {
          margin-bottom: 10px;
          border-radius: 10px;
          overflow: hidden;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .item-header {
          padding: 15px 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        
        .expanded .accordion-content {
          max-height: 1000px;
        }
        
        .sub-panel {
          padding: 15px;
          background: #f9f9f9;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        
        .btn {
          padding: 8px 15px;
          border-radius: 5px;
          cursor: pointer;
          border: none;
          margin-right: 10px;
        }
        
        .btn-primary {
          background: #6e8efb;
          color: white;
        }
        
        .btn-danger {
          background: #e74c3c;
          color: white;
        }
        
        .error-message {
          color: #e74c3c;
          background: #fdecea;
          padding: 10px;
          border-radius: 5px;
          margin: 10px 0;
        }
        
        .success-message {
          color: #2ecc71;
          background: #e8f8f0;
          padding: 10px;
          border-radius: 5px;
          margin: 10px 0;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }

        .form-scrollable {
          max-height: 60vh;
          overflow-y: auto;
          padding-right: 10px;
        }
      `}</style>

      <header className="dashboard-header">
        <h1>Gestion des Formations</h1>
      </header>

      <main>
        <div className="glass-card">
          <div className="card-header">
            <h2>Liste des Formations</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowFormationForm(true)}
            >
              Ajouter Formation
            </button>
          </div>

          <div className="card-body">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {loading.formations ? (
              <div>Chargement...</div>
            ) : formations.length === 0 ? (
              <div>Aucune formation enregistrée</div>
            ) : (
              <div className="accordion-list">
                {formations.map(formation => (
                  <div 
                    key={formation.idFormation} 
                    className={`accordion-item ${expandedFormations[formation.idFormation] ? 'expanded' : ''}`}
                  >
                    <div 
                      className="item-header"
                      onClick={() => toggleFormationExpansion(formation.idFormation)}
                    >
                      <div style={{ flex: 1 }}>
                        {formation.nomFormation} ({formation.typeFormation})
                      </div>
                      <div>
                        <button 
                          className="btn btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateFormation(formation.idFormation, formation);
                          }}
                        >
                          Modifier
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFormation(formation.idFormation);
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>

                    <div className="accordion-content">
                      <div className="sub-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                          <h3>Étudiants</h3>
                          <button 
                            className="btn btn-primary"
                            onClick={() => toggleStudentForm(formation.idFormation)}
                          >
                            Ajouter Étudiant
                          </button>
                        </div>

                        {loading.students[formation.idFormation] ? (
                          <div>Chargement des étudiants...</div>
                        ) : students[formation.idFormation] ? (
                          students[formation.idFormation].length === 0 ? (
                            <div>Aucun étudiant</div>
                          ) : (
                            <div>
                              {students[formation.idFormation].map(student => (
                                <div key={student.idEtudiantEcole} style={{ 
                                  padding: '10px',
                                  borderBottom: '1px solid #eee',
                                  display: 'flex',
                                  justifyContent: 'space-between'
                                }}>
                                  <div>
                                    {student.nom} {student.prenom} ({student.matricule})
                                    {student.moyenne && (
                                      <div style={{ fontSize: '0.9em', color: '#666' }}>
                                        Moyenne: {student.moyenne}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <button 
                                      className="btn btn-primary"
                                      onClick={() => handleUpdateStudent(student.idEtudiantEcole, student)}
                                    >
                                      Modifier
                                    </button>
                                    <button 
                                      className="btn btn-danger"
                                      onClick={() => handleDeleteStudent(student.idEtudiantEcole)}
                                    >
                                      Supprimer
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        ) : (
                          <div>Cliquez pour charger les étudiants</div>
                        )}

                        {showStudentForms[formation.idFormation] && (
                          <form 
                            ref={studentFormRef}
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleAddStudent(formation.idFormation);
                            }}
                            style={{ marginTop: '20px', padding: '15px', background: '#fff', borderRadius: '5px' }}
                          >
                            <div className="form-group">
                              <label>Nom</label>
                              <input 
                                type="text" 
                                value={newStudentData[formation.idFormation]?.nom || ''}
                                onChange={(e) => setNewStudentData(prev => ({
                                  ...prev,
                                  [formation.idFormation]: {
                                    ...prev[formation.idFormation],
                                    nom: e.target.value
                                  }
                                }))}
                                required
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Prénom</label>
                              <input 
                                type="text" 
                                value={newStudentData[formation.idFormation]?.prenom || ''}
                                onChange={(e) => setNewStudentData(prev => ({
                                  ...prev,
                                  [formation.idFormation]: {
                                    ...prev[formation.idFormation],
                                    prenom: e.target.value
                                  }
                                }))}
                                required
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Email</label>
                              <input 
                                type="email" 
                                value={newStudentData[formation.idFormation]?.email || ''}
                                onChange={(e) => setNewStudentData(prev => ({
                                  ...prev,
                                  [formation.idFormation]: {
                                    ...prev[formation.idFormation],
                                    email: e.target.value
                                  }
                                }))}
                                required
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Matricule</label>
                              <input 
                                type="text" 
                                value={newStudentData[formation.idFormation]?.matricule || ''}
                                onChange={(e) => setNewStudentData(prev => ({
                                  ...prev,
                                  [formation.idFormation]: {
                                    ...prev[formation.idFormation],
                                    matricule: e.target.value
                                  }
                                }))}
                                required
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Année Scolaire</label>
                              <select
                                value={newStudentData[formation.idFormation]?.anneeId || ''}
                                onChange={(e) => setNewStudentData(prev => ({
                                  ...prev,
                                  [formation.idFormation]: {
                                    ...prev[formation.idFormation],
                                    anneeId: e.target.value
                                  }
                                }))}
                                required
                              >
                                <option value="">Sélectionnez une année</option>
                                {annees.map(annee => (
                                  <option key={annee.id} value={annee.id}>
                                    {annee.annee} {annee.isCurrent && '(Courante)'}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="form-group">
                              <label>Téléphone (optionnel)</label>
                              <input 
                                type="text" 
                                value={newStudentData[formation.idFormation]?.telephone || ''}
                                onChange={(e) => setNewStudentData(prev => ({
                                  ...prev,
                                  [formation.idFormation]: {
                                    ...prev[formation.idFormation],
                                    telephone: e.target.value
                                  }
                                }))}
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Date de Naissance</label>
                              <input 
                                type="date" 
                                value={newStudentData[formation.idFormation]?.dateNaissance || '2000-01-01'}
                                onChange={(e) => setNewStudentData(prev => ({
                                  ...prev,
                                  [formation.idFormation]: {
                                    ...prev[formation.idFormation],
                                    dateNaissance: e.target.value
                                  }
                                }))}
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Lieu de Naissance (optionnel)</label>
                              <input 
                                type="text" 
                                value={newStudentData[formation.idFormation]?.lieuNaissance || ''}
                                onChange={(e) => setNewStudentData(prev => ({
                                  ...prev,
                                  [formation.idFormation]: {
                                    ...prev[formation.idFormation],
                                    lieuNaissance: e.target.value
                                  }
                                }))}
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Moyenne (optionnel)</label>
                              <input 
                                type="number" 
                                step="0.01"
                                min="0"
                                max="20"
                                value={newStudentData[formation.idFormation]?.moyenne || ''}
                                onChange={(e) => setNewStudentData(prev => ({
                                  ...prev,
                                  [formation.idFormation]: {
                                    ...prev[formation.idFormation],
                                    moyenne: e.target.value
                                  }
                                }))}
                              />
                            </div>
                            
                            <div style={{ marginTop: '20px' }}>
                              <button type="submit" className="btn btn-primary">
                                Enregistrer
                              </button>
                              <button 
                                type="button" 
                                className="btn btn-danger"
                                onClick={() => toggleStudentForm(formation.idFormation)}
                                style={{ marginLeft: '10px' }}
                              >
                                Annuler
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showFormationForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <form 
              onSubmit={handleAddFormation}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '10px',
                width: '100%',
                maxWidth: '500px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>Nouvelle Formation</h3>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowFormationForm(false);
                    setNewFormationName('');
                  }}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
              
              <div className="form-group">
                <label>Nom de la formation</label>
                <input 
                  type="text" 
                  value={newFormationName}
                  onChange={(e) => setNewFormationName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label>Type de formation</label>
                <select
                  value={newFormationType}
                  onChange={(e) => setNewFormationType(e.target.value)}
                  required
                >
                  <option value="Certification">Certification</option>
                  <option value="Diplôme">Diplôme</option>
                  <option value="Attestation">Attestation</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Durée (optionnel)</label>
                <input 
                  type="text" 
                  value={newFormationDuration}
                  onChange={(e) => setNewFormationDuration(e.target.value)}
                  placeholder="Ex: 3 ans, 6 mois..."
                />
              </div>
              
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={!newFormationName.trim()}>
                  Créer
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => {
                    setShowFormationForm(false);
                    setNewFormationName('');
                  }}
                  style={{ marginLeft: '10px' }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {showEditFormationModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Modifier Formation</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowEditFormationModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={submitUpdateFormation}>
                <div className="form-group">
                  <label>Nom de la formation</label>
                  <input 
                    type="text" 
                    value={currentEditFormation?.nomFormation || ''}
                    onChange={(e) => setCurrentEditFormation(prev => ({
                      ...prev,
                      nomFormation: e.target.value
                    }))}
                    required
                    autoFocus
                  />
                </div>
                
                <div className="form-group">
                  <label>Type de formation</label>
                  <select
                    value={currentEditFormation?.typeFormation || 'Certification'}
                    onChange={(e) => setCurrentEditFormation(prev => ({
                      ...prev,
                      typeFormation: e.target.value
                    }))}
                    required
                  >
                    <option value="Certification">Certification</option>
                    <option value="Diplôme">Diplôme</option>
                    <option value="Attestation">Attestation</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Durée (optionnel)</label>
                  <input 
                    type="text" 
                    value={currentEditFormation?.duree || ''}
                    onChange={(e) => setCurrentEditFormation(prev => ({
                      ...prev,
                      duree: e.target.value
                    }))}
                    placeholder="Ex: 3 ans, 6 mois..."
                  />
                </div>
                
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary">
                    Enregistrer
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => setShowEditFormationModal(false)}
                    style={{ marginLeft: '10px' }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditStudentModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Modifier Étudiant</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowEditStudentModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={submitUpdateStudent}>
                <div className="form-scrollable">
                  <div className="form-group">
                    <label>Nom</label>
                    <input 
                      type="text" 
                      value={currentEditStudent?.nom || ''}
                      onChange={(e) => setCurrentEditStudent(prev => ({
                        ...prev,
                        nom: e.target.value
                      }))}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Prénom</label>
                    <input 
                      type="text" 
                      value={currentEditStudent?.prenom || ''}
                      onChange={(e) => setCurrentEditStudent(prev => ({
                        ...prev,
                        prenom: e.target.value
                      }))}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={currentEditStudent?.email || ''}
                      onChange={(e) => setCurrentEditStudent(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Matricule</label>
                    <input 
                      type="text" 
                      value={currentEditStudent?.matricule || ''}
                      onChange={(e) => setCurrentEditStudent(prev => ({
                        ...prev,
                        matricule: e.target.value
                      }))}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Année Scolaire</label>
                    <select
                      value={currentEditStudent?.anneeId || ''}
                      onChange={(e) => setCurrentEditStudent(prev => ({
                        ...prev,
                        anneeId: e.target.value
                      }))}
                      required
                    >
                      <option value="">Sélectionnez une année</option>
                      {annees.map(annee => (
                        <option key={annee.id} value={annee.id}>
                          {annee.annee} {annee.isCurrent && '(Courante)'}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Téléphone (optionnel)</label>
                    <input 
                      type="text" 
                      value={currentEditStudent?.telephone || ''}
                      onChange={(e) => setCurrentEditStudent(prev => ({
                        ...prev,
                        telephone: e.target.value
                      }))}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Date de Naissance</label>
                    <input 
                      type="date" 
                      value={currentEditStudent?.dateNaissance || '2000-01-01'}
                      onChange={(e) => setCurrentEditStudent(prev => ({
                        ...prev,
                        dateNaissance: e.target.value
                      }))}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Lieu de Naissance (optionnel)</label>
                    <input 
                      type="text" 
                      value={currentEditStudent?.lieuNaissance || ''}
                      onChange={(e) => setCurrentEditStudent(prev => ({
                        ...prev,
                        lieuNaissance: e.target.value
                      }))}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Moyenne (optionnel)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      max="20"
                      value={currentEditStudent?.moyenne || ''}
                      onChange={(e) => setCurrentEditStudent(prev => ({
                        ...prev,
                        moyenne: e.target.value
                      }))}
                    />
                  </div>
                </div>
                
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary">
                    Enregistrer
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => setShowEditStudentModal(false)}
                    style={{ marginLeft: '10px' }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <button
          onClick={handleGoBack}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#6e8efb',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
        >
          ←
        </button>
      </main>
    </div>
  );
};

export default GestionFormations;