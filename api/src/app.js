const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const { apiErrorHandler } = require('./utils/errors');

// Security HTTP headers
// See https://helmetjs.github.io/docs/
app.use(helmet());

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
require('./routes/healthz')(app);
require('./routes/robots')(app);
require('./routes/index')(app);

// API routes
const api = express.Router();
require('./routes/users')(api);
require('./routes/products')(api);

api.use(apiErrorHandler);
app.use('/api', api);

module.exports = app;
