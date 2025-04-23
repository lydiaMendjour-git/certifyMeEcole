import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const EmailVerificationPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(30);

  const colors = {
    primary: '#4cc9f0',
    secondary: '#4895ef',
    accent: '#4361ee',
    lightBlue: '#3a0ca3',
    darkBlue: '#1d3557',
    lightBg: '#e0f2ff',
    textDark: '#14213d',
    textLight: '#5f6f94'
  };

  useEffect(() => {
    if (!router.isReady || !token) return;

    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/verify-email/${encodeURIComponent(token)}`, 
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
        
        if (response.data.verified) {
          setStatus('success');
          setMessage(response.data.message);
          
          // Compte à rebours de 30 secondes
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                router.push('/PageAcceuil/Login');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setStatus('invalid');
          setMessage('Le lien de vérification est invalide ou a déjà été utilisé');
        } else if (error.response?.status === 410) {
          setStatus('expired');
          setMessage('Ce lien a expiré. Veuillez générer un nouveau lien.');
        } else {
          setStatus('error');
          setMessage('Une erreur est survenue lors de la vérification');
        }
      }
    };

    verifyToken();
  }, [router.isReady, token]);

  const StatusCard = ({ icon, color, title, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-${color}-100 mb-4`}>
        {icon}
      </div>
      <h2 className={`text-2xl font-bold text-${color}-600 mb-2`}>{title}</h2>
      <div className="text-gray-600 mb-6">{children}</div>
    </motion.div>
  );

  return (
    <>
      <Head>
        <title>Vérification d'email - CertifyMe</title>
        <meta name="description" content="Vérification de votre adresse email" />
      </Head>

      <div style={{
        backgroundColor: 'white',
        minHeight: '100vh',
        padding: '1rem',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Floating icons (similaires à Login) */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: '20%',
            left: '15%',
            opacity: 0.05,
            zIndex: 0
          }}
        >
          <FaCheckCircle size={120} color={colors.darkBlue} />
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '20%',
            opacity: 0.05,
            zIndex: 0
          }}
        >
          <FaExclamationTriangle size={150} color={colors.accent} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "relative",
            backgroundColor: "white",
            borderRadius: "20px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
            overflow: "hidden",
            width: "100%",
            maxWidth: "500px",
            zIndex: 1,
            border: `1px solid ${colors.primary}20`
          }}
        >
          {/* Header avec le même style que Login */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            padding: "1.5rem 2rem",
            position: "relative",
            textAlign: "center"
          }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: "absolute",
                left: "1rem",
                top: "1rem",
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                cursor: "pointer"
              }}
              onClick={() => router.push('/')}
            >
              <FaArrowLeft size={14} />
            </motion.div>
            
            <h2 style={{
              color: "white",
              fontSize: "1.3rem",
              fontWeight: "600",
              margin: "0.3rem 0 0 0"
            }}>
              Vérification d'email
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "0.85rem",
              marginTop: "0.5rem"
            }}>
              Validation de votre compte CertifyMe
            </p>
          </div>
          
          {/* Contenu principal */}
          <div style={{
            padding: "2rem",
            position: 'relative'
          }}>
            {status === 'loading' && (
              <StatusCard
                icon={
                  <svg className="h-10 w-10 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                }
                color="blue"
                title="Vérification en cours"
              >
                <p>Nous vérifions votre lien de confirmation...</p>
              </StatusCard>
            )}

            {status === 'success' && (
              <>
                <div className="text-center">
  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
    <FaCheckCircle className="h-10 w-10 text-green-500" />
  </div>
  <h2 className="text-2xl font-bold text-green-600 mb-2">Vérification réussie</h2>
  <div className="text-gray-600 mb-6">
    <p>Votre compte a été activé avec succès.</p>
    <p className="mt-2 text-sm text-gray-500">
      Redirection dans {countdown} seconde{countdown !== 1 ? 's' : ''}...
    </p>
  </div>
</div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/PageAcceuil/Login')}
                  style={{
                    width: "100%",
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.75rem",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    marginTop: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem"
                  }}
                >
                  Aller à la connexion <FaArrowRight />
                </motion.button>
              </>
            )}

            {status === 'invalid' && (
              <StatusCard
                icon={<FaTimesCircle className="h-10 w-10 text-red-500" />}
                color="red"
                title="Lien invalide"
              >
                <p>Ce lien de vérification est incorrect ou a déjà été utilisé.</p>
              </StatusCard>
            )}

            {status === 'expired' && (
              <StatusCard
                icon={<FaExclamationTriangle className="h-10 w-10 text-yellow-500" />}
                color="yellow"
                title="Lien expiré"
              >
                <p>Ce lien a expiré (valable 24 heures maximum).</p>
              </StatusCard>
            )}

            {(status === 'invalid' || status === 'expired' || status === 'error') && (
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/PageAcceuil/RolePage')}
                  style={{
                    flex: 1,
                    background: colors.primary,
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.75rem",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  Nouvelle inscription
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.reload()}
                  style={{
                    flex: 1,
                    background: "white",
                    color: colors.textDark,
                    border: `1px solid ${colors.primary}`,
                    borderRadius: "10px",
                    padding: "0.75rem",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  Réessayer
                </motion.button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '1rem 2rem',
            textAlign: 'center',
            borderTop: `1px solid ${colors.lightBg}`,
            color: colors.textLight,
            fontSize: '0.8rem'
          }}>
            <p>Besoin d'aide ? <a 
              href="#" 
              style={{ 
                color: colors.primary, 
                fontWeight: '600',
                textDecoration: 'none'
              }}
              onClick={(e) => {
                e.preventDefault();
                // Ajoutez ici la logique pour contacter le support
              }}
            >
              Contactez notre support
            </a></p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default EmailVerificationPage;