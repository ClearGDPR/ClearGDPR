const path = require('path');

module.exports = (app) => {
  app.get('/', (req, res) => res.sendFile(path.resolve(__dirname + '/../../api.html')))
}