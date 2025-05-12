import bcrypt from 'bcrypt';
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;

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
    if (upperRole === ROLES.ECOLE) {
      const ecole = await prisma.ecole_OFFICIAL.findFirst({ 
        where: { 
          emailEcole: email,  
          nomEcole: name      
        }
      });
    
      if (!ecole) {
        return res.status(400).json({ error: "L'école n'est pas reconnue" });
      }
    
      if (ecole.emailEcole !== email) {
        return res.status(400).json({ error: "Les informations ne correspondent pas à l'école officielle" });
      }    

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

        await tx.ecole.create({
          data: {
            account: { connect: { id: account.id } },
            nomEcole: name,
            telephoneEcole: phone,
            emailEcole: email,
            role: roleEcole
          }
        });
      });

      await sendVerificationEmail(email, verificationToken);
      return res.status(201).json({ message: "Un email de validation a été envoyé" });
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des champs
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Email et mot de passe sont requis" 
      });
    }

    // Recherche du compte avec les relations possibles
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
      return res.status(401).json({ 
        success: false,
        error: "Identifiants incorrects" // Message générique pour la sécurité
      });
    }

    // Vérification de l'email
    if (!account.isVerified) {
      return res.status(403).json({ 
        success: false,
        error: "Email non vérifié. Veuillez vérifier votre boîte mail.",
        //resendLink: `/auth/resend-verification/${account.id}`
      });
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: "Identifiants incorrects" // Message générique pour la sécurité
      });
    }

    // Construction du payload du token
    
    const tokenPayload = {
      accountId: account.id,
      role: account.role,
      email: account.email,
      username: account.username,
      // Infos spécifiques à l'université
      ...(account.role === 'UNIVERSITY' && account.university && { 
        universityId: account.university.idUni,
        universityName: account.university.nomUni,
        walletAddress: account.university.walletAddress
      }),
      // Infos spécifiques à l'école
      ...(account.role === 'ECOLE' && account.ecole && { 
        ecoleId: account.ecole.idEcole,
        ecoleName: account.ecole.nomEcole
      }),
      // Infos spécifiques à l'étudiant
      ...(account.role === 'STUDENT' && account.etudiant && { 
        studentId: account.etudiant.idEtudiant,
        studentEmail : account.etudiant.email,
        studentName : account.etudiant.nom,
        studentPrenom : account.etudiant.prenom

      }),
      // Infos spécifiques à l'étudiant
      ...(account.role === 'MINISTERE' && account.ministere && { 
        ministereId: account.ministere.id,
        ministereName : account.ministere.nomMinistere
      })
    };

    // Génération du token JWT
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Expire dans 24 heures
    );

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
        // Inclure les infos spécifiques au rôle
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
            email : account.etudiant.email,
           name : account.etudiant.nom,
          prenom : account.etudiant.prenom
          }
        }),
        ...(account.role === 'MINISTERE' && account.ministere && {
          student: {
            id: account.ministere.id,
            name : account.ministere.nomMinistere
          }
        })
      }
    };

    // Définir le cookie HTTP Only si nécessaire
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 jour
      sameSite: 'strict'
    });

    // Envoyer la réponse
    res.status(200).json(responseData);
    
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    
    // Gestion des erreurs spécifiques
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
  login
};