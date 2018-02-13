const cron = require('cron');

const getInactiveApps = require('./heroku-actions/get-inactive-subscriptions');
const processInactiveApp = require('./heroku-actions/process-inactive-app');

const job = () => {
  new cron.CronJob('* * * * *', () => {
    console.log('Checking inactive applications...');
    getInactiveApps()
      .then(docs => docs.forEach(processInactiveApp))
      .catch(err => console.error(err));
  }, null, true);
};

job();
