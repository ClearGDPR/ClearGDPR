const bcryptjs = require('bcryptjs');

function hashPassword(password) {
  return bcryptjs.hash(password, parseInt(process.env.BCRYPT_ROUNDS, 10));
}

function comparePassword(password, hash) {
  return bcryptjs.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword
}