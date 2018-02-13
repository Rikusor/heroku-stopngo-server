const Subscription = require('../../schemas/subscription');

module.exports = (req, res) => {
  Subscription.remove({ id: req.params.id }, (err) => {
    if (err) {
      console.error('REMOVE_ROUTE_SERVER_ERROR:');
      console.error(req.params.id, err);
      res.sendStatus(500).json({ error: err.toString()});
    }
    res.json({
      status: 'Subscription cancelled.'
    });
  });
};
