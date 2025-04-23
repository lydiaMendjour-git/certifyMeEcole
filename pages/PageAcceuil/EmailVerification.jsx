
import { motion } from 'framer-motion';
import { FaEnvelope, FaCheckCircle, FaArrowLeft, FaShieldAlt, FaLock, FaChevronRight } from 'react-icons/fa';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import { BsPatchCheckFill } from 'react-icons/bs';
import { FaUniversity } from 'react-icons/fa';

import { useAuth } from './AuthContext';
import { useRouter } from 'next/router';


const EmailVerification = () => {
  const { authState } = useAuth(); // Accès au contexte
  const router = useRouter();
  
  // Récupération de l'email depuis le contexte plutôt que les props
  const email = authState?.formData?.email || '';
  const colors = {
    primary: '#2F855A',       // Vert validation – sérieux, rassurant
    secondary: '#2D3748',     // Gris charbon – autorité, modernité
    accent: '#38A169',        // Vert accent – pour boutons/CTA
    lightBg: '#F7FAFC',       // Fond clair neutre – pro et clean
    darkBg: '#1A202C',        // Fond sombre – header/footer élégant
    textDark: '#1C1C1C',      // Texte principal – bonne lisibilité
    textLight: '#718096',     // Texte secondaire – descriptions, placeholders
    border: '#CBD5E0',        // Bordures subtiles – pour structurer sans surcharger
    success: '#2F855A',       // Succès – même que primary pour cohérence
    error: '#C53030',         // Erreur – rouge sérieux
    warning: '#D69E2E'        // Avertissement – or doux, pas criard
  };
  

  return (
    <div style={{
      backgroundColor: colors.lightBg,
      minHeight: '100vh',
      padding: '1rem',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
       {/* Background elements */}
           
            
            {/* Floating diploma icon */}
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
                opacity: 0.1,
                zIndex: 0
              }}
            >
              <FaUniversity size={120} color={colors.darkBlue} />
            </motion.div>
            
            {/* Floating shield icon */}
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
                opacity: 0.1,
                zIndex: 0
              }}
            >
              <FaShieldAlt size={150} color={colors.accent} />
            </motion.div>
      
            
            
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.accent}15 50%, ${colors.lightBlue}10 100%)`,
          zIndex: 0
        }}
      />
      
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            x: [null, Math.random() * 100],
            y: [null, Math.random() * 100],
            rotate: [0, 360]
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: `rgba(72, 149, 239, ${Math.random() * 0.3 + 0.1})`,
            opacity: 0.6,
            zIndex: 0
          }}
        />
      ))}
      
      {/* Main card container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          backgroundColor: "white",
          borderRadius: "24px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
          overflow: "hidden",
           zIndex: 1,
          border: `1px solid ${colors.primary}20`,
          margin: '1rem'
        }}
      >
      {/* En-tête avec dégradé et texture de bruit subtile */}
<div style={{
  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
  padding: "1rem",
  position: "relative",
  textAlign: "center",
  overflow: 'hidden'
}}>
  {/* Texture de bruit */}
  <div style={{
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\' opacity=\'0.1\'/%3E%3C/svg%3E")',
    opacity: 0.3
  }} />
  
  {/* Logo */}
  <motion.div 
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 0.2 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.6rem',
      marginBottom: '0.8rem',
      position: 'relative',
      zIndex: 1
    }}
  >
    <motion.div
      whileHover={{ rotate: 15 }}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        display: 'grid',
        placeItems: 'center',
        boxShadow: `0 4px 12px ${colors.primary}60`
      }}
    >
      <FaLock color="white" size={16} />
    </motion.div>
    <motion.span 
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        fontSize: '1.3rem',
        fontWeight: '800',
        color: 'white',
        letterSpacing: '0.3px'
      }}
    >
      SecureAuth
    </motion.span>
  </motion.div>
  
  <motion.h2
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    style={{
      color: "white",
      fontSize: "1.3rem",
      fontWeight: "700",
      margin: "0.2rem 0 0 0",
      position: 'relative',
      zIndex: 1
    }}
  >
    Vérification requise
  </motion.h2>
  <motion.p
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    style={{
      color: "rgba(255,255,255,0.9)",
      fontSize: "0.85rem",
      marginTop: "0.6rem",
      position: 'relative',
      zIndex: 1,
      fontWeight: '500'
    }}
  >
    Protégez votre compte avec notre vérification en deux étapes
  </motion.p>
</div>

{/* Contenu principal */}
<div style={{
  padding: '1rem',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  justifyContent: 'center'
}}>
  {/* Partie gauche */}
  <div style={{ flex: 1, minWidth: '250px', maxWidth: '400px' }}>
    <motion.h3
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
      style={{
        color: colors.textDark,
        fontSize: '1.1rem',
        fontWeight: '700',
        marginBottom: '0.6rem'
      }}
    >
      Consultez votre email
    </motion.h3>

    <motion.p
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7 }}
      style={{
        color: colors.textLight,
        fontSize: '0.85rem',
        lineHeight: '1.5',
        marginBottom: '1rem'
      }}
    >
      Nous avons envoyé un lien de vérification sécurisé à {' '}
      <strong style={{
        color: colors.textDark,
        background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: '600'
      }}>
        {email}
      </strong>
    </motion.p>

    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
      style={{
        backgroundColor: `${colors.primary}08`,
        borderRadius: '12px',
        padding: '0.8rem',
        marginBottom: '1rem',
        borderLeft: `3px solid ${colors.primary}`
      }}
    >
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <div style={{ color: colors.primary, fontSize: '0.9rem' }}>
          <RiShieldKeyholeLine />
        </div>
        <div>
          <h4 style={{
            color: colors.textDark,
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '0.2rem'
          }}>
            Conseils de sécurité
          </h4>
          <ul style={{
            color: colors.textLight,
            fontSize: '0.8rem',
            paddingLeft: '1rem',
            margin: 0,
            lineHeight: '1.4'
          }}>
            <li>Vérifiez l'expéditeur</li>
            <li>Ne partagez pas ce lien</li>
            <li>Expire dans 24h</li>
          </ul>
        </div>
      </div>
    </motion.div>
  </div>

  {/* Partie droite */}
  <div style={{ flex: 1, minWidth: '200px', maxWidth: '280px' }}>
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6 }}
      style={{
        width: '80px',
        height: '80px',
        background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}15)`,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        margin: '0 auto 1rem',
        border: `2px dashed ${colors.primary}`,
        position: 'relative'
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2
        }}
      >
        <FaEnvelope size={30} color={colors.primary} />
      </motion.div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{
          position: 'absolute',
          bottom: '6px',
          right: '6px',
          background: colors.success,
          borderRadius: '50%',
          width: '18px',
          height: '18px',
          display: 'grid',
          placeItems: 'center'
        }}
      >
        <BsPatchCheckFill color="white" size={10} />
      </motion.div>
    </motion.div>

    {/* Boutons */}
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        maxWidth: '240px',
        margin: '0 auto'
      }}
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push('/')}
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '0.6rem',
          fontSize: '0.85rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.3rem'
        }}
      >
        <span>Retour</span>
        <FaArrowLeft size={12} />
      </motion.button>

      <motion.button
        whileHover={{ backgroundColor: `${colors.primary}08` }}
        whileTap={{ scale: 0.98 }}
        onClick={() => window.location.reload()}
        style={{
          background: 'transparent',
          color: colors.primary,
          border: `1px solid ${colors.primary}40`,
          borderRadius: '8px',
          padding: '0.6rem',
          fontSize: '0.85rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Renvoyer l'email
      </motion.button>
    </motion.div>
  </div>
</div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{
            padding: '1.2rem 2rem',
            textAlign: 'center',
            borderTop: `1px solid ${colors.lightBg}`,
            color: colors.textLight,
            fontSize: '0.85rem',
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <FaShieldAlt size={14} color={colors.primary} opacity={0.8} />
          <span>Besoin d'aide ?</span>
          <a 
            href="#" 
            style={{ 
              color: colors.primary, 
              fontWeight: '600',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            Contactez notre support
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};
EmailVerification.getInitialProps = async () => ({});
export default EmailVerification;