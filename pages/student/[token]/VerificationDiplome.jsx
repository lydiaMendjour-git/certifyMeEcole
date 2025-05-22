import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaSpinner, FaCopy } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/router';

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

const VerificationDiplome = () => {
  const router = useRouter();
  const [verificationUrl, setVerificationUrl] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerifyDiploma = async () => {
    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      // Détecter le type de lien (université ou école)
      const isEcoleLink = verificationUrl.includes('/verifier-diplome-ecole/');
      const endpoint = isEcoleLink 
        ? 'http://localhost:5000/verifier-diplome-ecole/' 
        : 'http://localhost:5000/verifier-diplome/';
      
      const hash = verificationUrl.split(isEcoleLink ? '/verifier-diplome-ecole/' : '/verifier-diplome/')
                       .pop().split('/')[0].split('?')[0];
      
      if (!hash) {
        throw new Error("Le format de l'URL est invalide");
      }

      const response = await axios.get(`${endpoint}${hash}`);
      
      setVerificationResult({
        success: true,
        data: response.data,
        isEcole: isEcoleLink
      });
    } catch (err) {
      console.error('Erreur vérification:', err);
      setError(err.response?.data?.message || "Le diplôme n'a pas été trouvé ou le lien est invalide");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyExample = () => {
    navigator.clipboard.writeText('https://certifyme.com/verifier-diplome/eb5e065768f5cc...');
    alert('Exemple copié dans le presse-papiers');
  };

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
        <FaShieldAlt /> Vérification de diplôme
      </h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          color: colors.textDark,
          fontWeight: '500'
        }}>
          Coller le lien de vérification
        </label>
        <input
          type="text"
          value={verificationUrl}
          onChange={(e) => setVerificationUrl(e.target.value)}
          placeholder="https://certifyme.com/verifier-diplome/abc123..."
          style={{
            width: '100%',
            padding: '0.8rem',
            border: `1px solid ${colors.border}`,
            borderRadius: '6px'
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: colors.textLight }}>
            Exemple: https://certifyme.com/verifier-diplome/eb5e065768f5cc...
          </p>
          <button 
            onClick={handleCopyExample}
            style={{
              background: 'none',
              border: 'none',
              color: colors.primary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FaCopy size={14} />
          </button>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleVerifyDiploma}
        disabled={loading || !verificationUrl}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: loading || !verificationUrl ? colors.border : colors.primary,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading || !verificationUrl ? 'not-allowed' : 'pointer',
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
            <FaSpinner className="spin" /> Vérification en cours...
          </>
        ) : (
          'Vérifier le diplôme'
        )}
      </motion.button>

      {error && (
        <div style={{
          color: colors.error,
          margin: '1.5rem 0',
          padding: '1rem',
          backgroundColor: `${colors.error}10`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FaTimesCircle /> {error}
        </div>
      )}

      {verificationResult?.success && (
        <div style={{
          marginTop: '2rem',
          padding: '2rem',
          backgroundColor: colors.lightBg,
          borderRadius: '12px',
          border: `1px solid ${colors.primary}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            color: colors.primary
          }}>
            <FaCheckCircle size={24} />
            <h3 style={{ margin: 0 }}>Diplôme {verificationResult.isEcole ? "d'école" : ''} vérifié avec succès</h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <div>
              <p style={{ color: colors.textLight, marginBottom: '0.5rem' }}>Titre</p>
              <p style={{ fontWeight: '500' }}>{verificationResult.data.diplomaTitle}</p>
            </div>
            <div>
              <p style={{ color: colors.textLight, marginBottom: '0.5rem' }}>Étudiant</p>
              <p style={{ fontWeight: '500' }}>{verificationResult.data.studentName}</p>
            </div>
            <div>
              <p style={{ color: colors.textLight, marginBottom: '0.5rem' }}>Établissement</p>
              <p style={{ fontWeight: '500' }}>{verificationResult.data.etablissement}</p>
            </div>
            <div>
              <p style={{ color: colors.textLight, marginBottom: '0.5rem' }}>Date d'obtention</p>
              <p style={{ fontWeight: '500' }}>
                {new Date(verificationResult.data.dateOfIssue).toLocaleDateString()}
              </p>
            </div>
            {verificationResult.data.speciality && (
              <div>
                <p style={{ color: colors.textLight, marginBottom: '0.5rem' }}>Spécialité</p>
                <p style={{ fontWeight: '500' }}>{verificationResult.data.speciality}</p>
              </div>
            )}
            {verificationResult.isEcole && verificationResult.data.mention && (
              <div>
                <p style={{ color: colors.textLight, marginBottom: '0.5rem' }}>Mention</p>
                <p style={{ fontWeight: '500' }}>{verificationResult.data.mention}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationDiplome;