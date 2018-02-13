const getFormation = require('../heroku-api/get-formation');
const refreshToken = require('../heroku-api/refresh-token');
const updateFormation = require('../heroku-api/update-formation');
const setScalingDown = require('./scaledown-status');
const setStatus = require('./status-update');
const processFormationInfo = require('./process-formation');
const checkAppId = require('./check-app-id');

module.exports = (subscription) => new Promise((resolve, reject) => {
  let appId;
  let formation;
  let token;

  refreshToken(subscription)
    .then(tkn => token = tkn)
    .then(_ => checkAppId(subscription, token))
    .then(id => appId = id)
    .then(_ => getFormation(appId, token))
    .then(res => formation = processFormationInfo(res.data))
    .then(_ => setScalingDown(subscription, JSON.stringify(formation.old)))
    .then(_ => updateFormation(appId, token, formation.new))
    .then(_ => new Promise((resolve) => {
      setTimeout(resolve, 5000)
    }))
    .then(_ => setStatus(subscription.id, 'INACTIVE'))
    .then(() => resolve('OK'))
    .catch(err => {
      console.error('PROCESS_INACTIVE_SERVER_ERROR');
      console.error(subscription, err);
      reject(err);
    });
});
