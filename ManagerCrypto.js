const crypto = require('crypto');

const key = Buffer.from('a9c90c47c231afb31950169ccb89951337eb0689d31660e32c34835bb7018c0c', 'hex'); // 32-байтный ключ
const iv = Buffer.from('2a0f956a31cdeafe4e3633ebea07cc43', 'hex'); // 16-байтный IV

export function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString('hex');
}

export function decrypt(encrypted) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);
    return decrypted.toString();
}