const Subscriptions = require('../app/schemas/subscription');

module.exports = (addonId, status) => new Promise((resolve, reject) => {
  Subscriptions.update(
    // FIND QUERY
    {
      id: addonId
    },
    // UPDATES
    {
      status: status
    }, (err) => {
      // CALLBACK
      if (err) {
        console.error('STATUS_UPDATE_SERVER_ERROR');
        reject(addonId, status, err);
        console.error(err);
      }

      resolve('OK');
    });
});
