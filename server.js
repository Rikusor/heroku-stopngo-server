const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./app/routes');
const auth = require('./app/auth');
const logfmt = require('logfmt');

const server = express();

const PORT = process.env.PORT || 4567;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/STOP_AND_GO';

mongoose.connect(MONGO_URI, { useMongoClient: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', (error) => {
  startErrorServer('Error connecting to Database, contact administrator.');
  console.error('Database error:');
  console.error(error);
});

db.once('open', () => {
  startServer();
});

const startErrorServer = (errorMessage) => {
  server.use('/', auth);

  server.use('*', (req, res) => {
    res.status(500).json({ error: errorMessage });
  });

  server.listen(PORT, () => {
    console.error(errorMessage);
  });
};

const startServer = () => {
  server.use('/', auth);

  server.use(bodyParser.json({ type: 'application/json' }));
  server.use(logfmt.bodyParserStream());

  server.use('/', routes);

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

const cron = require('cron');

const getInactiveApps = require('./heroku-actions/get-inactive-subscriptions');
const processInactiveApp = require('./heroku-actions/process-inactive-app');

const job = () => {
  new cron.CronJob('* * * * *', () => {
    getInactiveApps()
      .then(docs => {
        console.log('Found: ' + docs.length);
        docs.forEach(processInactiveApp);
      })
      .catch(err => console.error(err));
  }, null, true);
};

job();
