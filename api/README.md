<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [API](#api)
  - [Directory structure](#directory-structure)
  - [Database migrations and seed files](#database-migrations-and-seed-files)
    - [Running tests](#running-tests)
  - [Debugging](#debugging)
  - [Writing new tests](#writing-new-tests)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# API

## Directory structure

Main files and directories of the application

```
api
├─ migrations           # Where knex migrations are stored
├─ seeds                # Where knex seed files are stored
└─ src
   ├─ routes            # Where endpoints are defined
   │  ├─ healthz.js     # Health check endpoints
   │  ├─ robots.js      # Endpoints for robots.txt
   │  ├─ index.js       # Test endpoint
   │  └─ users.js       # Endpoints for user authentication
   ├─ app.js            # Where the Express app object is created
   ├─ db.js             # File to require to access the db
   ├─ error-tracking.js # Configuration for the error tracking tool
   └─ index.js          # Starting point of the application
```

## Database migrations and seed files

This project uses `knex`. You can run the command line utility just doing

```
docker-compose exec api yarn run knex
```

You'll see all the options available. Some examples:

```
docker-compose exec api yarn run knex migrate:make [options] <name>          Create a named migration file.
docker-compose exec api yarn run knex seed:make [options] <name>             Create a named seed file.
docker-compose exec api yarn run knex seed:run                               Run seed files.
```

Migrations are run everytime the server starts with `yarn run start` or `yarn run start-dev`

### Running tests

Integration tests access the API server and the database. These tests require the containers to be up to pass.

The command to run them is:

```
docker-compose exec api yarn run test
```

## Debugging

The project is prepared to be debugged thanks to the V8 debugging protocol. For example for VSCode you can create a launch configuration like this:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Docker",
      "port": 9229,
      "restart": true,
      "remoteRoot": "/app"
    }
  ]
}
```

## Writing new tests

Integration tests can access the database and the API server.

```javascript
const { integration } = require('./utils');

describe('App', () => {
  integration('do something with the server or the db or both', async () => {
    // Your test here
  });
});
```

The `integration` function is just either jest's `it` or `it.skip`. With this
utility when running only unit tests, integration tests will be skipped
transparently for you.
