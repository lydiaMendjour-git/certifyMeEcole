import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUniversity, FaSchool, FaGraduationCap, FaSpinner, FaCheckCircle} from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaShieldAlt } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';
import {FaHistory, FaCopy } from 'react-icons/fa';

const colors = {
  primary: '#2F855A',
  secondary: '#2D3748',
  accent: '#38A169',
  lightBg: '#F7FAFC',
  textDark: '#1C1C1C',
  textLight: '#718096',
  border: '#CBD5E0',
  error: '#C53030'
};

const DemandeDiplome = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Choix type, 2: Choix établissement, 3: Formulaire
  const [diplomaType, setDiplomaType] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [ecoles, setEcoles] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    birthDate: '',
    diplomaTitle: '',
    diplomaType: '',
    dateOfIssue: '',
    speciality: '',
    etablissement: ''
  });

  // Récupérer les établissements avec compte
  useEffect(() => {
    if (step === 2) {
      const fetchInstitutions = async () => {
        try {
          if (diplomaType === 'Universite') {
            const response = await axios.get('http://localhost:5000/universites-with-account');
            setUniversities(response.data);
          } else if (diplomaType === 'Ecole') {
            const response = await axios.get('http://localhost:5000/ecoles-with-account');
            setEcoles(response.data);
          }
        } catch (err) {
          console.error('Erreur lors de la récupération des établissements:', err);
          setError('Impossible de charger les établissements');
        }
      };
      fetchInstitutions();
    }
  }, [step, diplomaType]);
