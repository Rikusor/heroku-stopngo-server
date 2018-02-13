const getAddonInfo = require('../heroku-api/get-addon-info');
const Subscriptions = require('../app/schemas/subscription');
const decrypt = require('../utils/decrypt');
const encrypt = require('../utils/encrypt');

module.exports = (subscription, token) => new Promise((resolve, reject) => {
  if (typeof subscription.heroku_app_id !== 'undefined' && subscription.heroku_app_id !== 'MISSING') {
    resolve(decrypt(subscription.heroku_app_id));
  } else {
    getAddonInfo(subscription.id, token)
      .then((res) => {
        Subscriptions.update(
          // FIND QUERY
          {
            id: subscription.id
          },
          // UPDATES
          {
            heroku_app_id: encrypt(res.data.app.id)
          }, (err) => {
            // CALLBACK
            if (err) {
              console.error('CHECK_APP_ID_SERVER_ERROR');
              console.error(subscription, err);
              reject(err);
            }

            resolve(res.data.app.id);
          });
      })
      .catch(err => reject(err));
  }
});
