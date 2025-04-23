import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
// Clé de 32 bytes (256 bits) — à garder secrète (idéalement dans une variable d'environnement)
const secretKey = crypto.createHash('sha256').update('votre_super_clé_secrète').digest(); // Ne jamais exposer ça !

export function encrypt(data) {
  const iv = crypto.randomBytes(16); // vecteur d'initialisation
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  return {
    encryptedData: encrypted.toString('hex'),
    iv: iv.toString('hex')
  };
}

export function decrypt(encryptedData, iv) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData, 'hex')),
    decipher.final()
  ]);
  return decrypted.toString();
}

// Alternative: export as default object
export default { encrypt, decrypt };