import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendVerificationEmail = async (email, verificationToken) => {
  // Modifiez le lien pour pointer vers la bonne route API
  const verificationLink = `http://localhost:3000/verify-email/${verificationToken}`;
  
  const mailOptions = {
    from: `"Équipe CertifyMe" <neilabehidj7@gmail.com>`,
    to: email,
    subject: '🎯 Votre clé d\'accès CertifyMe - Validez votre compte',
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Validation de votre compte CertifyMe</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          /* Base stylisée */
          body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.8;
            color: #2d3748;
            background-color:rgb(126, 182, 228);
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background: linear-gradient(135deg, #4361ee,rgb(72, 184, 201));
            padding: 30px 0;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .logo {
            height: 60px;
            margin-bottom: 15px;
          }
          .card {
            background: white;
            padding: 40px;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          }
          h1 {
            color: #1e293b;
            font-size: 26px;
            font-weight: 700;
            margin-top: 0;
          }
          .divider {
            height: 4px;
            background: linear-gradient(90deg, #4361ee, #4cc9f0);
            margin: 25px 0;
            border-radius: 2px;
          }
          .button {
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(135deg, #4361ee,rgb(72, 184, 201));
            color: white !important;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            margin: 30px 0;
            text-align: center;
            box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
            transition: all 0.3s ease;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(67, 97, 238, 0.4);
          }
          .link-box {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 6px;
            word-break: break-all;
            margin: 25px 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 13px;
            color: #64748b;
            text-align: center;
          }
          .signature {
            margin-top: 30px;
            font-style: italic;
            color: #475569;
          }
          .security-note {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 12px;
            margin: 25px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- En-tête premium -->
          <div class="header">
             <h1 style="color: white; margin-bottom: 0; font-size: 22px;">Validation de votre compte</h1>
          </div>
          
          <!-- Carte de contenu -->
          <div class="card">
            <p>Bonjour,</p>
            
            <p>Nous sommes ravis de vous accueillir sur <strong>CertifyMe</strong>, la plateforme de certification numérique leader du marché.</p>
            
            <div class="divider"></div>
            
            <p>Pour <span style="font-weight: 600; color: #4361ee;">activer votre compte</span> et accéder à toutes les fonctionnalités, veuillez confirmer votre adresse email :</p>
            
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">Confirmer mon email</a>
            </div>
            
            <div class="security-note">
              🔒 <strong>Sécurité importante :</strong> Ce lien est valable 24 heures. Ne partagez jamais ce lien avec qui que ce soit.
            </div>
            
            <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
            
            <div class="link-box">
              ${verificationLink}
            </div>
            
            <div class="divider"></div>
            
            <p>Après vérification, vous pourrez :</p>
            <ul style="padding-left: 20px;">
              <li>Accéder à votre espace personnel sécurisé</li>
              <li>Gérer vos certifications numériques</li>
              <li>Bénéficier de nos services premium</li>
            </ul>
            
            <div class="signature">
              <p>Cordialement,<br>
              <strong>L'équipe CertifyMe</strong></p>
              </div>
          </div>
          
          <!-- Pied de page élégant -->
          <div class="footer">
            <p>© ${new Date().getFullYear()} CertifyMe. Tous droits réservés.</p>
            <p>
              <a href="https://certifyme.com/help" style="color: #4361ee; text-decoration: none;">Centre d'aide</a> | 
              <a href="https://certifyme.com/contact" style="color: #4361ee; text-decoration: none;">Support technique</a> | 
              <a href="https://certifyme.com/privacy" style="color: #4361ee; text-decoration: none;">Confidentialité</a>
            </p>
            <p style="font-size: 12px; margin-top: 15px;">
              Cet email a été envoyé à ${email}. Si vous n'êtes pas à l'origine de cette demande, <a href="https://certifyme.com/report" style="color: #4361ee;">veuillez nous prévenir</a>.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Alternative: export as default object
export default { sendVerificationEmail };