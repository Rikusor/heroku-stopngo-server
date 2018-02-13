const refreshToken = require('../heroku-api/refresh-token');
const updateFormation = require('../heroku-api/update-formation');
const setStatus = require('./status-update');
const checkAppId = require('./check-app-id');

module.exports = (subscription) => new Promise((resolve, reject) => {
  const formation = JSON.parse(subscription.activeDynoFormation);
  let appId;
  let token;

  refreshToken(subscription)
    .then(tkn => token = tkn)
    .then(_ => checkAppId(subscription, token))
    .then(id => appId = id)
    .then(_ => setStatus(subscription.id, 'SCALING_UP'))
    .then(res => updateFormation(appId, token, formation))
    .then(_ => new Promise((resolve) => {
      setTimeout(resolve, 5000)
    }))
    .then(_ => setStatus(subscription.id, 'ACTIVE'))
    .then(_ => resolve('OK'))
    .catch(err => {
      console.error('SCALE_UP_SERVER_ERROR');
      console.error(subscription, err);
      reject(err);
      setStatus(subscription.id, 'INACTIVE')
        .then(_ => reject(err))
        .catch(err => reject(err))
    });
});
