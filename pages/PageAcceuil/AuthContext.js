// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState({
    role: '',
    formData: {
      username: "",
      password: "",
      universityId: null,
      name: "",
      prenom: "",
      phone: "",
      email: "",
      roleEcole: "",
    },
    universities: [],
    selectedUniversity: null,
    errors: { password: "" }
  });

  // Chargement des universités quand le rôle est UNIVERSITY
  useEffect(() => {
    if (authState.role === "UNIVERSITY") {
      axios.get("http://localhost:5000/universities-auth")
        .then(res => setAuthState(prev => ({
          ...prev,
          universities: res.data
        })))
        .catch(console.error);
    }
  }, [authState.role]);

  const handleUniversitySelect = (e) => {
    const uniId = parseInt(e.target.value);
    setAuthState(prev => ({
      ...prev,
      selectedUniversity: uniId,
      formData: { ...prev.formData, universityId: uniId }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthState(prev => ({
      ...prev,
      formData: { ...prev.formData, [name]: value },
      errors: name === "password" ? validatePassword(value) : prev.errors
    }));
  };

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*~_\-+=`|\\(){}[\]:;"'<>,.?/]).{8,12}$/;
    
    if (!value) return { password: "Le mot de passe est requis" };
    if (value.length > 12) return { password: "Maximum 12 caractères" };
    if (value.length < 8) return { password: "Minimum 8 caractères" };
    if (!passwordRegex.test(value)) return { password: "Doit contenir 1 chiffre, 1 majuscule, 1 minuscule et 1 caractère spécial" };
    
    return { password: "" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (authState.errors.password) {
      console.error("Validation error:", authState.errors.password);
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/register", {
        ...authState.formData,
        role: authState.role
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Registration successful:", response.data);
      router.push("/PageAcceuil/EmailVerification");
      
    } catch (err) {
      console.error("Registration error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      
      // Mettez à jour l'état avec le message d'erreur du serveur
      setAuthState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          server: err.response?.data?.message || "Erreur lors de l'inscription"
        }
      }));
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      setAuthState,
      handleUniversitySelect,
      handleChange,
      handleSubmit,
      setRole: (role) => setAuthState(prev => ({ ...prev, role }))
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};