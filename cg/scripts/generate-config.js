const Promise = require('bluebird');
const cryptoRandomString = require('crypto-random-string');
const fs = require('fs');
const crypto = require('crypto');

const randomBytes = Promise.promisify(crypto.randomBytes);
const writeFile = Promise.promisify(fs.writeFile);

const arguments = process.argv.slice(2);
const [
  controllerAccount,
  processorAccount,
  accountPassword,
  dbPassword,
  walletPrivateKey
] = arguments;

const subjectsSecret = cryptoRandomString(20);

console.log(subjectsSecret);

const processorSecret = cryptoRandomString(20);
const managementSecret = cryptoRandomString(20);
const healthCheckSecret = cryptoRandomString(20);

const processorJwt = require('../src/utils/jwt').jwtFactory(processorSecret);

randomBytes(32)
  .then(buffer => {
    const appHexKey = buffer.toString('hex');

    const dotEnv = `NODE_ENV=local

DB_ENGINE=postgres
DB_HOST=db
DB_USER=clear_gdpr
DB_PORT=5432
DB_PASSWORD=${dbPassword}
DB_POOL_MIN=2
DB_POOL_MAX=10

PORT=8082

SUBJECTS_SECRET=${subjectsSecret}
PROCESSOR_SECRET=${processorSecret}
MANAGEMENT_SECRET=${managementSecret}
HEALTH_CHECK_SECRET=${healthCheckSecret}

# NOTE: this is in hex
APP_KEY_HEX=${appHexKey}

# blockchain quorum settings:
QUORUM_ACCOUNT_PASSWORD=${accountPassword}
CONTRACT_OWNER_ADDRESS=${controllerAccount}
WALLET_PRIVATE_KEY=${walletPrivateKey}
MY_ADDRESS=${controllerAccount}

# for processor, but also for tests
CONTROLLER_URL=http://cg:8082`;

    return writeFile('.env', dotEnv);
  })
  .then(() => {
    const dotEnv = `DB_DATABASE=clear_gdpr_cg_controller_local
BLOCKCHAIN_NODE_URL=ws://quorum1:8546
MODE=CONTROLLER
`;
    return writeFile('.controller.env', dotEnv);
  })
  .then(() =>
    processorJwt.sign({
      id: 1
    })
  )
  .then(jwt => {
    const dotEnv = `MODE=PROCESSOR
BLOCKCHAIN_NODE_URL=ws://quorum2:8546
DB_DATABASE=clear_gdpr_cg_processor_local
MY_ADDRESS=${processorAccount}
PROCESSOR_JWT=${jwt}
`;
    return writeFile('.processor.env', dotEnv);
  })
  .catch(console.error);
