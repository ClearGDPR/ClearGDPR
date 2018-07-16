const app = require('../src/app');
const fetch = require('node-fetch');
const querystring = require('querystring');
const http = require('http');
const db = require('../src/db');

let server = null;

exports.fetch = (path, options) => {
  const port = server.address().port;
  const baseURL = `http://127.0.0.1:${port}`;
  const body = options && options.body;
  if (Object.prototype.toString.call(body) === '[object Object]') {
    options.body = querystring.stringify(body);
    options.headers = Object.assign(options.headers || {}, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  }
  return fetch(baseURL + path, options);
};

exports.initResources = async () => {
  return new Promise((resolve, reject) => {
    server = http.createServer(app);
    server.listen(0, err => (err ? reject(err) : resolve()));
  });
};

exports.closeResources = () => Promise.all([server && server.close(), db.close()]);
