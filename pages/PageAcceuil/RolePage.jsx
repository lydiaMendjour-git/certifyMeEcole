import { useAuth } from './AuthContext';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUserGraduate, FaUniversity, FaSchool, FaShieldAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';


const RolePage = () => {
  const { setRole } = useAuth();
  const router = useRouter();

  const handleRoleSelection = (role) => {
    setRole(role);
    router.push(role === "UNIVERSITY" ? "/PageAcceuil/UniversityAuth" : "/PageAcceuil/FormPage");
  };

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
      padding: '0.5rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          margin: "auto",
          position: "relative",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          overflow: "hidden",
          width: "100%",
          maxWidth: "1000px"
        }}
      >
        {/* Header compact */}
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
                          zIndex: 999,
                          position: "absolute",
                          top: "1rem",
                          left: "1rem",
                          background: "rgba(255,255,255,0.2)",
                          padding: "0.5rem",
                          borderRadius: "8px",
                          cursor: "pointer"
                        }}
                        onClick={() => router.push('/')}
                      >
                        <FaArrowLeft color="white" />
                      </motion.div>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <FaShieldAlt color="white" size={18} />
            <span style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: 'white'
            }}>CertifyMe</span>
          </div>
          
          <h2 style={{
            color: "white",
            fontSize: "1.3rem",
            fontWeight: "600",
            margin: "0.3rem 0 0 0"
          }}>
            Sélectionnez votre profil
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: "0.85rem",
            marginTop: "0.5rem"
          }}>
            Quel type de compte souhaitez-vous créer ?
          </p>
        </div>
        
        {/* Cards compactes */}
        <div style={{
          padding: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.2rem"
        }}>
          {[
            {
              icon: <FaUserGraduate />,
              title: "Étudiant",
              description: "Obtenir et gérer mes diplômes et certifications",
              color: colors.primary,
              action: () => handleRoleSelection("STUDENT"),
            },
            {
              icon: <FaUniversity />,
              title: "Université",
              description: "Délivrer des diplômes infalsifiables",
              color: colors.accent,
              action: () => handleRoleSelection("UNIVERSITY"),
            },
            {
              icon: <FaSchool />,
              title: "École/Organisme",
              description: "Émettre des certifications professionnelles",
              color: colors.secondary,
              action: () => handleRoleSelection("ECOLE"),
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={item.action}
              style={{
                backgroundColor: "white",
                border: `1px solid ${item.color}20`,
                borderRadius: "12px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "center"
              }}
            >
              <div style={{
                width: "60px",
                height: "60px",
                backgroundColor: `${item.color}10`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                color: item.color,
                fontSize: "1.5rem"
              }}>
                {item.icon}
              </div>
              <h3 style={{
                color: colors.textDark,
                fontSize: "1.2rem",
                fontWeight: "600",
                marginBottom: "0.8rem"
              }}>
                {item.title}
              </h3>
              <p style={{
                color: colors.textLight,
                fontSize: "0.9rem",
                lineHeight: "1.5",
                marginBottom: "1.2rem",
                minHeight: "40px"
              }}>
                {item.description}
              </p>
              <motion.div
                whileHover={{ x: 3 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: item.color,
                  fontWeight: '600',
                  fontSize: '0.85rem'
                }}
              >
                Créer un compte
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Footer compact */}
        <div style={{
          padding: '1rem',
          textAlign: 'center',
          borderTop: `1px solid ${colors.lightBg}`,
          color: colors.textLight,
          fontSize: '0.8rem'
        }}>
          Vous avez déjà un compte ?{' '}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              router.push("/PageAcceuil/Login");
            }}
            style={{ 
              color: colors.primary, 
              fontWeight: '600',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            Connectez-vous
          </a>
        </div>
      </motion.div>
    </div>
  );
};
RolePage.getInitialProps = async () => ({});
export default RolePage;