const winston = require('winston');
const app = require('./app');
const port = +process.env.PORT;

require('./error-tracking');

const server = app.listen(port, () => {
  winston.info('NODE_ENV: ' + process.env.NODE_ENV);
  winston.info(`Api listening on port ${server.address().port}!`);
});

module.exports = server;
