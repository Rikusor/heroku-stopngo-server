const axios = require('axios');

module.exports = (subscriptionId, token) => {
  return axios.get(`https://api.heroku.com/addons/${subscriptionId}`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${token}`
      }
    });
};
