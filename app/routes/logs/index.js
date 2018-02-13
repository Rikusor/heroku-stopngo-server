const through = require('through');
const logThrottling = require('expire-array')(1000 * 60);
const Subscription = require('../../schemas/subscription');
const activateApp = require('../../../heroku-actions/activate-application');
const encrypt = require('../../../utils/encrypt');

module.exports = (req, res) => {
  const app = req.params.app;

  if (logThrottling.all().indexOf(app) > -1) return res.json({ status: 'OK' });

  if(!req.body) return res.sendStatus(500).json({ error: 'LOG_PARSING_ERROR' });
  let saved = false;

  req.body.pipe(through(() => {
    if (saved) return;

    const currentDate = new Date();

    Subscription.findOneAndUpdate({
      id: app,
      drainToken: encrypt(req.get('Logplex-Drain-Token')),
      status: {
        $in: ['ACTIVE', 'INACTIVE']
      }
    }, { lastLogActivity: currentDate, status: 'ACTIVE' }, (err, doc) => {
      if (err) {
        console.error('LOGS_ERR_SERVER_ERROR:');
        console.error(err);
      } else if (typeof doc === 'undefined' || doc === null) {
        console.log('Error retrieving the document, most likely due update in progress. To be investigated')
      } else {
        logThrottling.push(app);
        saved = true;

        if (typeof doc !== 'undefined' && doc.status === 'INACTIVE') {
          activateApp(doc)
            .catch(err => {
              console.error('LOGS_DOCUNDEF_SERVER_ERROR:');
              console.error(err)
            });
        }
      }
    });
  }));

  res.json({ status: 'OK' });
};
