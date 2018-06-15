const jwt = require('jsonwebtoken');
const { getTokenExpiry } = require('./helpers');
const { BadRequest } = require('./errors');

class JWT {
  constructor(algorithm, secretOrPrivateKey, secretOrPublicKey, options) {
    this.defaultOptions = options;
    this.algorithm = algorithm;
    this.secretOrPrivateKey = secretOrPrivateKey;
    this.secretOrPublicKey = secretOrPublicKey;
  }

  sign(payload, options) {
    const opts = Object.assign({ expiresIn: getTokenExpiry() }, this.defaultOptions, options);
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.secretOrPrivateKey, opts, (err, token) => {
        err ? reject(err) : resolve(token);
      });
    });
  }

  verify(token, options) {
    const opts = Object.assign({}, { algorithm: this.algorithm }, options);
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretOrPublicKey, opts, (err, decoded) => {
        if (err && err.name === 'TokenExpiredError') {
          return reject(new BadRequest('JWT token expired'));
        }
        err ? reject(err) : resolve(decoded);
      });
    });
  }
}

exports.JWT = JWT;

exports.subjectJWT = new JWT('HS256', process.env.SUBJECTS_SECRET, process.env.SUBJECTS_SECRET);
exports.processorJWT = new JWT('HS256', process.env.PROCESSOR_SECRET, process.env.PROCESSOR_SECRET);
exports.managementJWT = new JWT(
  'HS256',
  process.env.MANAGEMENT_SECRET,
  process.env.MANAGEMENT_SECRET
);

exports.jwtFactory = function(secret) {
  return new JWT('HS256', secret, secret);
};
