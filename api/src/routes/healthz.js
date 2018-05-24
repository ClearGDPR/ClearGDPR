const { db } = require('../db');
const { HEALTH_CHECK_SECRET } = process.env;

module.exports = app => {
  app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });

  app.get(`/healthz/long/${HEALTH_CHECK_SECRET}`, async (req, res, next) => {
    // Add more services here.
    // The key is the service name
    // The value is a function that tests the service and returns a Promise
    const services = {
      db: () => db.raw('select 1')
    };
    const results = {};
    let ok = true;
    await Promise.all(
      Object.keys(services).map(async name => {
        try {
          await services[name]();
          results[name] = 'OK';
        } catch (err) {
          console.error(err);
          results[name] = err.message;
          ok = false;
        }
      })
    );
    res.status(ok ? 200 : 500).json(results);
  });
};
