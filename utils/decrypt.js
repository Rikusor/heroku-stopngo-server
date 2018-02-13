const crypto = require('crypto');
const algorithm = process.env.HASHING_ALGORITHM;
const password = process.env.HASHING_PASSWORD;

module.exports = (text) => {
  let decipher = crypto.createDecipher(algorithm, password);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};
