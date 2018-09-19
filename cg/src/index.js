const winston = require('winston');
const app = require('./app');
const port = +process.env.PORT;
const startupRoutines = require('./startup-routines');

const { waitForGeth, isGethListening } = require('./utils/blockchain');

require('./error-tracking');

waitForGeth()
  .then(() => {
    const server = app.listen(port, () => {
      winston.info('NODE_ENV: ' + process.env.NODE_ENV);
      winston.info(`Api listening on port ${server.address().port}!`);
    });
  })
  .then(startupRoutines)
  .catch(err => {
    winston.error(err);
  });

setInterval(() => {
  if (!isGethListening()) {
    winston.info('Reconnecting to geth node');
    waitForGeth();
  }
}, 5000);
