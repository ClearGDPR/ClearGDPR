const Promise = require('bluebird');
const cryptoRandomString = require('crypto-random-string');
const fs = require('fs');
const crypto = require('crypto');

const randomBytes = Promise.promisify(crypto.randomBytes);
const writeFile = Promise.promisify(fs.writeFile);

const arguments = process.argv.slice(2);
const [dbPassword, subjectsSecret] = arguments;

const sessionSecret = cryptoRandomString(20);
const healthCheckSecret = cryptoRandomString(20);

randomBytes(64)
  .then(buffer => {
    const dotEnv = `NODE_ENV=local

DB_ENGINE=postgres
DB_HOST=db
DB_USER=clear_gdpr
DB_PORT=5432
DB_PASSWORD=${dbPassword}
DB_DATABASE=clear_gdpr_local
DB_POOL_MIN=2
DB_POOL_MAX=10

PORT=8080

SESSION_SECRET=${sessionSecret}
CG_SECRET=${subjectsSecret}
HEALTH_CHECK_SECRET=${healthCheckSecret}
ALLOWED_REQUEST_ORIGIN=http://localhost:3000,http://localhost:4000\`;
`;

    return writeFile('.env', dotEnv);
  })
  .catch(console.error);
