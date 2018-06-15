const Promise = require('bluebird');
const winston = require('winston');

const { VALID_RUN_MODES } = require('./constants');

function inControllerMode() {
  return process.env.MODE === VALID_RUN_MODES.CONTROLLER;
}

function getMyAddress() {
  return process.env.MY_ADDRESS;
}
function getTokenExpiry() {
  return process.env.JWT_TOKEN_EXPIRY || 604800;
}

const timeout = ms => new Promise(res => setTimeout(res, ms));

async function retryAsync(promise, options = {}) {
  let tries = 0;

  const maxRetries = options.maxRetries || 3;
  const interval = options.interval || 500;
  let delay = 0;

  while (tries < maxRetries) {
    await Promise.delay(delay);
    tries++;
    try {
      return await promise();
    } catch (e) {
      delay = interval * tries;
      winston.info(`Attempt no. ${tries} failed. Next attempt in ${delay}ms`);
      winston.log('debug', `Error: ${e.toString()}`);
    }
  }

  winston.error(`Operation failed after ${tries} attempts`);
}

module.exports = {
  getTokenExpiry,
  inControllerMode,
  getMyAddress,
  timeout,
  retryAsync
};
