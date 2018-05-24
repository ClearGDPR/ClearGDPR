const { managementJWT } = require('./../../utils/jwt');
const jwtMiddlewareFactory = require('./../../utils/jwt-middleware-factory');

module.exports = {
  verifyJWT: jwtMiddlewareFactory('user', managementJWT)
};
