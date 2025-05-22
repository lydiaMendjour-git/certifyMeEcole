import bcrypt from 'bcrypt';
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
import ROLES from '../utils/roles.js';
import { sendVerificationEmail } from '../services/emailService.js';
import { encrypt, decrypt } from './encryptUtils.js';
import web3 from './web3.js';


const register = async (req, res) => {
  try {
    console.log("Requête reçue:", req.body);

    const { username, email, password, role, name, prenom, phone, roleEcole, universityId } = req.body;

    // Validation simple
    if (!username || !password) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    const upperRole = role.toUpperCase();
    if (!['UNIVERSITY', 'STUDENT', 'ECOLE'].includes(upperRole)) {
      return res.status(400).json({ error: "Rôle invalide" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    // Vérification si email déjà utilisé
    const existingAccount = await prisma.account.findFirst({
      where: {
        email: email,
        isVerified: true
      }
    });
    
    if (existingAccount) {
      return res.status(400).json({ error: "Cet email est déjà utilisé pour un compte existant" });
    }

    // Cas UNIVERSITY
    if (upperRole === ROLES.UNIVERSITY) {
      const university = await prisma.university_OFFICIAL.findUnique({
        where: { idUni: universityId }
      });

      if (!university) {
        return res.status(400).json({ error: "Université non reconnue" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      let encryptedData, iv, address;

      await prisma.$transaction(async (tx) => {
        const account = await tx.account.create({
          data: {
            username,
            email: university.emailUni,
            password: hashedPassword,
            role: upperRole,
            isVerified: false,
            verificationToken
          }
        });

        const wallet = web3.eth.accounts.create();
        address = wallet.address;
        const { encryptedData: enc, iv: encryptionIV } = encrypt(wallet.privateKey);
        encryptedData = enc;
        iv = encryptionIV;

        await tx.university.create({
          data: {
            account: { connect: { id: account.id } },
            nomUni: university.nomUni,
            adresseUni: university.adresseUni,
            telephoneUni: university.telephoneUni,
            emailUni: university.emailUni,
            walletAddress: address,
            walletPrivateKey: encryptedData,
            walletIV: iv,
          }
        });
      });

      await sendVerificationEmail(university.emailUni, verificationToken);
      return res.status(201).json({ message: "Un email de validation a été envoyé" });
    }

  // Cas ECOLE
// Cas ECOLE
if (upperRole === ROLES.ECOLE) {
  try {
    const { username, password, ecoleId, email, name, phone, roleEcole, adresseEcole } = req.body;

    // Validation des données
    if (!ecoleId || !email || !name || !adresseEcole) {
      return res.status(400).json({ 
        error: "Données manquantes",
        details: "ecoleId, email, name et adresseEcole sont requis" 
      });
    }

    // Vérification de l'école officielle
    const ecoleOfficielle = await prisma.ecole_OFFICIAL.findUnique({
      where: { idEcole: parseInt(ecoleId) }
    });

    if (!ecoleOfficielle) {
      return res.status(404).json({ 
        error: "École non reconnue",
        details: `Aucune école trouvée avec l'ID ${ecoleId}`
      });
    }

    // Vérification de l'email
    if (ecoleOfficielle.emailEcole.toLowerCase() !== email.toLowerCase()) {
      return res.status(400).json({ 
        error: "Email ne correspond pas à l'école",
        details: `Email fourni: ${email}, Email officiel: ${ecoleOfficielle.emailEcole}`
      });
    }

    // Transaction atomique
    const result = await prisma.$transaction(async (tx) => {
      // 1. Création du compte
      const nouveauCompte = await tx.account.create({
        data: {
          username,
          email: ecoleOfficielle.emailEcole,
          password: await bcrypt.hash(password, 10),
          role: upperRole,
          isVerified: false,
          verificationToken: uuidv4()
        }
      });

      // 2. Création de l'école - INCLUDING adresseEcole NOW
      await tx.ecole.create({
        data: {
          nomEcole: ecoleOfficielle.nomEcole,
          telephoneEcole: ecoleOfficielle.telephoneEcole,
          emailEcole: ecoleOfficielle.emailEcole,
          role: ecoleOfficielle.role,
          adresseEcole: adresseEcole, // Add this line
          accountId: nouveauCompte.id
        }
      });

      return nouveauCompte;
    });

    // Envoi email de vérification
    await sendVerificationEmail(result.email, result.verificationToken);

    return res.status(201).json({ 
      message: "Inscription réussie - Un email de validation a été envoyé",
      email: result.email 
    });

  } catch (error) {
    console.error("Erreur inscription école:", {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    return res.status(500).json({ 
      error: "Erreur technique",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
    // Cas STUDENT
    if (upperRole === ROLES.STUDENT) {
      await prisma.$transaction(async (tx) => {
        const account = await tx.account.create({
          data: {
            username,
            email,
            password: hashedPassword,
            role: upperRole,
            isVerified: false,
            verificationToken
          }
        });

        await tx.etudiant_account.create({
          data: {
            account: { connect: { id: account.id } },
            nom: name,
            prenom: prenom,
            telephone: phone,
            email: email,
          }
        });
      });

      await sendVerificationEmail(email, verificationToken);
      return res.status(201).json({ message: "Un email de validation a été envoyé" });
    }

  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({
      error: "Erreur lors de l'inscription",
      details: error.message
    });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  console.log('=== DÉBUT VÉRIFICATION ===');
  console.log('Token reçu:', token);

  try {
    // 1. Recherche du compte AVEC le token
    const account = await prisma.account.findFirst({
      where: { 
        verificationToken: token 
      },
      select: {
        id: true,
        email: true,
        isVerified: true,
        createdAt: true,
        verificationToken: true
      }
    });

    console.log('Compte trouvé:', account);

    if (!account) {
      console.log('Aucun compte trouvé avec ce token');
      return res.status(404).json({
        verified: false,
        error: "Token invalide"
      });
    }

    // 2. Vérification si déjà validé
    if (account.isVerified) {
      console.log('Compte déjà vérifié');
      return res.status(400).json({
        verified: false,
        error: "Ce compte est déjà vérifié"
      });
    }

    const expirationTime = new Date(account.createdAt.getTime() + 24 * 60 * 60 * 1000);

if (new Date() > expirationTime) {
  console.log('Token expiré');

  // Supprimer les données associées selon le rôle
  if (account.role === 'UNIVERSITY') {
    await prisma.university.delete({ where: { accountId: account.id } });
  } else if (account.role === 'ECOLE') {
    await prisma.ecole.delete({ where: { accountId: account.id } });
  } else if (account.role === 'STUDENT') {
    await prisma.etudiant_account.delete({ where: { accountId: account.id } });
  }

  // Supprimer le compte lui-même
  await prisma.account.delete({ where: { id: account.id } });

  return res.status(410).json({
    verified: false,
    error: "Lien expiré"
  });
}


    // 4. Mise à jour du compte
    await prisma.account.update({
      where: { id: account.id },
      data: {
        isVerified: true,
        verificationToken: null
      }
    });

    console.log('=== VÉRIFICATION RÉUSSIE ===');
    return res.status(200).json({
      verified: true,
      message: "Email vérifié avec succès"
    });

  } catch (error) {
    console.error('ERREUR:', error);
    return res.status(500).json({
      verified: false,
      error: "Erreur serveur"
    });
  }
};


export const getUniversitiesAUTH = async (req, res) => {
  try {
    console.log("🔥 Université API appelée !");
    const universities = await prisma.university_OFFICIAL.findMany();
    console.log("📦 Données récupérées :", universities);
    res.status(200).json(universities);
  } catch (error) {
    console.error("❌ Erreur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Contrôleur pour récupérer les écoles par rôle
export const getEcolesAUTH = async (req, res) => {
  try {
    const { role } = req.query;
    
    const whereClause = role 
      ? { role } 
      : {};
    
    const ecoles = await prisma.ecole_OFFICIAL.findMany({
      where: whereClause,
      orderBy: { nomEcole: 'asc' }
    });
    
    res.status(200).json(ecoles);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Tentative de connexion avec :", email);

    if (!email || !password) {
      console.log("Champs manquants :", { email, password });
      return res.status(400).json({ 
        success: false,
        error: "Email et mot de passe sont requis" 
      });
    }

    const account = await prisma.account.findUnique({
      where: { email },
      include: { 
        university: true,
        ecole: true,
        etudiant: true,
        ministere: true
      }
    });

    if (!account) {
      console.log("Aucun compte trouvé pour cet email :", email);
      return res.status(401).json({ 
        success: false,
        error: "Identifiants incorrects" 
      });
    }

    console.log("Compte trouvé :", account.email);
    console.log("Statut vérification email :", account.isVerified);

    if (!account.isVerified) {
      console.log("Email non vérifié pour :", account.email);
      return res.status(403).json({ 
        success: false,
        error: "Email non vérifié. Veuillez vérifier votre boîte mail."
      });
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);
    console.log("Résultat comparaison mot de passe :", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Mot de passe incorrect pour :", email);
      return res.status(401).json({ 
        success: false,
        error: "Identifiants incorrects" 
      });
    }

    console.log("Connexion réussie pour :", email);

    // Construction du payload du token
    const tokenPayload = {
      accountId: account.id,
      role: account.role.toUpperCase(), // Force le rôle en majuscules
      email: account.email,
      username: account.username,
      ...(account.role === 'UNIVERSITY' && account.university && { 
        universityId: account.university.idUni,
        universityName: account.university.nomUni,
        walletAddress: account.university.walletAddress
      }),
      ...(account.role.toUpperCase() === 'ECOLE' && account.ecole && { 
    ecoleId: account.ecole.idEcole,
    ecoleName: account.ecole.nomEcole,
    walletAddress: account.ecole.walletAddress ,// Ajoutez ceci si disponible
    roleEcole: account.ecole.role
  }),
      ...(account.role === 'STUDENT' && account.etudiant && { 
        studentId: account.etudiant.idEtudiant,
        studentEmail: account.etudiant.email,
        studentName: account.etudiant.nom,
        studentPrenom: account.etudiant.prenom
      }),
      ...(account.role === 'MINISTERE' && account.ministere && { 
  ministereId: account.ministere.id,
  ministereName: account.ministere.nomMinistere,
  ministereType: account.ministere.typeMinistere // Ajout de cette ligne
})
    };

    // Génération du token JWT
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d" // 24 heures
    });

    // Construction de la réponse
    const responseData = {
      success: true,
      token,
      message: "Connexion réussie",
      account: {
        id: account.id,
        email: account.email,
        username: account.username,
        role: account.role,
        isVerified: account.isVerified,
        ...(account.role === 'UNIVERSITY' && account.university && {
          university: {
            id: account.university.idUni,
            name: account.university.nomUni,
            walletAddress: account.university.walletAddress
          }
        }),
        ...(account.role === 'ECOLE' && account.ecole && {
          ecole: {
            id: account.ecole.idEcole,
            name: account.ecole.nomEcole
          }
        }),
        ...(account.role === 'STUDENT' && account.etudiant && {
          student: {
            id: account.etudiant.idEtudiant,
            email: account.etudiant.email,
            name: account.etudiant.nom,
            prenom: account.etudiant.prenom
          }
        }),
        ...(account.role === 'MINISTERE' && account.ministere && {
          ministere: {
            id: account.ministere.id,
            name: account.ministere.nomMinistere
          }
        })
      }
    };

    // Définir le cookie HTTP Only
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 jour
      sameSite: 'strict'
    });

    // Envoi de la réponse finale
    res.status(200).json(responseData);

  } catch (error) {
    console.error("Erreur lors de la connexion:", error);

    // Gestion des erreurs Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({ 
        success: false,
        error: "Erreur de base de données",
        code: error.code
      });
    }

    res.status(500).json({ 
      success: false,
      error: "Erreur serveur lors de la connexion",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export default {
  register,
  verifyEmail,
  getUniversitiesAUTH,
  login,
  getEcolesAUTH 
};