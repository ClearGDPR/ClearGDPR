const jwt = require('jsonwebtoken');

class JWT {
  constructor(algorithm, secretOrPrivateKey, secretOrPublicKey, options) {
    this.defaultOptions = options;
    this.algorithm = algorithm;
    this.secretOrPrivateKey = secretOrPrivateKey;
    this.secretOrPublicKey = secretOrPublicKey;
  }

  sign(payload, options) {
    const opts = Object.assign({}, this.defaultOptions, options);
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
        err ? reject(err) : resolve(decoded);
      });
    });
  }
}

exports.JWT = JWT;

exports.sessionJWT = new JWT('HS256', process.env.SESSION_SECRET, process.env.SESSION_SECRET);
exports.cgJWT = new JWT('HS256', process.env.CG_SECRET, process.env.CG_SECRET);
