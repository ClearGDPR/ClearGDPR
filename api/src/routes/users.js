const express = require('express');
const router = express.Router();
const { sessionJWT, cgJWT } = require('../utils/jwt');
const ensureAuthenticated = require('../utils/ensureAuthenticated');
const { Unauthorized, BadRequest } = require('../utils/errors');
const { db } = require('../db');

module.exports = app => {
  app.use('/users', router);

  router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new BadRequest('Attempt to login without username or password'));
    }
    const [userFromDb] = await db('users').where({ username: username });

    if (!userFromDb) {
      return next(new Unauthorized('User not registered'));
    }
    const apiToken = await sessionJWT.sign({ username });
    const cgToken = await cgJWT.sign({ subjectId: userFromDb.id });
    res.json({
      user: {
        username
      },
      apiToken,
      cgToken
    });
  });

  router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new BadRequest('Cannot register without an username or password'));
    }
    const [userFromDb] = await db('users').where({ username: username });

    if (userFromDb) {
      return next(new BadRequest('User already registered'));
    }
    const [userId] = await db('users')
      .insert({
        username: username,
        password: password
      })
      .returning('id');

    const apiToken = await sessionJWT.sign({ username });
    const cgToken = await cgJWT.sign({ subjectId: userId });
    res.json({
      apiToken,
      cgToken
    });
  });

  /**
   * This route uses the `ensureAuthenticated` middleware. If it fails,
   * an error will be returned. If it succeeds this handler is executed
   * and req.user is filled with the data from the JWT token
   */
  router.get('/account', ensureAuthenticated, async (req, res, next) => {
    try {
      res.json(req.user);
    } catch (err) {
      next(err);
    }
  });
};
