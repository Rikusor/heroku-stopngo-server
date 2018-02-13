const outRanTime = require('../utils/inactive-timer');
const Subscriptions = require('../app/schemas/subscription');

module.exports = () => new Promise((resolve, reject) => {
  const times = ['5', '15', '30', '45', '60'];
  const promises = [];

  times.forEach((time) => {
    let inactiveDate = outRanTime(time);

    const query = new Promise((resolve, reject) => {
      Subscriptions.find({
        status: 'ACTIVE',
        inactiveTimer: time,
        lastLogActivity: {
          $lt: inactiveDate
        }
      }, (err, docs) => {
        if (err) reject(err);

        if (typeof docs !== 'undefined' && docs.length > 0) {
          resolve(docs);
        } else {
          resolve([]);
        }
      });
    });
    promises.push(query);
  });


  Promise.all(promises)
    .then((values) => {
      const docs = [].concat.apply([], values);
      resolve(docs);
    })
    .catch(err => reject(err))
});
