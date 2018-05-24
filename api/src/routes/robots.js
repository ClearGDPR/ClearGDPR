module.exports = app => {
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    if (process.env.ROBOTS_INDEX === 'true') {
      res.send('User-agent: *\nDisallow:\n');
    } else {
      res.send('User-agent: *\nDisallow: /\n');
    }
  });
};
