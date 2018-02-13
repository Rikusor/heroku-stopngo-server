const routes = require('express').Router();
const subscription = require('./subscription');
const applicationStatus = require('./application/status');
const applicationInformation = require('./application/information');
const logs = require('./logs');

routes.use('/heroku/resources', subscription);
routes.post('/logs/:app', logs);
routes.get('/application/status/:id', applicationStatus);
routes.get('/application/information/:id', applicationInformation);

routes.get('/', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = routes;
