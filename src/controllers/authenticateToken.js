import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: "Token d'authentification manquant" 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: "Token invalide ou expiré"
      });
    }
    
  /*  // Vérification supplémentaire pour les universités
    if (req.params.universityId && decoded.role === 'UNIVERSITY') {
      if (decoded.universityId !== parseInt(req.params.universityId)) {
        return res.status(403).json({
          success: false,
          error: "Accès non autorisé à cette université"
        });
      }
    }*/

    req.user = decoded;
    next();
  });
};