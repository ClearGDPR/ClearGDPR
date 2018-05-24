const winston = require('winston');
const fs = require('fs');
const keythereum = require('keythereum');

if (process.argv.length < 3) {
  winston.info('Path to key file not specified.');
  winston.info('Example usage:');
  winston.info('    node get-wallet-pk.js path/to/keyfile.json [password - default empty]');
  return;
}

const path = process.argv[2];
const pass = process.argv[3] || '';

const keyObj = JSON.parse(fs.readFileSync(path));
const privateKey = keythereum.recover(pass, keyObj);
winston.info(`Private key: ${privateKey.toString('hex')}`);
