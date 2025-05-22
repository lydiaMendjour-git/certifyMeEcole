import fs from 'fs';
import path from 'path';
import csv from 'fast-csv';
import { fileURLToPath } from 'url';
import { prisma } from '../prismaClient.js';
import Ecole from '../models/Ecole.js';
import Formation from '../models/Formation.js';
import { RoleEcole } from '../enums.js';

export default {
  async getEcoles(req, res) {
    try {
      const ecoles = await Ecole.getAll();
      res.json(ecoles);  // Réponse avec les écoles récupérées
    } catch (error) {
      res.status(500).json({ error: error.message });  // Gestion des erreurs
    }
  },
  
  async getAllEcolesWithAccount(req, res) {
    try {
      const ecoles = await Ecole.getEcolesWithAccount();
      res.status(200).json(ecoles);
    } catch (error) {
      console.error("Erreur dans le contrôleur :", error);
      res.status(500).json({ error: "Erreur lors de la récupération des écoles." });
    }
  },
  
  async getEcoleById(req, res) {
    const { ecoleId } = req.params;

    try {
      const ecole = await Ecole.findEcoleById(ecoleId);

      if (!ecole) {
        return res.status(404).json({ error: 'École non trouvée' });
      }

      res.status(200).json(ecole);
    } catch (error) {
      console.error('Erreur lors de la récupération de l’école :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },
async getEcolesByRole(req, res) {
  try {
    const { role } = req.params;
    
    console.log(`[API] Demande des écoles de type: ${role}`, {
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    // Validation stricte du rôle
    if (!Object.values(RoleEcole).includes(role)) {
      const errorMsg = `Rôle "${role}" non reconnu`;
      console.warn(`[VALIDATION] ${errorMsg}`, {
        rolesValides: Object.values(RoleEcole)
      });
      return res.status(400).json({ 
        error: errorMsg,
        roles_supportés: Object.values(RoleEcole),
        code: "ROLE_INVALIDE"
      });
    }

    // Récupération des données
    const ecoles = await Ecole.getEcolesByRole(role);

    // Normalisation des données
    const reponse = {
      meta: {
        count: ecoles.length,
        roleDemande: role,
        date: new Date().toISOString()
      },
      data: ecoles.map(ecole => ({
        ...ecole,
        account: ecole.account ? {
          ...ecole.account,
          // Masquer les champs sensibles si nécessaire
          email: ecole.account.isVerified ? ecole.account.email : undefined
        } : {
          id: null,
          status: 'COMPTE_ABSENT',
          lastSync: new Date().toISOString()
        }
      }))
    };

    console.log(`[SUCCES] Retour de ${ecoles.length} écoles de type ${role}`);
    
    return res.status(200).json(reponse);

  } catch (error) {
    const errorId = crypto.randomUUID();
    console.error(`[ERREUR ${errorId}]`, {
      message: error.message,
      stack: error.stack,
      params: req.params,
      url: req.originalUrl
    });
    
    return res.status(500).json({
      error: "Erreur lors de la récupération des écoles",
      reference: errorId,
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message,
        stack: error.stack.split("\n")[0] // Première ligne seulement
      })
    });
  }
}


};
