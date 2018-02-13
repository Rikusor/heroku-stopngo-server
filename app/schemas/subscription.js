const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  plan: String,
  createdAt: { type: Date, default: Date.now },
  lastLogActivity: { type: Date, default: Date.now },
  drainToken: String,
  status: String,
  activeDynoFormation: String,
  inactiveTimer: { type: String, default: '30' },
  heroku_app_id: { type: String, default: 'MISSING' },
  log_input_url: String,
  logplex_token: String,
  oauth_access: String,
  oauth_refresh: String,
  oauth_token_type: String,
  oauth_expiry_time: Date,
});

SubscriptionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Subscription', SubscriptionSchema);
