const basicAuth = require('basic-auth');

const USERNAME = process.env.USER_NAME || 'localhost';
const PASSWORD = process.env.USER_PASSWORD || 'localhost';

module.exports = (req, res, next) => {
  const unauthorized = () => {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  const user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized();
  }

  if (user.name === USERNAME && user.pass === PASSWORD) {
    return next();
  }
  return unauthorized();
};
