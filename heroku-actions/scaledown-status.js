const outRanTime = require('../utils/inactive-timer');
const Subscriptions = require('../app/schemas/subscription');

module.exports = (subscription, activeFormation) => new Promise((resolve, reject) => {
  Subscriptions.update(
    // FIND QUERY
    {
      id: subscription.id,
      lastLogActivity: {
        $lt: outRanTime(subscription.inactiveTimer)
      }
    },
    // UPDATES
    {
      status: 'SCALING_DOWN',
      activeDynoFormation: activeFormation
    }, (err) => {
      // CALLBACK
      if (err) {
        console.error('SCALE_DOWN_SERVER_ERROR');
        reject(subscription, activeFormation, err);
        console.error(err);
      }

      resolve('OK');
    });
});
