const winston = require('winston');
const app = require('../src/app');
const fetch = require('node-fetch');
const http = require('http');
const db = require('../src/db');
const Promise = require('bluebird');

const integrationTests = !!process.env.TEST_INTEGRATION;

let server = null;

exports.integration = integrationTests ? global.it : global.it.skip;

exports.appUnit = integrationTests ? global.it.skip : global.it;

exports.serverHost = () => {
  const port = integrationTests ? +process.env.PORT : server.address().port;
  return `127.0.0.1:${port}`;
};

exports.fetch = (path, options) => {
  const baseURL = `http://${exports.serverHost()}`;
  const body = options && options.body;
  if (Object.prototype.toString.call(body) === '[object Object]') {
    options.body = JSON.stringify(body);
    options.headers = Object.assign(options.headers || {}, {
      'Content-Type': 'application/json'
    });
  }
  return fetch(baseURL + path, options);
};

exports.initResources = async () => {
  if (integrationTests) return;
  return new Promise((resolve, reject) => {
    server = http.createServer(app);
    require('express-ws')(app, server);
    server.listen(0, err => (err ? reject(err) : resolve()));
  });
};

function closeHttpServer() {
  return new Promise((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }

    server.close(err => (err ? reject(err) : resolve()));
  });
}

exports.closeResources = async () => {
  try {
    await Promise.all([closeHttpServer(), db.close()]);
  } catch (e) {
    winston.error(`Error closing resources after tests: ${e.toString()}`);
  }
};