const handleTypeSelection = (type) => {
    setDiplomaType(type);
    setFormData(prev => ({
      ...prev,
      diplomaType: type
    }));
    setStep(2);
  };

  const handleInstitutionSelect = (institution) => {
    setSelectedInstitution(institution);
    setFormData(prev => ({
      ...prev,
      etablissement: institution.nomUni || institution.nomEcole
    }));
    setStep(3);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const formatDateForBackend = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const formattedData = {
            ...formData,
            birthDate: formatDateForBackend(formData.birthDate),
            dateOfIssue: formatDateForBackend(formData.dateOfIssue)
        };

        const endpoint = diplomaType === 'Universite' 
            ? 'http://localhost:5000/demande-diplome' 
            : 'http://localhost:5000/demande-diplome-ecole';

        const response = await axios.post(endpoint, formattedData);
        
        if (response.data.success) {
            setSuccess({
                message: response.data.message,
                verificationMessage: response.data.verificationMessage,
                verificationLink: response.data.verificationLink,
                verificationRemarque: response.data.verificationRemarque,
                diplomaInfo: response.data.diplomaInfo
            });
        } else {
            setSuccess({
                message: response.data.message || 'Votre demande a été enregistrée',
                suggestion: response.data.suggestion
            });
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
        setLoading(false);
    }
  };
  if (success) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#E6FFFA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <FaCheckCircle size={36} color={colors.primary} />
        </div>
        
        <h3 style={{ color: colors.primary, marginBottom: '1rem' }}>Diplôme trouvé !</h3>
        <p style={{ color: colors.textDark, marginBottom: '1.5rem' }}>Diplôme trouvé dans notre système!</p>
  
        <div style={{
          backgroundColor: colors.lightBg,
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          <p style={{ marginBottom: '1rem' }}>
            Pour vérifier la validité de votre diplôme à tout moment, voici votre lien permanent:
          </p>
          
          <div style={{
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '4px',
            border: `1px solid ${colors.border}`,
            wordBreak: 'break-all',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <a 
              href={success.verificationLink} 
              style={{
                color: colors.primary,
                textDecoration: 'underline'
              }}
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(success.verificationLink);
                alert('Lien copié dans le presse-papiers ! Vous pouvez maintenant le coller dans la section "Vérifier un diplôme"');
              }}
            >
              {success.verificationLink}
            </a>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button
  onClick={() => {
    navigator.clipboard.writeText(success.verificationLink);
    alert('Lien copié dans le presse-papiers !');
  }}
  style={{
    padding: '0.5rem 1rem',
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }}
>
  <FaCopy size={14} /> Copier le lien
</button>
  
          
          </div>
  
          <p style={{
            color: colors.error,
            fontSize: '0.9rem',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1rem'
          }}>
            <FaInfoCircle />
            Ce lien doit être utilisé exclusivement via notre plateforme CertifyMe
          </p>
        </div>
  
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          borderTop: `1px solid ${colors.border}`,
          textAlign: 'left'
        }}>
          <h4 style={{ color: colors.textDark, marginBottom: '0.5rem' }}>
            Détails du diplôme
          </h4>
          <p><strong>Titre :</strong> {success.diplomaInfo.title}</p>
          <p><strong>Établissement :</strong> {success.diplomaInfo.establishment}</p>
          <p><strong>Date d'obtention :</strong> {new Date(success.diplomaInfo.date).toLocaleDateString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <h2 style={{
        color: colors.primary,
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <FaGraduationCap /> Demande de diplôme
      </h2>

      {/* Étape 1: Choix du type de diplôme */}
      {step === 1 && (
        <div>
          <h3 style={{ color: colors.textDark, marginBottom: '1.5rem' }}>Type de diplôme</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTypeSelection('Universite')}
              style={{
                padding: '2rem 1rem',
                backgroundColor: colors.lightBg,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: `${colors.primary}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaUniversity size={24} color={colors.primary} />
              </div>
              <span style={{ fontWeight: '600', color: colors.textDark }}>Université</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTypeSelection('Ecole')}
              style={{
                padding: '2rem 1rem',
                backgroundColor: colors.lightBg,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: `${colors.accent}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaSchool size={24} color={colors.accent} />
              </div>
              <span style={{ fontWeight: '600', color: colors.textDark }}>École</span>
            </motion.button>
          </div>
        </div>
      )}

      {/* Étape 2: Choix de l'établissement */}
      {step === 2 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => setStep(1)}
              style={{
                background: 'none',
                border: 'none',
                color: colors.primary,
                cursor: 'pointer'
              }}
            >
              &larr;
            </button>
            <h3 style={{ color: colors.textDark }}>
              {diplomaType === 'Universite' 
                ? 'Sélectionnez votre université' 
                : 'Sélectionnez votre école'}
            </h3>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <FaSpinner className="spin" size={24} color={colors.primary} />
            </div>
          ) : error ? (
            <div style={{ color: colors.error, textAlign: 'center', padding: '1rem' }}>
              {error}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {(diplomaType === 'Universite' ? universities : ecoles).map(institution => (
                <motion.div
                  key={institution.idUni || institution.idEcole}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInstitutionSelect(institution)}
                  style={{
                    padding: '1.5rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: colors.lightBg,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: `${diplomaType === 'Universite' ? colors.primary : colors.accent}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {diplomaType === 'Universite' 
                        ? <FaUniversity size={18} color={colors.primary} /> 
                        : <FaSchool size={18} color={colors.accent} />}
                    </div>
                    <h4 style={{ margin: 0, color: colors.textDark }}>
                      {institution.nomUni || institution.nomEcole}
                    </h4>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    color: colors.textLight,
                    fontSize: '0.9rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {institution.adresseUni || institution.adresseEcole || 'Aucune adresse disponible'}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Étape 3: Formulaire de demande */}
      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => setStep(2)}
              style={{
                background: 'none',
                border: 'none',
                color: colors.primary,
                cursor: 'pointer'
              }}
            >
              &larr;
            </button>
            <h3 style={{ color: colors.textDark }}>Informations du diplôme</h3>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: colors.textDark,
              fontWeight: '500'
            }}>
              Établissement
            </label>
            <input
              type="text"
              name="etablissement"
              value={formData.etablissement}
              readOnly
              style={{
                width: '100%',
                padding: '0.8rem',
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                backgroundColor: colors.lightBg,
                color: colors.textLight
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: colors.textDark,
              fontWeight: '500'
            }}>
              Nom complet de l'étudiant
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.8rem',
                border: `1px solid ${colors.border}`,
                borderRadius: '6px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: colors.textDark,
              fontWeight: '500'
            }}>
              Date de naissance
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.8rem',
                border: `1px solid ${colors.border}`,
                borderRadius: '6px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: colors.textDark,
              fontWeight: '500'
            }}>
              Titre du diplôme
            </label>
            <input
              type="text"
              name="diplomaTitle"
              value={formData.diplomaTitle}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.8rem',
                border: `1px solid ${colors.border}`,
                borderRadius: '6px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: colors.textDark,
              fontWeight: '500'
            }}>
              Spécialité
            </label>
            <input
              type="text"
              name="speciality"
              value={formData.speciality}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.8rem',
                border: `1px solid ${colors.border}`,
                borderRadius: '6px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: colors.textDark,
              fontWeight: '500'
            }}>
              Date d'obtention
            </label>
            <input
              type="date"
              name="dateOfIssue"
              value={formData.dateOfIssue}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.8rem',
                border: `1px solid ${colors.border}`,
                borderRadius: '6px'
              }}
            />
          </div>

          {error && (
            <div style={{
              color: colors.error,
              margin: '1rem 0',
              padding: '0.8rem',
              backgroundColor: `${colors.error}10`,
              borderRadius: '6px'
            }}>
              {error}
            </div>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? (
              <>
                <FaSpinner className="spin" /> Envoi en cours...
              </>
            ) : (
              'Soumettre la demande'
            )}
          </motion.button>
        </form>
      )}
    </div>
  );
};

export default DemandeDiplome;