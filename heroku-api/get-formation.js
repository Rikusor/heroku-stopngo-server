const axios = require('axios');

module.exports = (appId, token) => {
  return axios.get(`https://api.heroku.com/apps/${appId}/formation`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${token}`
      }
    })
};
