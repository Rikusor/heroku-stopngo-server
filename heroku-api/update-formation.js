const axios = require('axios');

module.exports = (appId, token, updates) => {

  let freeDynos = 0;

  updates.forEach(update => {
    if (update.size === 'Free') freeDynos++;
  });

  if (freeDynos > 2) {
    updates = updates.slice(0, 2);
  }

  return axios.patch(`https://api.heroku.com/apps/${appId}/formation`,
    {
      "updates": updates
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${token}`
      }
    })
};
