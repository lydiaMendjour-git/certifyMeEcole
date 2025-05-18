import fs from 'fs';
import path from 'path';
import csv from 'fast-csv';
import { fileURLToPath } from 'url';
import { prisma } from '../prismaClient.js';
import Ecole from '../models/Ecole.js';
import Formation from '../models/Formation.js';

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
  const { role } = req.query;

  try {
    const ecoles = await Ecole.getEcolesByRole(role);
    res.status(200).json(ecoles);
  } catch (error) {
    console.error("Erreur dans le contrôleur :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des écoles." });
  }
}


};
