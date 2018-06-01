const express = require('express');
const app = express();
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressWs = require('express-ws');
const { apiErrorHandler } = require('./utils/errors');
const { errors } = require('celebrate');

const corsOptions = {
  origin: process.env.ALLOWED_REQUEST_ORIGIN
};

// Security HTTP headers
// See https://helmetjs.github.io/docs/
app.use(helmet());

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

// Routes
require('./routes/healthz')(app);
require('./routes/robots')(app);
require('./routes/index')(app);
expressWs(app);

// API routes
const api = express.Router();
require('./domains/subjects/subjects.routes')(api);
require('./domains/processors/processors.routes')(api);
require('./domains/management/management.routes')(api);

// the ordering of error handlers matters here
// celebrate will intercept only Joi errors
// and pass along any other errors using next(err);
api.use(errors());
api.use(apiErrorHandler);
app.use('/api', api);

module.exports = app;
