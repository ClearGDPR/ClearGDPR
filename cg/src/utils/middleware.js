const { Unauthorized } = require('./errors');
const { inControllerMode } = require('./helpers');

function controllerOnly(req, res, next) {
  // return next();
  if (inControllerMode()) return next();
  return next(new Unauthorized('This route is only available to controller nodes'));
}

module.exports = {
  controllerOnly
};
