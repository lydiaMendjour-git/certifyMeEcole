import { motion } from 'framer-motion';
import { FaShieldAlt, FaGraduationCap, FaSearch, FaLock, FaGlobe, FaChartLine, FaUniversity, FaUserTie } from 'react-icons/fa';
import { useRouter } from 'next/router';
const HomePage = ({ }) => {
  const router = useRouter();
  /*  const colors = {
        primary: '#4cc9f0',       // 💧 Bleu clair vibrant (ancien lightBlue)
        secondary: '#4895ef',     // 💙 Bleu moyen éclatant
        accent: '#4361ee',        // 🔵 Bleu intense (ancien primary)
        lightBlue: '#3a0ca3',     // 🔷 Bleu/violet profond (ancien secondary)
        darkBlue: '#1d3557',      // 🌌 Bleu nuit foncé
        lightBg: '#e0f2ff',       // ☁️ Bleu très pâle (presque blanc bleuté)
        textDark: '#14213d',      // 🖋 Bleu-noir foncé (très lisible)
        textLight: '#5f6f94'      // 🪶 Bleu-gris clair pour du texte secondaire
      };*/

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
        overflowX: 'hidden' ,
      backgroundColor: colors.lightBg,
    
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Barre de navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '95%',
          padding: '1.5rem 2.5%',
          background: 'white',
          boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}
        >
          <div style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            width: '45px',
            height: '45px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${colors.primary}40`
          }}>
            <FaGraduationCap color="white" size={20} />
          </div>
          <span style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>CertifyMe</span>
        </motion.div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {['Accueil', 'Fonctionnalités', 'Solutions', 'Ressources', 'Contact'].map((item, index) => (
            <motion.a
              key={index}
              whileHover={{ 
                y: -2,
                color: colors.primary
              }}
              style={{
                color: colors.textDark,
                fontWeight: '600',
                textDecoration: 'none',
                fontSize: '1rem',
                position: 'relative',
                padding: '0.5rem 0'
              }}
            >
              {item}
              {index === 0 && (
                <motion.span
                  layoutId="navIndicator"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${colors.accent}, ${colors.primary})`,
                    borderRadius: '3px'
                  }}
                />
              )}
            </motion.a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 5px 15px ${colors.primary}40`
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/PageAcceuil/Login')}
            style={{
              backgroundColor: 'transparent',
              color: colors.primary,
              border: `2px solid ${colors.primary}`,
              borderRadius: '10px',
              padding: '0.8rem 1.8rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Connexion
          </motion.button>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 5px 20px ${colors.accent}40`
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/PageAcceuil/RolePage")}
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '0.8rem 1.8rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: `0 4px 15px ${colors.primary}40`
            }}
          >
           s'inscrire
          </motion.button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <div style={{
        width: '100%',
        padding: '6rem 5%',
        background: `linear-gradient(135deg, white 0%, ${colors.lightBg} 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '5rem'
        }}>
          <div style={{ flex: 1, zIndex: 2 }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                lineHeight: '1.2',
                marginBottom: '2rem',
                color: colors.textDark
              }}
            >
              <span style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}>Certification numérique</span><br />
              infalsifiable par blockchain
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                fontSize: '1.2rem',
                color: colors.textLight,
                marginBottom: '3rem',
                lineHeight: '1.8'
              }}
            >
              CertifyMe protège l'intégrité des diplômes avec une technologie blockchain innovante,
              offrant une vérification instantanée et une sécurité inégalée pour les institutions
              académiques et les employeurs.
            </motion.p>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
              <motion.button
                whileHover={{ 
                  y: -3,
                  boxShadow: `0 10px 25px ${colors.primary}60`
                }}
                whileTap={{ y: 1 }}
               onClick={() => router.push('/PageAcceuil/RolePage')}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1.2rem 2.5rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: `0 6px 20px ${colors.primary}40`
                }}
              >
                Démarrer maintenant
              </motion.button>

              <motion.button
                whileHover={{ 
                  y: -3,
                  backgroundColor: '#f0f2f5'
                }}
                whileTap={{ y: 1 }}
                style={{
                  backgroundColor: 'white',
                  color: colors.primary,
                  border: `2px solid ${colors.primary}`,
                  borderRadius: '12px',
                  padding: '1.2rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaGraduationCap />
                  Voir comment ça marche
                </div>
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                color: colors.textLight
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginRight: '1rem'
              }}>
                {[1, 2, 3].map((item) => (
                  <div key={item} style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: `2px solid white`,
                    backgroundColor: '#f8f9fa',
                    marginLeft: item > 1 ? '-15px' : 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: item,
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item+20}.jpg`} 
                      alt="User" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: colors.textDark }}>Rejoint par 250+ institutions</div>
                <div style={{ fontSize: '0.9rem' }}>Universités et entreprises de confiance</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{
              flex: 1,
              position: 'relative',
              zIndex: 1
            }}
          >
            <div style={{
              width: '100%',
              height: '500px',
              borderRadius: '20px',
              background: `linear-gradient(145deg, ${colors.lightBlue}20, ${colors.primary}20)`,
              border: `1px solid ${colors.primary}20`,
              backdropFilter: 'blur(5px)',
              padding: '2rem',
              boxShadow: `0 25px 50px -12px ${colors.primary}20`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: `radial-gradient(${colors.accent}20, transparent 70%)`
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-100px',
                left: '-100px',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: `radial-gradient(${colors.primary}20, transparent 70%)`
              }} />

              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                borderRadius: '15px',
                boxShadow: `0 10px 30px ${colors.primary}10`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                padding: '0.7rem',
                position: 'relative',
                zIndex: 2
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 10px 20px ${colors.accent}40`
                }}>
                  <FaShieldAlt color="white" size={30} />
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: colors.textDark,
                  textAlign: 'center'
                }}>Certificat vérifié</h3>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  backgroundColor: `${colors.primary}10`,
                  borderRadius: '20px',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: colors.primary
                  }} />
                  <span style={{ 
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: colors.primary
                  }}>Statut: Authentique</span>
                </div>
                <div style={{
                  width: '100%',
                  display: 'flex',
                  gap: '1rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.8rem',
                      color: colors.textLight,
                      marginBottom: '0.3rem'
                    }}>Nom</div>
                    <div style={{
                      height: '30px',
                      backgroundColor: `${colors.primary}05`,
                      borderRadius: '8px',
                      borderLeft: `3px solid ${colors.primary}`
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.8rem',
                      color: colors.textLight,
                      marginBottom: '0.3rem'
                    }}>Diplôme</div>
                    <div style={{
                      height: '30px',
                      backgroundColor: `${colors.primary}05`,
                      borderRadius: '8px',
                      borderLeft: `3px solid ${colors.primary}`
                    }} />
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  marginTop: '1rem'
                }}>
                  <div style={{
                    fontSize: '0.8rem',
                    color: colors.textLight,
                    marginBottom: '0.3rem'
                  }}>Institution</div>
                  <div style={{
                    height: '30px',
                    backgroundColor: `${colors.primary}05`,
                    borderRadius: '8px',
                    borderLeft: `3px solid ${colors.primary}`,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 1rem',
                    gap: '0.5rem'
                  }}>
                    <FaUniversity color={colors.primary} size={14} />
                    <span style={{ fontSize: '0.9rem' }}>Université des Sciences et de la Technologie Houari Boumédiène</span>
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  marginTop: '1rem'
                }}>
                  <div style={{
                    fontSize: '0.8rem',
                    color: colors.textLight,
                    marginBottom: '0.3rem'
                  }}>Émis le</div>
                  <div style={{
                    height: '30px',
                    backgroundColor: `${colors.primary}05`,
                    borderRadius: '8px',
                    borderLeft: `3px solid ${colors.primary}`,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 1rem'
                  }}>
                    <span style={{ fontSize: '0.9rem' }}>15 juin 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section Partenaires */}
      <div style={{
        width: '100%',
        padding: '3rem 5%',
        backgroundColor: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              color: colors.textLight,
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '2rem',
              letterSpacing: '1px'
            }}
          >
            FIABILISÉ PAR LES LEADERS DU SECTEUR
          </motion.p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '3rem',
            opacity: 0.7
          }}>
            {['Université des Sciences et de la Technologie Houari Boumédiène'].map((partner, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: colors.textDark,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaUniversity color={colors.primary} /> {partner}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Fonctionnalités */}
      <div style={{
        width: '100%',
        padding: '6rem clamp(1rem, 1%, 3rem)',
        background: `linear-gradient(145deg, ${colors.lightBg} 0%, white 100%)`,
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          display: 'flex',
flexDirection: 'column',
justifyContent: 'center',
textAlign: 'center'

        }}>
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(${colors.accent}10, transparent 70%)`,
            zIndex: 0
          }} />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              position: 'relative',
              zIndex: 1,
              marginBottom: '5rem',
              textAlign: 'center'
            }}
          >
            <div style={{
              display: 'inline-block',
              background: `${colors.accent}15`,
              color: colors.accent,
              padding: '0.5rem 1.2rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '1.5rem'
            }}>
              TECHNOLOGIE INNOVANTE
            </div>
            <h2 style={{
              fontSize: '2.8rem',
              fontWeight: '800',
              color: colors.textDark,
              marginBottom: '1.5rem',
              lineHeight: '1.3'
            }}>
              Une solution <span style={{ color: colors.primary }}>complète</span> pour<br />
              la gestion des certifications
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: colors.textLight,
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.8'
            }}>
              CertifyMe combine facilité d'utilisation et sécurité maximale grâce à une architecture blockchain dédiée.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            position: 'relative',
            zIndex: 1
          }}>
            {[
              {
                icon: <FaShieldAlt size={28} color={colors.primary} />,
                title: 'Sécurité blockchain',
                description: 'Chaque certificat est enregistré de manière immuable sur la blockchain, garantissant son authenticité à vie.',
                color: colors.primary
              },
              {
                icon: <FaSearch size={28} color={colors.accent} />,
                title: 'Vérification instantanée',
                description: 'Vérifiez en quelques secondes la validité d\'un diplôme avec notre système de scan QR code intelligent.',
                color: colors.accent
              },
              {
                icon: <FaLock size={28} color={colors.secondary} />,
                title: 'Protection des données',
                description: 'Cryptage de niveau militaire pour protéger les informations sensibles des étudiants et des institutions.',
                color: colors.secondary
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                  border: `1px solid ${feature.color}10`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: `${feature.color}05`,
                  transform: 'translate(30%, -30%)'
                }} />
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '15px',
                  background: `${feature.color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2rem'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: colors.textDark,
                  marginBottom: '1rem'
                }}>{feature.title}</h3>
                <p style={{
                  color: colors.textLight,
                  fontSize: '1rem',
                  lineHeight: '1.8'
                }}>{feature.description}</p>
                <motion.div
                  whileHover={{ x: 5 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '2rem',
                    color: feature.color,
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  En savoir plus
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke={feature.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Solutions */}
      <div style={{
        width: '100%',
        padding: '6rem 0.5% ',
        display: 'flex',                 // Ajout
        alignItems: 'center',           // Ajout
        justifyContent: 'center',       // Ajout
        minHeight: '100vh'  ,
        backgroundColor: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '5rem',
          
        }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              flex: 1,
              position: 'relative',
              minWidth: '300px'
            }}
          >
            <div style={{
              width: '100%',
              height: '500px',
              borderRadius: '20px',
              background: `linear-gradient(145deg, ${colors.lightBlue}20, ${colors.primary}20)`,
              border: `1px solid ${colors.primary}20`,
              padding: '1.5rem',
              boxShadow: `0 25px 50px -12px ${colors.primary}10`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1.5rem'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 10px 20px ${colors.accent}30`
              }}>
                <FaUserTie color="white" size={30} />
              </div>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: colors.textDark
              }}>Solution pour les entreprises</h3>
              <p style={{
                color: colors.textLight,
                fontSize: '1.1rem',
                lineHeight: '1.8',
                marginBottom: '1.5rem'
              }}>
                Simplifiez vos processus de recrutement avec une vérification instantanée des diplômes et réduisez les risques de fraude.
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.8rem',
                marginBottom: '2rem'
              }}>
                {['Vérification en temps réel', 'Intégration RH', 'API sécurisée', 'Tableau de bord'].map((item, index) => (
                  <div key={index} style={{
                    backgroundColor: `${colors.primary}10`,
                    color: colors.primary,
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    {item}
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ 
                  y: -3,
                  boxShadow: `0 10px 25px ${colors.primary}40`
                }}
                whileTap={{ y: 1 }}
                style={{
                  alignSelf: 'flex-start',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Pour les entreprises
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              flex: 1,
              position: 'relative'
            }}
          >
            <div style={{
              width: '100%',
              height: '500px',
              borderRadius: '20px',
              background: `linear-gradient(145deg, ${colors.accent}10, ${colors.primary}10)`,
              border: `1px solid ${colors.accent}20`,
              padding: '1.5rem',
              boxShadow: `0 25px 50px -12px ${colors.accent}10`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1.5rem'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.accent}, #f72585)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 10px 20px ${colors.accent}30`
              }}>
                <FaUniversity color="white" size={30} />
              </div>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: colors.textDark
              }}>Solution pour les institutions</h3>
              <p style={{
                color: colors.textLight,
                fontSize: '1.1rem',
                lineHeight: '1.8',
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}>
                Protégez la réputation de votre institution et offrez à vos étudiants des diplômes sécurisés et facilement vérifiables.
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.8rem',
                marginBottom: '2rem'
              }}>
                {['Émission sécurisée', 'Gestion centralisée', 'Historique complet', 'Analytiques'].map((item, index) => (
                  <div key={index} style={{
                    backgroundColor: `${colors.accent}10`,
                    color: colors.accent,
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    {item}
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ 
                  y: -3,
                  boxShadow: `0 10px 25px ${colors.accent}40`
                }}
                whileTap={{ y: 1 }}
                style={{
                  alignSelf: 'flex-start',
                  background: `linear-gradient(135deg, ${colors.accent}, #f72585)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Pour les institutions
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section CTA */}
      <div style={{
        width: '100%',
        padding: '8rem 5%',
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(${colors.accent}20, transparent 70%)`,
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(${colors.primary}20, transparent 70%)`,
          zIndex: 0
        }} />
        
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: '3rem',
              fontWeight: '800',
              marginBottom: '2rem',
              lineHeight: '1.3'
            }}
          >
            Prêt à éliminer la fraude aux diplômes ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: '1.3rem',
              marginBottom: '3rem',
              lineHeight: '1.8',
              opacity: 0.9
            }}
          >
            Rejoignez la révolution de la certification numérique et protégez la valeur de vos diplômes avec une technologie infalsifiable.
          </motion.p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem'
          }}>
            <motion.button
              whileHover={{ 
                y: -3,
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}
              whileTap={{ y: 1 }}
              onClick={() =>  router.push('/PageAcceuil/RolePage')}
              style={{
                backgroundColor: 'white',
                color: colors.primary,
                border: 'none',
                borderRadius: '12px',
                padding: '1.2rem 2.5rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
              }}
            >
              Essai gratuit
            </motion.button>
            <motion.button
              whileHover={{ 
                y: -3,
                backgroundColor: 'rgba(255,255,255,0.2)'
              }}
              whileTap={{ y: 1 }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '12px',
                padding: '1.2rem 2rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                backdropFilter: 'blur(5px)'
              }}
            >
              Contactez-nous
            </motion.button>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div style={{
        width: '100%',
        padding: '5rem 5% 2rem',
        backgroundColor: colors.darkBlue,
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaGraduationCap color="white" size={18} />
              </div>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>CertifyMe</span>
            </div>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              lineHeight: '1.8',
              fontSize: '0.95rem'
            }}>
              La solution ultime pour la certification et la vérification de diplômes sécurisés par blockchain.
            </p>
          </div>

          {[
            {
              title: 'Produit',
              links: ['Fonctionnalités', 'Solutions', 'Tarifs', 'API']
            },
            {
              title: 'Ressources',
              links: ['Documentation', 'Blog', 'FAQ', 'Centre d\'aide']
            },
            {
              title: 'Entreprise',
              links: ['À propos', 'Carrières', 'Partenaires', 'Contact']
            },
            {
              title: 'Légal',
              links: ['Confidentialité', 'Conditions', 'Mentions légales', 'RGPD']
            }
          ].map((column, index) => (
            <div key={index}>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: 'white'
              }}>{column.title}</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {column.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                  >
                    <a href="#" style={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease'
                    }}>
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '3rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.9rem'
          }}>
      © 2025 CertifyMe. Tous droits réservés.
          </div>
          <div style={{
            display: 'flex',
            gap: '1.5rem'
          }}>
            {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map((social, index) => (
              <motion.a
                key={index}
                whileHover={{ y: -3 }}
                href="#"
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                {social}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;