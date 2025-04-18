// Importation des dépendances nécessaires
import { useState, useEffect } from "react"; // Hooks React pour gérer l'état et les effets
import axios from "axios"; // Bibliothèque pour faire des requêtes HTTP
import  Header  from './Header';
import { motion, AnimatePresence } from 'framer-motion';
import web3 from '../ethereum/web3';
import diplome from '../ethereum/diplome';

function App() {
  // Déclaration des états pour stocker les différentes données
  const [faculties, setFaculties] = useState([]); // Liste des facultés
  const [departments, setDepartments] = useState([]); // Liste des départements
  const [specialties, setSpecialties] = useState([]); // Liste des spécialités
  const [levels, setLevels] = useState([]); // Liste des niveaux
  const [sections, setSections] = useState([]); // Liste des sections
  const [students, setStudents] = useState([]); // Liste des étudiants filtrés
  const [allStudents, setAllStudents] = useState([]); // Liste complète de tous les étudiants
  const [etudiantsSelectionnes, setEtudiantsSelectionnes] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [titreDiplome, setTitreDiplome] = useState("");
  const [annees, setAnnees] = useState([]);
  const [searchError, setSearchError] = useState(null);
     


  // États pour la recherche par matricule
  const [searchMatricule, setSearchMatricule] = useState(""); // Valeur du champ de recherche
  const [searchMode, setSearchMode] = useState(false); // Mode de recherche activé/désactivé

  // État pour les filtres de recherche
  const [filters, setFilters] = useState({
    anneeId: "",//l'id de l'annee
    facultyId: "", // ID de la faculté sélectionnée
    departmentId: "", // ID du département sélectionné
    specialty: "", // Spécialité sélectionnée
    level: "", // Niveau sélectionné
    section: "", // Section sélectionnée
  });


  const handleCheckboxChange = (id) => {
    setEtudiantsSelectionnes((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleCreationDiplomes = () => {
    // Action de création pour les étudiants sélectionnés
    console.log("Création des diplômes pour :", etudiantsSelectionnes);
    setFormVisible(true); // Affiche le formulaire
  };



  const closeModal = () => {
    setFormVisible(false);
    setTitreDiplome("");
  };

  const handleSelectAll = () => {
    const allIds = students.map((student) => student.idEtudiant);
    setEtudiantsSelectionnes(allIds);
  };
  

//fin fonctions creation diplomes
/*---------------------*/

  // URL de base de l'API
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


  const confirmerCreationDiplomes = async () => {
    try {
      console.log("Les etudiants selectionnes avec verification: ", etudiantsSelectionnes);
  
      const response = await axios.post(`${API_BASE_URL}/verifier-etudiants`, etudiantsSelectionnes);
  
      if (response.data.success) {
        const anneeId = filters.anneeId;
        console.log("L'id de l'annee",anneeId);
        if (!anneeId) {
          alert("Veuillez sélectionner une année universitaire.");
          return;
        }
  
        const payload = {
          anneeId,
          titreDiplome,
          typeDiplome: "Universite",
          etudiants: etudiantsSelectionnes.map(id => ({ idEtudiant: id })),  // Transforme [1, 2, 8] en [{idEtudiant: 1}, {idEtudiant: 2}, ...]
        };
        
        console.log("Etudiants envoyés:", etudiantsSelectionnes);
        console.log("payload", payload);
        const creation = await axios.post(`${API_BASE_URL}/creer-diplomes`, payload);
  
        if (creation.data.success) {
          alert("🎓 Diplômes créés avec succès !");
        } else {
          alert("❌ Une erreur est survenue lors de la création.");
        }
  
      } else {
        alert("Une erreur inconnue est survenue.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const nonTrouves = error.response.data.etudiantsNonTrouves;
        alert("⚠️ Certains étudiants ne sont pas reconnus dans la base du ministère :\n" +
          nonTrouves.map(e => `${e.prenom} ${e.nom} - ${e.email} - ${e.matricule}`).join('\n'));
      } else {
        console.error("❌ Erreur lors de la vérification :", error);
        alert("Une erreur serveur est survenue. Veuillez réessayer plus tard.");
      }
    }
  };
  
    // Effet pour charger tous les étudiants au montage du composant
    useEffect(() => {
      const fetchStudents = async () => {
        if (!filters.anneeId) {
          setStudents([]);
          setAllStudents([]);
          return;
        }
    
        try {
          // Requête GET pour récupérer les étudiants de l'année sélectionnée
          const res = await axios.get(`${API_BASE_URL}/students-by-annee/${filters.anneeId}`);
          console.log("Étudiants de l'année:", res.data);
          
          setStudents(res.data || []);
          setAllStudents(res.data || []);
        } catch (error) {
          console.error("Erreur lors du chargement des étudiants:", error);
          setStudents([]);
          setAllStudents([]);
        }
      };
    
      fetchStudents();
    }, [filters.anneeId]);
    
    
  // Effet pour charger la liste des facultés
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/faculties`);
        console.log("Facultés récupérées :", response.data); // Log pour débogage
        setFaculties(response.data || []); // Met à jour la liste des facultés
      } catch (error) {
        console.error("Erreur lors du chargement des facultés :", error);
      }
    };

    fetchFaculties();
  }, []); // Exécuté une seule fois au montage
  
  useEffect(() => {
    if (filters.facultyId) {
      const fetchDepartments = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/departments/${filters.facultyId}`);
          console.log("✅ Départements récupérés :", response.data);
          setDepartments(response.data || []); // Mise à jour dynamique
        } catch (error) {
          console.error("❌ Erreur lors du chargement des départements :", error);
        }
      };
  
      fetchDepartments();
    } else {
      setDepartments([]); // Vide la liste si aucune faculté sélectionnée
    }
  }, [filters.facultyId]); // Exécuté lorsque `facultyId` change
  

  useEffect(() => {
    const fetchAnnees = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/annee`);
        console.log("Réponse des années:", response.data); // Debug
        
        // Validation des données
        if (Array.isArray(response.data)) {
          setAnnees(response.data);
        } else {
          console.error("Les données reçues ne sont pas un tableau:", response.data);
          setAnnees([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des années:", error);
        setAnnees([]); // Fallback en cas d'erreur
      }
    };
    
    fetchAnnees();
  }, []);
  
  // Effet pour charger les filtres dynamiquement en fonction des sélections
  useEffect(() => {
    const loadFilters = async () => {
      try {
        console.log("Fetching filters with:", filters); // Log les filtres actuels
  
        const requests = []; // Tableau pour stocker les requêtes
        // Ajoute les requêtes en fonction des filtres sélectionnés
        if (filters.facultyId) {
          requests.push(axios.get(`${API_BASE_URL}/departments/${filters.facultyId}`));
        }
        if (filters.departmentId) {
          requests.push(axios.get(`${API_BASE_URL}/specialties/${filters.departmentId}`));
        }
        if (filters.specialty) {
          requests.push(axios.get(`${API_BASE_URL}/levels/${filters.specialty}`));
        }
        if (filters.level) {
          requests.push(axios.get(`${API_BASE_URL}/sections/${filters.level}`));
        }
  
        // Exécute toutes les requêtes en parallèle
        const responses = await Promise.all(requests);
        console.log("API responses:", responses.map(res => res.data)); // Log les réponses
  
        // Met à jour les états en fonction des réponses
        setDepartments(filters.facultyId ? responses[0]?.data || [] : []);
        setSpecialties(filters.departmentId ? responses[1]?.data.map(s => ({ specialite: s.specialite })) || [] : []);
        setLevels(filters.specialty ? responses[2]?.data.map(l => ({ niveau: l.niveau })) || [] : []);
        setSections(filters.level ? responses[3]?.data.map(sec => ({ section: sec.section })) || [] : []);
    
      } catch (error) {
        console.error("Erreur de chargement des filtres :", error);
      }
    };
  
    loadFilters();
  }, [filters.facultyId, filters.departmentId, filters.specialty, filters.level]); // Déclenché quand ces filtres changent
  


  useEffect(() => {
    console.log("Filtres appliqués :", JSON.stringify(filters, null, 2));

    if (allStudents.length > 0) {
        console.log("Exemple d'étudiant :", JSON.stringify(allStudents[0], null, 2));
    } else {
        console.log("⚠️ Aucun étudiant dans allStudents !");
    }

    const filteredStudents = allStudents.filter(student => {
        // Vérifie si l'étudiant a au moins un cursus universitaire
        if (!student.CursusUniversitaire || student.CursusUniversitaire.length === 0) {
            return false;
        }

        // Trouve le cursus qui correspond à l'année sélectionnée (ou prend le premier si aucune année n'est sélectionnée)
        const cursus = filters.anneeId 
            ? student.CursusUniversitaire.find(c => c.idAnnee === Number(filters.anneeId))
            : student.CursusUniversitaire[0];

        if (!cursus) return false;

        return (
            (!filters.anneeId || cursus.idAnnee === Number(filters.anneeId)) &&
            (!filters.facultyId || cursus.idFaculty === Number(filters.facultyId)) &&
            (!filters.departmentId || cursus.idDepart === Number(filters.departmentId)) &&
            (!filters.specialty || cursus.specialite === filters.specialty) &&
            (!filters.level || cursus.niveau === Number(filters.level)) &&
            (!filters.section || cursus.section === filters.section)
        );
    });

    console.log("Étudiants filtrés après application des filtres :", filteredStudents);
    setStudents(filteredStudents);
}, [filters, allStudents]);


const handleSearch = async () => {
  if (!filters.anneeId) {
    setSearchError("Veuillez sélectionner une année universitaire");
    return;
  }

  try {
    setSearchError(null);
    const response = await axios.get(`${API_BASE_URL}/students/${searchMatricule}?anneeId=${filters.anneeId}`);
    
    if (response.data) {
      const result = Array.isArray(response.data) ? response.data : [response.data];
      setStudents(result);
      setSearchMode(true);
    } else {
      setStudents([]);
      setSearchError("Aucun étudiant trouvé avec ce matricule pour l'année sélectionnée");
    }
  } catch (err) {
    if (err.response?.status === 404) {
      setStudents([]);
      setSearchError("Aucun étudiant trouvé avec ce matricule pour l'année sélectionnée");
    } else {
      console.error("Erreur serveur :", err);
      setStudents([]);
      setSearchError("Une erreur est survenue lors de la recherche");
    }
  }
};
  
const handleBack = () => {
  if (searchMode) {
    // Si en mode recherche, retour à la liste complète
    setStudents(allStudents);
    setSearchMode(false);
    setSearchMatricule("");
    return;
  }

  // Détermine quel filtre est actif et agit en conséquence
  const activeFilters = {
    section: () => setFilters(prev => ({ ...prev, section: "" })),
    level: () => setFilters(prev => ({ ...prev, level: "", section: "" })),
    specialty: () => setFilters(prev => ({ ...prev, specialty: "", level: "", section: "" })),
    departmentId: () => setFilters(prev => ({ ...prev, departmentId: "", specialty: "", level: "", section: "" })),
    facultyId: () => setFilters(prev => ({ 
      ...prev,
      facultyId: "", 
      departmentId: "", 
      specialty: "", 
      level: "", 
      section: "" 
    })),
    anneeId: () => setFilters({
      anneeId: "",
      facultyId: "", 
      departmentId: "", 
      specialty: "", 
      level: "", 
      section: "" 
    })
  };

  // Trouve et exécute l'action correspondant au filtre actif le plus profond
  const filterOrder = ['section', 'level', 'specialty', 'departmentId', 'facultyId', 'anneeId'];
  for (const filter of filterOrder) {
    if (filters[filter]) {
      activeFilters[filter]();
      return;
    }
  }
};

const handleFilterChange = (filterName, value) => {
  console.log(`Changement de filtre - ${filterName} :`, value);
  
  setFilters(prev => {
      const newFilters = {
          ...prev,
          [filterName]: value
      };
      
      // Réinitialisation en cascade des filtres dépendants
      if (filterName === 'anneeId') {
          // Si l'année change, réinitialiser tous les autres filtres
          newFilters.facultyId = "";
          newFilters.departmentId = "";
          newFilters.specialty = "";
          newFilters.level = "";
          newFilters.section = "";
      } else if (filterName === 'facultyId') {
          newFilters.departmentId = "";
          newFilters.specialty = "";
          newFilters.level = "";
          newFilters.section = "";
      } else if (filterName === 'departmentId') {
          newFilters.specialty = "";
          newFilters.level = "";
          newFilters.section = "";
      } else if (filterName === 'specialty') {
          newFilters.level = "";
          newFilters.section = "";
      } else if (filterName === 'level') {
          newFilters.section = "";
      }
      
      return newFilters;
  });
};
const getCursusForSelectedYear = (student) => {
  // Si aucune année n'est sélectionnée, retourne null
  if (!filters.anneeId) return null;
  
  if (!student.CursusUniversitaire || student.CursusUniversitaire.length === 0) {
    return null;
  }
   return student.CursusUniversitaire.find(c => c.idAnnee === Number(filters.anneeId));
};

const hasActiveFilters = Object.values(filters).some(val => val !== "" && val !== null);
const shouldShowEmptyState = !filters.anneeId || students.length === 0;


  // Rendu du composant
return (
  <div className="App" style={{ 
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    height: "100vh", // Prend toute la hauteur de la fenêtre
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: "flex",
    flexDirection: "column"
  }}>
    <Header />
    <main style={{
    flex: 1,
    paddingTop: '60px' // Ajustez selon la hauteur de votre header
  }}>
    {/* En-tête avec ombre portée */}
    <div style={{
      backgroundColor: "white",
      padding: "2rem",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      flexShrink: 0 // Empêche le rétrécissement
    }}>
       <h1 style={{ 
    color: "#2c3e50",
    fontSize: "2.5rem",
    fontWeight: "700",
    margin: "0 0 0.75rem 0",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontFamily: "'Neue Haas Grotesk', 'Helvetica Now', 'Aeonik', -apple-system, sans-serif", // Polices premium
    textShadow: "0 2px 4px rgba(0,0,0,0.05)",
    letterSpacing: "-0.5px",
    lineHeight: "1.2"
}}>
    <motion.span
        style={{
            display: "inline-flex",
            background: "linear-gradient(135deg, #3498db,rgb(10, 104, 123))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            fontSize: "2.8rem"
        }}
        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ 
            type: "spring", 
            stiffness: 300,
            damping: 15,
            duration: 0.5
        }}
        whileHover={{ 
            scale: 1.15,
            rotate: [0, 5, -5, 0],
            transition: { duration: 0.5 }
        }}
        whileTap={{ scale: 0.9 }}
    >
        <span role="img" aria-label="diplôme">🎓</span>
    </motion.span>
    
    <motion.span
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
    >
        Création Diplôme
        <motion.span 
            style={{
                display: "block",
                height: "3px",
                background: "linear-gradient(90deg,rgb(82, 183, 209),rgb(48, 91, 165))",
                borderRadius: "2px",
                marginTop: "0.25rem"
            }}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.4, duration: 0.8, ease: "circOut" }}
        />
    </motion.span>
</h1>
      {/* Sous-titre */}
      <p style={{ 
        color: "#7f8c8d", // Couleur texte gris
        fontSize: "1rem", // Taille police
        marginBottom: "1.5rem" // Marge basse
      }}>
        Trouvez des étudiants par matricule ou en utilisant les filtres avancés
      </p>
   {/* Zone de recherche par matricule */}
<div style={{
  display: "flex",
  alignItems: "center",
  gap: "120px", // Espace entre éléments
  marginBottom: "24px",
  maxWidth: "600px"
}}>
  {/* Conteneur de la barre de recherche (inchangé) */}
  <div style={{
    position: "relative",
    flex: 1,
    minWidth: "300px",
    marginRight: "12px" // Espace entre barre et boutons
  }}>
    {/* Champ de saisie (inchangé) */}
    <input
      type="text"
      placeholder="Rechercher par matricule..."
      value={searchMatricule}
      onChange={(e) => setSearchMatricule(e.target.value)}
      style={{
        padding: "14px 20px 14px 48px",
        borderRadius: "10px",
        border: "1px solid #e0e3e7",
        width: "100%",
        fontSize: "15px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        outline: "none",
        backgroundColor: "#ffffff",
        color: "#2d3748"
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#5a67d8";
        e.target.style.boxShadow = "0 0 0 3px rgba(90, 103, 216, 0.12)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#e0e3e7";
        e.target.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
      }}
    />
    {/* Icône de recherche (inchangé) */}
    <div style={{
      position: "absolute",
      left: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#a0aec0"
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 21L16.65 16.65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>

  {/* Conteneur des boutons (nouveau) */}
  <div style={{
    display: "flex",
    gap: "8px", // Petit espace entre les boutons
    flexShrink: 0 // Empêche le rétrécissement
  }}>
    {/* Bouton de recherche */}
    <button 
      onClick={handleSearch}
      style={{ 
        padding: "14px 28px",
        backgroundColor: "#3498db",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "600",
        letterSpacing: "0.5px",
        boxShadow: "0 4px 14px rgba(90, 103, 216, 0.3)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        height: "48px",
        whiteSpace: "nowrap" // Empêche le retour à la ligne
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#2980b9";
        e.target.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "#3498db";
        e.target.style.transform = "translateY(0)";
      }}
      onMouseDown={(e) => {
        e.target.style.transform = "translateY(1px)";
      }}
      onMouseUp={(e) => {
        e.target.style.transform = "translateY(-1px)";
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      Rechercher
    </button>

    {/* Bouton Retour (conditionnel) */}
    {(searchMode || filters.facultyId) && (
      <button 
        onClick={handleBack}
        style={{ 
          padding: "14px 28px",
          backgroundColor: "#ffffff",
          color: "#3498db",
          border: "1px solid #e0e3e7",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "600",
          letterSpacing: "0.5px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          height: "48px",
          whiteSpace: "nowrap" // Empêche le retour à la ligne
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#f7fafc";
          e.target.style.transform = "translateY(-1px)";
          e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#ffffff";
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
        }}
        onMouseDown={(e) => {
          e.target.style.transform = "translateY(1px)";
        }}
        onMouseUp={(e) => {
          e.target.style.transform = "translateY(-1px)";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Retour
      </button>
    )}
  </div>
</div>

      {/* Section des filtres avancés (conditionnelle) */}
      {!searchMode && (
        <div style={{
          backgroundColor: "#f1f5f9", // Fond gris très clair
          borderRadius: "10px", // Coins arrondis
          padding: "1.5rem", // Espacement interne
          marginTop: "1rem" // Marge haute
        }}>
          {/* Titre des filtres */}
          <h2 style={{ 
            color: "#2c3e50",
            fontSize: "1.4rem",
            fontWeight: "500",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span style={{ color: "#3498db" }}>⚙️</span> Filtres avancés
          </h2>
          
          {/* Grille des filtres */}
          <div style={{ 
            display: "grid", // Disposition en grille
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", // Colonnes adaptatives
            gap: "1rem" // Espace entre éléments
          }}>
              {/* Filtre Année Universitaire - Premier élément */}
  <div>
    <label style={{
      display: "block",
      marginBottom: "0.5rem",
      color: "#34495e",
      fontSize: "0.9rem",
      fontWeight: "500"
    }}>Année Universitaire</label>
    
    <select
      value={filters.anneeId || ""}
      onChange={(e) => handleFilterChange("anneeId", e.target.value)}
      style={{ 
        padding: "0.7rem 1rem",
        borderRadius: "8px",
        border: "1px solid #dfe6e9",
        width: "100%",
        backgroundColor: "white",
        color: "#2c3e50",
        fontSize: "0.9rem",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
        outline: "none"
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#e8f4fc";
        e.target.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "#FFFFFF";
        e.target.style.transform = "translateY(0)";
      }}
      onMouseDown={(e) => {
        e.target.style.transform = "translateY(1px)";
      }}
      onMouseUp={(e) => {
        e.target.style.transform = "translateY(-1px)";
      }}
    >
      <option value="">Selectionnez une année</option>
      {annees.map((annee) => (
        <option key={annee.idAnnee} value={annee.idAnnee}>
          {annee.annee} {annee.isCurrent && "(Actuelle)"}
        </option>
      ))}
    </select>
  </div>


  {/* Filtre Faculté (conditionnel - apparaît après sélection d'une année) */}
  {filters.anneeId && (
    <div>
      <label style={{
        display: "block",
        marginBottom: "0.5rem",
        color: "#34495e",
        fontSize: "0.9rem",
        fontWeight: "500"
      }}>Faculté</label>
      
      <select
        value={filters.facultyId}
        onChange={(e) => handleFilterChange("facultyId", e.target.value)}
        style={{ 
          padding: "0.7rem 1rem",
          borderRadius: "8px",
          border: "1px solid #dfe6e9",
          width: "100%",
          backgroundColor: "white",
          color: "#2c3e50",
          fontSize: "0.9rem",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          transition: "all 0.2s ease",
          outline: "none"
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#e8f4fc";
          e.target.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#FFFFFF";
          e.target.style.transform = "translateY(0)";
        }}
        onMouseDown={(e) => {
          e.target.style.transform = "translateY(1px)";
        }}
        onMouseUp={(e) => {
          e.target.style.transform = "translateY(-1px)";
        }}
      >
        <option value="">Toutes les facultés</option>
        {faculties.map((f) => (
          <option key={f.idFaculty} value={f.idFaculty}>
            {f.nomFaculty}
          </option>
        ))}
      </select>
    </div>
  )}

  {/* Filtre Département (conditionnel) */}
  {filters.facultyId && (
    <div>
      <label style={{
        display: "block",
        marginBottom: "0.5rem",
        color: "#34495e",
        fontSize: "0.9rem",
        fontWeight: "500"
      }}>Département</label>
      <select
        value={filters.departmentId}
        onChange={(e) => handleFilterChange("departmentId", e.target.value)}
        style={{ 
          padding: "0.7rem 1rem",
          borderRadius: "8px",
          border: "1px solid #dfe6e9",
          width: "100%",
          backgroundColor: "white",
          color: "#2c3e50",
          fontSize: "0.9rem",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          transition: "all 0.2s ease",
          outline: "none"
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#e8f4fc";
          e.target.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#FFFFFF";
          e.target.style.transform = "translateY(0)";
        }}
        onMouseDown={(e) => {
          e.target.style.transform = "translateY(1px)";
        }}
        onMouseUp={(e) => {
          e.target.style.transform = "translateY(-1px)";
        }}
      >
        <option value="">Tous les départements</option>
        {departments.map((d) => (
          <option key={d.idDepart} value={d.idDepart}>
            {d.nomDepart}
          </option>
        ))}
      </select>
    </div>
  )}

  {/* Filtre Spécialité (conditionnel) */}
  {filters.departmentId && (
    <div>
      <label style={{
        display: "block",
        marginBottom: "0.5rem",
        color: "#34495e",
        fontSize: "0.9rem",
        fontWeight: "500"
      }}>Spécialité</label>
      <select
        value={filters.specialty}
        onChange={(e) => handleFilterChange("specialty", e.target.value)}
        style={{ 
          padding: "0.7rem 1rem",
          borderRadius: "8px",
          border: "1px solid #dfe6e9",
          width: "100%",
          backgroundColor: "white",
          color: "#2c3e50",
          fontSize: "0.9rem",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          transition: "all 0.2s ease",
          outline: "none"
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#e8f4fc";
          e.target.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#FFFFFF";
          e.target.style.transform = "translateY(0)";
        }}
        onMouseDown={(e) => {
          e.target.style.transform = "translateY(1px)";
        }}
        onMouseUp={(e) => {
          e.target.style.transform = "translateY(-1px)";
        }}
      >
        <option value="">Toutes les spécialités</option>
        {specialties.map((s) => (
          <option key={s.specialite} value={s.specialite}>
            {s.specialite}
          </option>
        ))}
      </select>
    </div>
  )}

  {/* Filtre Niveau (conditionnel) */}
  {filters.specialty && (
    <div>
      <label style={{
        display: "block",
        marginBottom: "0.5rem",
        color: "#34495e",
        fontSize: "0.9rem",
        fontWeight: "500"
      }}>Niveau</label>
      <select
        value={filters.level}
        onChange={(e) => handleFilterChange("level", e.target.value)}
        style={{ 
          padding: "0.7rem 1rem",
          borderRadius: "8px",
          border: "1px solid #dfe6e9",
          width: "100%",
          backgroundColor: "white",
          color: "#2c3e50",
          fontSize: "0.9rem",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          transition: "all 0.2s ease",
          outline: "none"
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#e8f4fc";
          e.target.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#FFFFFF";
          e.target.style.transform = "translateY(0)";
        }}
        onMouseDown={(e) => {
          e.target.style.transform = "translateY(1px)";
        }}
        onMouseUp={(e) => {
          e.target.style.transform = "translateY(-1px)";
        }}
      >
        <option value="">Tous les niveaux</option>
        {levels.map((lvl) => (
          <option key={lvl.niveau} value={lvl.niveau}>
            {lvl.niveau}
          </option>
        ))}
      </select>
    </div>
  )}

  {/* Filtre Section (conditionnel) */}
  {filters.level && (
    <div>
      <label style={{
        display: "block",
        marginBottom: "0.5rem",
        color: "#34495e",
        fontSize: "0.9rem",
        fontWeight: "500"
      }}>Section</label>
      <select
        value={filters.section}
        onChange={(e) => handleFilterChange("section", e.target.value)}
        style={{ 
          padding: "0.7rem 1rem",
          borderRadius: "8px",
          border: "1px solid #dfe6e9",
          width: "100%",
          backgroundColor: "white",
          color: "#2c3e50",
          fontSize: "0.9rem",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          transition: "all 0.2s ease",
          outline: "none"
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#e8f4fc";
          e.target.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#FFFFFF";
          e.target.style.transform = "translateY(0)";
        }}
        onMouseDown={(e) => {
          e.target.style.transform = "translateY(1px)";
        }}
        onMouseUp={(e) => {
          e.target.style.transform = "translateY(-1px)";
        }}
      >
        <option value="">Toutes les sections</option>
        {sections.map((sec) => (
          <option key={sec.section} value={sec.section}>
            {sec.section}
          </option>
        ))}
      </select>
    </div>
  )}
</div>
        </div>
      )}
    </div>




    {/* Section du tableau des étudiants */}
    <div style={{
        backgroundColor: "white", // Fond blanc
        borderRadius: "12px", // Coins arrondis
        padding: "1.5rem", // Espacement interne
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)", // Ombre portée
        minHeight: "calc(100% - 3rem)" // Hauteur minimale
      }}>
      {/* En-tête du tableau */}
      <div style={{
        display: "flex", // Disposition flex
        justifyContent: "space-between", // Espacement entre éléments
        alignItems: "center", // Centrage vertical
        marginBottom: "1.5rem" // Marge basse
      }}>
        {/* Titre */}
        <h2 style={{ 
          color: "#2c3e50",
          fontSize: "1.6rem",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <span style={{ color: "#3498db" }}> <motion.span
        style={{
            display: "inline-flex",
            background: "linear-gradient(135deg, #3498db,rgb(10, 104, 123))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            fontSize: "2rem"
        }}
        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ 
            type: "spring", 
            stiffness: 300,
            damping: 15,
            duration: 0.5
        }}
        whileHover={{ 
            scale: 1.15,
            rotate: [0, 5, -5, 0],
            transition: { duration: 0.5 }
        }}
        whileTap={{ scale: 0.9 }}
    >
        <span role="img" aria-label="diplôme">👨‍🎓</span>
    </motion.span></span> Étudiants
        </h2>

        

      {etudiantsSelectionnes.length > 0 && (
        <button onClick={handleCreationDiplomes}>
          Créer diplôme(s) pour {etudiantsSelectionnes.length} étudiant(s)
        </button>
      )}

    {formVisible && (
        <>
          {/* Arrière-plan flouté */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(2px)",
              zIndex: 1000,
            }}
            onClick={closeModal}
          ></div>

          {/* Contenu de la modale */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "10px",
              width: "400px",
              zIndex: 1001,
              boxShadow: "0 0 15px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Création de diplôme</h2>

            <label style={{ display: "block", marginBottom: "1rem" }}>
              Entrer le titre du diplôme pour les étudiants: {etudiantsSelectionnes}
            <select
              value={titreDiplome}
              onChange={(e) => setTitreDiplome(e.target.value)}
              style={{
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.5rem",
                  fontSize: "1rem",
              }}
            >
            <option value="">Sélectionnez un diplôme</option>
            <option value="DIPLOME DE DOCTORAT">DIPLOME DE DOCTORAT</option>
            <option value="DIPLOME DE MASTER">DIPLOME DE MASTER</option>
            <option value="DIPLOME DE LICENCE">DIPLOME DE LICENCE</option>
            <option value="DIPLOME D'INGENIEUR">DIPLOME D'INGENIEUR</option>
            </select>
            </label>

            <button
              onClick={confirmerCreationDiplomes}
              style={{
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                padding: "0.6rem 1.2rem",
                fontSize: "1rem",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Confirmer la création
            </button>

            <button
              onClick={closeModal}
              style={{
                marginLeft: "1rem",
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                padding: "0.6rem 1.2rem",
                fontSize: "1rem",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
          </div>
        </>
      )}
        
        {/* Compteur d'étudiants */}
        <div style={{
          color: "#7f8c8d",
          fontSize: "0.9rem"
        }}>
          {filters.anneeId? `${students.length} ${students.length !== 1 ? "étudiants"  : "étudiant"}` : "0 étudiant"
          }</div>

          
      </div>


  
  <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
    <button
      onClick={handleSelectAll}
      style={{
        padding: "0.5rem 1rem",
        backgroundColor: "#3498db",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      }}
    >
      Sélectionner tous les étudiants
    </button>

    <button
      onClick={() => setEtudiantsSelectionnes([])}
      style={{
        padding: "0.5rem 1rem",
        backgroundColor: "#e74c3c",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      }}
    >
      Tout désélectionner
    </button>
  </div>


      {/* Conteneur du tableau avec défilement horizontal */}
      <div style={{ overflowX: "auto" }}>
        
        <table style={{ 
         //tableLayout: "fixed"
          width: "100%", // Pleine largeur
          borderCollapse: "separate", // Séparation des bordures
          borderSpacing: "0", // Espacement des bordures
          borderRadius: "10px", // Coins arrondis
          overflow: "hidden" // Cache les débordements
        }}>



          
          {/* En-tête du tableau */}
<thead>
  <tr style={{ 
    backgroundColor: "#3498db", // Fond bleu
    color: "white" // Texte blanc
  }}>
    {/* Colonnes de l'en-tête */}
    <th style={{ 
      padding: "1rem",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.9rem"
    }}>Nom</th>
    <th style={{ 
      padding: "1rem",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.9rem"
    }}>Prénom</th>
    <th style={{ 
      padding: "1rem",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.9rem"
    }}>Email</th>
    <th style={{ 
      padding: "1rem",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.9rem"
    }}>Matricule</th>
    <th style={{ 
      padding: "1rem",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.9rem"
    }}>Filière</th>
    <th style={{ 
      padding: "1rem",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.9rem"
    }}>Spécialité</th>
    <th style={{ 
      padding: "1rem",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.9rem"
    }}>Niveau</th>
    <th style={{ 
      padding: "1rem",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.9rem"
    }}>Section</th>
    <th style={{ 
      padding: "1rem",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.9rem"
    }}>Groupe</th>
    <th style={{ 
      padding: "1rem",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.9rem"
    }}>Moyenne</th>


     <th style={{ 
      padding: "1rem",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.9rem"
    }}>Sélection</th>
  </tr>
</thead>

{/* Corps du tableau */}
<tbody>
{shouldShowEmptyState ? (
  <tr>
    <td 
      colSpan="11"
      style={{ 
        padding: "2rem",
        textAlign: "center",
        color: "#7f8c8d",
        fontSize: "0.95rem",
        height: "300px",
        verticalAlign: "middle"
      }}
    > 
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem"
      }}>
        <span style={{ fontSize: "2rem" }}>🔍</span>
        <div>
          {searchError || "Aucun étudiant trouvé"}
          {hasActiveFilters && !searchError && (
            <p style={{ 
              marginTop: "0.5rem",
              fontSize: "0.85rem",
              color: "#95a5a6"
            }}>
              {!filters.anneeId
                ? "Veuillez sélectionner une année universitaire"
                : "Essayez de modifier vos critères de recherche"}
            </p>
          )}
        </div>
      </div> 
    </td>
  </tr>
) : (

    // Si des étudiants sont trouvés, on les affiche
    students.map((student, index) => (
      <tr 
        key={student.matricule} // Clé unique
        style={{ 
          backgroundColor: index % 2 === 0 ? "white" : "#f8f9fa", // Alternance de couleurs
          transition: "background-color 0.2s ease" // Animation de transition
        }}
        // Effets au survol
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e8f4fc"}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "white" : "#f8f9fa"}
      >
        {/* Cellules des données étudiant */}
        <td style={{ 
          padding: "1rem",
          borderBottom: "1px solid #eceff1",
          color: "#2c3e50",
          fontSize: "0.9rem"
        }}>{student.nom}</td>
        <td style={{ 
          padding: "1rem",
          borderBottom: "1px solid #eceff1",
          color: "#2c3e50",
          fontSize: "0.9rem"
        }}>{student.prenom}</td>
        <td style={{ 
          padding: "1rem",
          borderBottom: "1px solid #eceff1",
          color: "#3498db",
          fontSize: "0.9rem",
          
        }}>{student.email}</td>
        <td style={{ 
          padding: "1rem",
          borderBottom: "1px solid #eceff1",
          color: "#2c3e50",
          fontSize: "0.9rem",
          fontWeight: "500"
        }}>{student.matricule}</td>
        <td style={{ 
          padding: "1rem",
          borderBottom: "1px solid #eceff1",
          color: "#2c3e50",
          fontSize: "0.9rem"
        }}>
          {getCursusForSelectedYear(student)?.filiere || "-"}
        </td>
        <td style={{ 
          padding: "1rem",
          borderBottom: "1px solid #eceff1",
          color: "#2c3e50",
          fontSize: "0.9rem"
        }}>
          {getCursusForSelectedYear(student)?.specialite || "-"}
        </td>
        <td style={{ 
          padding: "1rem",
          borderBottom: "1px solid #eceff1",
          color: "#2c3e50",
          fontSize: "0.9rem"
        }}>
          {getCursusForSelectedYear(student)?.niveau || "-"}
        </td>
        <td style={{ 
          padding: "1rem",
          borderBottom: "1px solid #eceff1",
          color: "#2c3e50",
          fontSize: "0.9rem"
        }}>
          {getCursusForSelectedYear(student)?.section || "-"}
        </td>
        <td style={{ 
          padding: "1rem",
          borderBottom: "1px solid #eceff1",
          color: "#2c3e50",
          fontSize: "0.9rem"
        }}>
          {getCursusForSelectedYear(student)?.groupe || "-"}
        </td>
        <td style={{ 
          padding: "1rem",
          borderBottom: "1px solid #eceff1",
          color: "#2c3e50",
          fontSize: "0.9rem",
          fontWeight: "500"
        }}>
            {getCursusForSelectedYear(student)?.moyenneAnnuelle ? (
            <span style={{
              backgroundColor: parseFloat(getCursusForSelectedYear(student).moyenneAnnuelle) >= 10 ? "#e3f9e5" : "#ffebee",
              color: parseFloat(getCursusForSelectedYear(student).moyenneAnnuelle) >= 10 ? "#28a745" : "#dc3545",
              padding: "0.3rem 0.6rem",
              borderRadius: "12px",
              fontSize: "0.8rem"
            }}>
              {getCursusForSelectedYear(student).moyenneAnnuelle}
            </span>
          ) : "-"}
        </td>
        
        
                <td style={{ padding: "1rem", paddingLeft: "2rem" }}>
        
                  <input
                    type="checkbox"
                    checked={etudiantsSelectionnes.includes(student.idEtudiant)}
                    onChange={() => handleCheckboxChange(student.idEtudiant)}
                  />
                </td>
               
        

      </tr>
    ))
  )}
</tbody>
        </table>
      </div>
    </div>
    </main>
    </div>
);}

export default App;