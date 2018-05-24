module.exports = app => {
  app.get('/', (req, res) => {
    res.status(200).send('<p>Hello Boilerplate</p>');
  });
};
