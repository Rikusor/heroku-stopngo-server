const Subscription = require('../../schemas/subscription');

module.exports = (req, res) => {
  Subscription.findById(req.params.id, (err, application) => {
    if (err) {
      console.error('STATUS_SERVER_ERROR:');
      console.error(req.params.id, err);
      res.json({
        status: 'ERROR'
      });
    } else if (application === null) {
      console.error('STATUS_FAILED:');
      console.error(req.params.id);
      res.json({
        status: 'ERROR'
      });
    } else {
      res.json({
        status: application.status
      });
    }
  });
};
