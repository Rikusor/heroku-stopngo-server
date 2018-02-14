const axios = require('axios');
const querystring = require('querystring');
const getAddonInfo = require('../../../heroku-api/get-addon-info');
const getToken = require('../../../heroku-api/refresh-token');
const Subscription = require('../../schemas/subscription');
const encrypt = require('../../../utils/encrypt');

const logServer = process.env.SYSLOG_SERVER || 'https://127.0.0.1:4567/logs';

module.exports = (req, res) => {
  const subscription = new Subscription();

  subscription.status = 'ACTIVE';
  subscription.id = req.body.uuid;
  subscription.inactiveTimer = req.body.options.timer || '30';
  subscription.plan = req.body.plan;
  subscription.drainToken = encrypt(req.body.log_drain_token);
  subscription.log_input_url = encrypt(req.body.log_input_url);
  subscription.logplex_token = encrypt(req.body.logplex_token);

  axios.post('https://id.heroku.com/oauth/token', querystring.stringify({
      grant_type: req.body.oauth_grant.type,
      code: req.body.oauth_grant.code,
      client_secret: process.env.OAUTH_CLIENT_SECRET
    }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then((response) => new Promise((resolve, reject) => {
      const oauthInfo = response.data;
      const currentDate = new Date();
      const expiryDate = new Date(currentDate.getTime() + (oauthInfo.expires_in * 1000 ));

      subscription.oauth_access = encrypt(oauthInfo.access_token);
      subscription.oauth_refresh = encrypt(oauthInfo.refresh_token);
      subscription.oauth_token_type = oauthInfo.token_type;
      subscription.oauth_expiry_time = expiryDate;

      subscription.save((err) => {
        if (err) {
          console.error('ERROR_SAVING_SERVER_ERROR:');
          console.error(err);
          reject('ERROR_SAVING');
          res.sendStatus(500).json({ error: err.toString()});
        }

        res.json({
          config: {
            ERROR_PAGE_URL: process.env.STOPNGO_PAGES_BASE_URL + "/error-page/" + subscription._id
          },
          log_drain_url: logServer + '/' + req.body.uuid,
          id: req.body.uuid,
          message: "Thanks for subscribing to Stop 'N Go service. We have started to monitor your application for inactivity, you can sit back, relax and save money!"
        });

        resolve(subscription);

      });
    }))
    .then((subscription) => {
      getToken(subscription)
        .then(token => getAddonInfo(subscription.id, token))
        .then((res) => {
          const appId = res.data.app.id;
          Subscription.update({ id: subscription.id }, { heroku_app_id: encrypt(appId) }, (err) => {
            if (err) {
              console.error('CREATE_UPDATE_SERVER_ERROR:');
              console.error(err);
              res.sendStatus(500).json({ error: err.toString()});
            }
          });
        })
        .catch(err => {
          console.error('CREATE_TKN_CHAIN_SERVER_ERROR:');
          console.log(req.body, subscription, err)
        })
    })
    .catch((error) => {
      console.error('CREATE_CHAIN_SERVER_ERROR:');
      console.log(error);
      res.sendStatus(500).json({ error })
    });
};
