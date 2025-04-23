import express from 'express';
import cors from 'cors';
import apiRoutes from './src/routes/api.js';

const app = express();
const port = 5000;

app.use(cors({
  origin: ['http://localhost:3000'], // Autorisez votre frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use('/', apiRoutes);

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});