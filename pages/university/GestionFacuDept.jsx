import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
const GestionFacuDept = () => {
      const router = useRouter();
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState({});
  const [showFacultyForm, setShowFacultyForm] = useState(false);
  const [newFacultyName, setNewFacultyName] = useState('');
  const [expandedFaculties, setExpandedFaculties] = useState({});
  const [showDeptForms, setShowDeptForms] = useState({});
  const [newDeptNames, setNewDeptNames] = useState({});


  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [universityId, setUniversityId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('university_id');
    const storedToken = localStorage.getItem('uni_token');

    setUniversityId(storedId);
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!universityId || !token) return;

    const loadFaculties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/faculties/${universityId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Faculties API Response:", response.data); 
        setFaculties(response.data.data); 
        setDepartments({});
        setExpandedFaculties({});
        setShowDeptForms({});
        setNewDeptNames({});
      } catch (error) {
        console.error('Error loading faculties:', error);
      }
    };

    loadFaculties();
  }, [universityId, token]);

  const loadDepartments = async (facultyId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/departments/${facultyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments((prev) => ({
        ...prev,
        [facultyId]: response.data,
      }));
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const toggleFacultyExpansion = async (facultyId) => {
    setExpandedFaculties((prev) => ({
      ...prev,
      [facultyId]: !prev[facultyId],
    }));

    if (!expandedFaculties[facultyId] && !departments[facultyId]) {
      await loadDepartments(facultyId);
    }
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    if (!newFacultyName.trim()) {
      alert('Veuillez entrer un nom de faculté');
      return;
    }

    try {
        await axios.post(`${API_BASE_URL}/facultiescreate`, {
            nomFaculty: newFacultyName, // ce champ est bon SI le modèle l'accepte
            idUni: universityId,   
                 // ⚠️ change `universityId` en `idUni` pour que le backend le reconnaisse
          },  {
            headers: { Authorization: `Bearer ${token}` },
          });    console.log('Faculty creation data:', {
            nomFaculty: newFacultyName,
            idUni: universityId,
          });
                 

      const updatedFaculties = await axios.get(`${API_BASE_URL}/faculties/${universityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaculties(updatedFaculties.data.data);
      setNewFacultyName('');
      setShowFacultyForm(false);
    } catch (error) {
      console.error('Error:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  const handleUpdateFaculty = async (facultyId, currentName) => {
    const newName = prompt('Entrez le nouveau nom:', currentName);
    if (!newName || newName.trim() === currentName) return;

    try {
        await axios.put(`${API_BASE_URL}/facultiesupdate/${facultyId}`, {
             nomFaculty: newName.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFaculties((prev) =>
        prev.map((f) =>
          f.idFaculty === facultyId ? { ...f, nomFaculty: newName.trim() } : f
        )
      );
    } catch (error) {
      console.error('Error updating faculty:', error);
      alert('Échec de la mise à jour');
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette faculté?')) return;

    try {
        await axios.delete(`${API_BASE_URL}/facultiesdelete/${facultyId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          

      setFaculties((prev) => prev.filter((f) => f.idFaculty !== facultyId));
    } catch (error) {
      console.error('Error deleting faculty:', error);
      alert('Échec de la suppression');
    }
  };

  const toggleDeptForm = (facultyId) => {
    setShowDeptForms((prev) => ({
      ...prev,
      [facultyId]: !prev[facultyId],
    }));
    setNewDeptNames((prev) => ({
      ...prev,
      [facultyId]: '',
    }));
  };

  const handleAddDepartment = async (facultyId) => {
    const deptName = newDeptNames[facultyId]?.trim();
    if (!deptName) {
      alert('Veuillez entrer un nom valide');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/departmentscreate`, {
        nomDepart: deptName,
       idFaculty : facultyId,
       idUni: universityId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await loadDepartments(facultyId);

      setShowDeptForms((prev) => ({
        ...prev,
        [facultyId]: false,
      }));
      setNewDeptNames((prev) => ({
        ...prev,
        [facultyId]: '',
      }));
    } catch (error) {
      console.error('Error:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  const handleUpdateDepartment = async (deptId, currentName) => {
    const newName = prompt('Entrez le nouveau nom:', currentName);
    if (!newName || newName.trim() === currentName) return;

    try {
        await axios.put(`${API_BASE_URL}/departmentsupdate/${deptId}`, {
            nomDepart: newName.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const facultyId = Object.keys(departments).find((fId) =>
        departments[fId].some((d) => d.idDepart === deptId)
      );

      if (facultyId) {
        setDepartments((prev) => ({
          ...prev,
          [facultyId]: prev[facultyId].map((d) =>
            d.idDepart === deptId ? { ...d, nomDepart: newName.trim() } : d
          ),
        }));
      }
    } catch (error) {
      console.error('Error updating department:', error);
      alert('Échec de la mise à jour');
    }
  };
  const handleGoBack = () => {
    const token = localStorage.getItem('uni_token');
    if (token) {
      const safeToken = encodeURIComponent(token);
      router.push(`/university/IntegrationBd?token=${safeToken}`);
    }  };


  const handleDeleteDepartment = async (deptId) => {
    if (!confirm('Supprimer ce département ?')) return;

    try {
        await axios.delete(`${API_BASE_URL}/departmentsdelete/${deptId}`, {
            headers: { Authorization: `Bearer ${token}` },
      });

      const facultyId = Object.keys(departments).find((fId) =>
        departments[fId].some((d) => d.idDepart === deptId)
      );

      if (facultyId) {
        setDepartments((prev) => ({
          ...prev,
          [facultyId]: prev[facultyId].filter((d) => d.idDepart !== deptId),
        }));
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Échec de la suppression');
    }
  };

  return (
    <div className="admin-dashboard">
        {/* Animated Header with Gradient */}
        <header className="dashboard-header">
            <div className="header-content">
                <h1 className="animated-title">
                    <span className="title-text">Gestion des facultés</span>
                    <span className="title-underline"></span>
                </h1>
                <div className="header-decoration">
                    <div className="decoration-circle"></div>
                    <div className="decoration-circle"></div>
                    <div className="decoration-circle"></div>
                </div>
            </div>
        </header>

        {/* Main Content with Floating Card */}
        <main className="dashboard-main">
            <div className="floating-card-container">
                {/* Faculty Panel with Glass Morphism Effect */}
                <section className="glass-card faculty-panel">
                    {/* Card Header with Animated Actions */}
                    <div className="card-header animated-header">
                        <h2 className="card-title">
                            <i className="fas fa-list-alt title-icon"></i>
                            Liste des facultés
                        </h2>
                        <button 
                            className="add-button floating-action-btn"
                            onClick={() => setShowFacultyForm(true)}
                            aria-label="Ajouter une nouvelle faculté"
                        >
                            <i className="fas fa-plus"></i>
                            <span className="btn-tooltip">Nouvelle faculté</span>
                            <span className="btn-pulse"></span>
                        </button>
                    </div>

                    {/* Faculty List with Smooth Transitions */}
                    <div className="card-body scrollable-content">
                        {faculties.length === 0 ? (
                            <div className="empty-state animated-fadein">
                                <div className="empty-illustration">
                                    <i className="fas fa-university"></i>
                                    <div className="empty-wave"></div>
                                </div>
                                <p className="empty-message">Aucune faculté enregistrée</p>
                                <button 
                                    className="btn btn-gradient"
                                    onClick={() => setShowFacultyForm(true)}
                                >
                                    Créer votre première faculté
                                </button>
                            </div>
                        ) : (
                            <ul className="accordion-list">
                                {faculties.map(faculty => (
                                    <li 
                                        key={faculty.idFaculty} 
                                        className={`accordion-item ${expandedFaculties[faculty.idFaculty] ? 'expanded' : ''}`}
                                    >
                                        {/* Faculty Item with Hover Effects */}
                                        <div 
                                            className="item-header hover-scale"
                                            onClick={() => toggleFacultyExpansion(faculty.idFaculty)}
                                        >
                                            <div className="item-indicator">
                                                <i className="fas fa-chevron-down accordion-icon"></i>
                                                <div className="faculty-badge">{faculty.nomFaculty.charAt(0)}</div>
                                            </div>
                                            <span className="item-title">{faculty.nomFaculty}</span>
                                            <div className="item-actions">
                                                <button 
                                                    className="icon-btn edit-btn tooltip"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateFaculty(faculty.idFaculty, faculty.nomFaculty);
                                                    }}
                                                    data-tooltip="Modifier"
                                                >
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button 
                                                    className="icon-btn delete-btn tooltip"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteFaculty(faculty.idFaculty);
                                                    }}
                                                    data-tooltip="Supprimer"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Departments Section with Slide Animation */}
                                        <div className="accordion-content">
                                            <div className="sub-panel">
                                                <div className="sub-header">
                                                    <h3 className="sub-title">
                                                        <i className="fas fa-sitemap"></i>
                                                        Départements
                                                    </h3>
                                                    <button 
                                                        className="add-sub-button"
                                                        onClick={() => toggleDeptForm(faculty.idFaculty)}
                                                    >
                                                        <i className="fas fa-plus-circle"></i>
                                                        Ajouter département
                                                    </button>
                                                </div>
                                                
                                                {/* Department List with Staggered Animation */}
                                                <ul className="staggered-list">
                                                    {departments[faculty.idFaculty] ? (
                                                        departments[faculty.idFaculty].length === 0 ? (
                                                            <li className="empty-sub-state">
                                                                <i className="fas fa-inbox"></i>
                                                                <p>Aucun département enregistré</p>
                                                            </li>
                                                        ) : (
                                                            departments[faculty.idFaculty].map((dept, index) => (
                                                                <li 
                                                                    key={dept.idDepart} 
                                                                    className="sub-item"
                                                                    style={{ animationDelay: `${index * 0.05}s` }}
                                                                >
                                                                    <div className="sub-item-content">
                                                                        <i className="fas fa-folder sub-item-icon"></i>
                                                                        <span className="sub-item-title">{dept.nomDepart}</span>
                                                                        <div className="sub-item-actions">
                                                                            <button 
                                                                                className="icon-btn sub-edit-btn"
                                                                                onClick={() => handleUpdateDepartment(dept.idDepart, dept.nomDepart)}
                                                                            >
                                                                                <i className="fas fa-pen-fancy"></i>
                                                                            </button>
                                                                            <button 
                                                                                className="icon-btn sub-delete-btn"
                                                                                onClick={() => handleDeleteDepartment(dept.idDepart)}
                                                                            >
                                                                                <i className="fas fa-trash-alt"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="sub-item-progress"></div>
                                                                </li>
                                                            ))
                                                        )
                                                    ) : (
                                                        <li className="loading-sub-state">
                                                            <div className="loading-spinner"></div>
                                                            <span>Chargement des départements...</span>
                                                        </li>
                                                    )}
                                                </ul>

                                                {/* Add Department Form with Floating Label */}
                                                {showDeptForms[faculty.idFaculty] && (
                                                    <form 
                                                        className="floating-form"
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            handleAddDepartment(faculty.idFaculty);
                                                        }}
                                                    >
                                                        <div className="form-group floating-group">
                                                            <input 
                                                                type="text" 
                                                                id={`deptName-${faculty.idFaculty}`}
                                                                className="floating-input"
                                                                placeholder=" "
                                                                value={newDeptNames[faculty.idFaculty] || ''}
                                                                onChange={(e) => setNewDeptNames(prev => ({
                                                                    ...prev,
                                                                    [faculty.idFaculty]: e.target.value
                                                                }))}
                                                                autoFocus
                                                            />
                                                            <label 
                                                                htmlFor={`deptName-${faculty.idFaculty}`}
                                                                className="floating-label"
                                                            >
                                                                Nom du département
                                                            </label>
                                                            <div className="form-actions">
                                                                <button 
                                                                    type="submit" 
                                                                    className="btn btn-success btn-animated"
                                                                    disabled={!newDeptNames[faculty.idFaculty]?.trim()}
                                                                >
                                                                    <span className="btn-text">Enregistrer</span>
                                                                    <span className="btn-icon">
                                                                        <i className="fas fa-check"></i>
                                                                    </span>
                                                                </button>
                                                                <button 
                                                                    type="button" 
                                                                    className="btn btn-cancel btn-animated"
                                                                    onClick={() => toggleDeptForm(faculty.idFaculty)}
                                                                >
                                                                    <span className="btn-text">Annuler</span>
                                                                    <span className="btn-icon">
                                                                        <i className="fas fa-times"></i>
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Add Faculty Form with Modal Effect */}
                    {showFacultyForm && (
                        <div className="modal-overlay">
                            <form 
                                className="modal-form"
                                onSubmit={handleAddFaculty}

                            >
                                <div className="modal-header">
                                    <h3>Nouvelle faculté</h3>
                                    <button 
                                        type="button" 
                                        className="modal-close"
                                        onClick={() => {
                                            setShowFacultyForm(false);
                                            setNewFacultyName('');
                                        }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group floating-group">
                                        <input 
                                            type="text" 
                                            id="facultyName"
                                            className="floating-input"
                                            placeholder=" "
                                            value={newFacultyName}
                                             onChange={(e) => setNewFacultyName(e.target.value)}
                                            autoFocus
                                        />
                                        <label htmlFor="facultyName" className="floating-label">
                                            Nom de la faculté
                                        </label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-animated"
                                        disabled={!newFacultyName.trim()}
                                    >
                                        <span className="btn-text">Créer</span>
                                        <span className="btn-icon">
                                            <i className="fas fa-plus"></i>
                                        </span>
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline"
                                        onClick={() => {
                                            setShowFacultyForm(false);
                                            setNewFacultyName('');
                                        }}
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </section>

                {/* Back Button with Cool Hover Effect */}
                <button
                    onClick={handleGoBack}
                    className="back-btn floating-btn"
                >
                    <i className="fas fa-arrow-left"></i>
                    <span className="btn-tooltip">Retour</span>
                    <span className="btn-wave"></span>
                </button>
            </div>
        </main>

        {/* Animated Background Elements */}
        <div className="background-elements">
            <div className="bg-circle circle-1"></div>
            <div className="bg-circle circle-2"></div>
            <div className="bg-circle circle-3"></div>
        </div>
    </div>
);
};

export default GestionFacuDept;