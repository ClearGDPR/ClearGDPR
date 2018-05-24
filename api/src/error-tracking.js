const Raven = require('raven');

if (process.env.SENTRY_URL) {
  const raven = new Raven.Client(process.env.SENTRY_URL);
  process.on('warning', warning => raven.captureException(warning));
}
