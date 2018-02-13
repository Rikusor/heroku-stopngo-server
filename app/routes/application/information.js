const refreshToken = require('../../../heroku-api/refresh-token');
const getAddonInfo = require('../../../heroku-api/get-addon-info');
const Subscription = require('../../schemas/subscription');

module.exports = (req, res) => {
  Subscription.findOne({ id: req.params.id }, (err, subscription) => {
    if (err) {
      console.error('INFO_SERVER_ERROR:');
      console.error(req.params.id, err);
      res.sendStatus(500).json({ error: err.toString()});
      return;
    }
    refreshToken(subscription)
      .then(token => getAddonInfo(subscription.id, token))
      .then(response => {
        res.json({
          currentTimer: subscription.inactiveTimer,
          name: response.data.app.name
        });
      })
      .catch(err => res.sendStatus(500).json({error: true, errorMessage: 'FAILED_GETTING_INFORMATION'}))
  });
};
