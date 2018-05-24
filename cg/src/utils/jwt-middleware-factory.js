const { Unauthorized } = require('./errors');

module.exports = (reqStorageKey, jwtInstance) => {
  return async (req, res, next) => {
    const auth = req.get('authorization');
    if (!auth) return next(new Unauthorized('Authorization header not sent'));
    try {
      const token = auth.substring('Bearer'.length).trim();
      req[reqStorageKey] = await jwtInstance.verify(token);
      return next();
    } catch (err) {
      if ((err.name || '').startsWith('JsonWebToken')) {
        return next(new Unauthorized('Authorization header failed verification'));
      }
      return next(err);
    }
  };
};
