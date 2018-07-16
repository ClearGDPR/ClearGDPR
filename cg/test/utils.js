const winston = require('winston');
const app = require('../src/app');
const fetch = require('node-fetch');
const http = require('http');
const db = require('../src/db');
const Promise = require('bluebird');

let server = null;

exports.serverHost = () => {
  const port = server.address().port;
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

exports.fetchWithAuthorization = (path, token, overrides) => {
  return exports.fetch(
    path,
    Object.assign(
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
      overrides
    )
  );
};

exports.initResources = async () => {
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
