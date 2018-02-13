const Subscription = require('../../schemas/subscription');

module.exports = (req, res) => {
  let updates;
  let message;

  if (req.body.update_timer && req.body.new_timer) {
    if (['5', '15', '30', '45', '60'].indexOf(req.body.new_timer) === -1) {
      console.error('UPDATE_TIMER_SERVER_ERROR:');
      console.error(req.body);
      res.sendStatus(400).json({ error: 'NOT_SUPPORTED_TIME'});
      return;
    }
    updates = { inactiveTimer: req.body.new_timer };
    message = `You have successfully updated your timer to: ${req.body.new_timer}`
  } else {
    updates = { plan: req.body.plan };
    message = `You have successfully updated your plan to: ${req.body.plan}`
  }

  Subscription.update({ id: req.params.id }, updates, (err) => {
    if (err) {
      console.error('UPDATE_ROUTE_SERVER_ERROR:');
      console.error(req, err);
      res.sendStatus(500).json({ error: err.toString()});
      return;
    }
    res.json({
      message
    });
  });
};
