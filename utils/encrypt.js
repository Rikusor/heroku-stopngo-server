const crypto = require('crypto');
const algorithm = process.env.HASHING_ALGORITHM;
const password = process.env.HASHING_PASSWORD;

module.exports = (text) => {
  let cipher = crypto.createCipher(algorithm, password);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};
