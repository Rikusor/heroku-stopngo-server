const axios = require('axios');
const querystring = require('querystring');
const decrypt = require('../utils/decrypt');
const Subscriptions = require('../app/schemas/subscription');
const encrypt = require('../utils/encrypt');

module.exports = (subscription) => new Promise((resolve, reject) => {
  const currentTime = new Date();
  const comparisonTime = currentTime.getTime() - (1000 * 60 * 5);
  const oauthExpiry = new Date(subscription.oauth_expiry_time);

  if (oauthExpiry > comparisonTime) resolve(decrypt(subscription.oauth_access));

  axios.post('https://id.heroku.com/oauth/token', querystring.stringify({
    grant_type: 'refresh_token',
    refresh_token: decrypt(subscription.oauth_refresh),
    client_secret: process.env.OAUTH_CLIENT_SECRET
  }),{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(response => {
    const oauthInfo = response.data;
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + (oauthInfo.expires_in * 1000 ));

    Subscriptions.update({ id: subscription.id, },
      {
        oauth_access: encrypt(oauthInfo.access_token),
        oauth_refresh: encrypt(oauthInfo.refresh_token),
        oauth_token_type: oauthInfo.token_type,
        oauth_expiry_time: expiryDate
      }, (err) => {
        if (err) {
          reject(err);
          console.error('REFRESH_TOKEN_SERVER_ERROR');
          console.error(subscription, response, err);
        }

        resolve(oauthInfo.access_token);
      });
  }).catch(err => reject(err))
});
