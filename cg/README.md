<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [CG – the ClearGDPR framework implementation](#cg--the-cleargdpr-framework-implementation)
  - [Directory structure](#directory-structure)
  - [Initial setup](#initial-setup)
    - [Deploy the contract:](#deploy-the-contract)
    - [Create initial processor:](#create-initial-processor)
    - [Seed the processors:](#seed-the-processors)
    - [WALLET_PRIVATE_KEY (Only when using Rinkeby network)](#wallet_private_key-only-when-using-rinkeby-network)
  - [Database migrations and seed files](#database-migrations-and-seed-files)
    - [Running tests](#running-tests)
  - [Debugging](#debugging)
    - [Debugging node JS](#debugging-node-js)
    - [Debugging tests](#debugging-tests)
  - [Writing new tests](#writing-new-tests)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# CG – the ClearGDPR framework implementation

## Directory structure

Main files and directories of the application

```
cg
├─ migrations                       # Where knex migrations are stored
├─ seeds                            # Where knex seed files are stored
└─ src
   ├─ domains                       # Sub-folders for domain specific code
   │  └─ subjects                   # Example domain for rights that can be executed by a subject
   │  │  ├─ subjects.controller.js  # Route handlers for subjects routes
   │  │  ├─ subjects.routes.js      # Route definitions for subjects controller
   │  │  └─ subjects.service.js     # Ppp service layer code
   ├─ routes                        # Where endpoints are defined
   │  ├─ healthz.js                 # Health check endpoints
   │  ├─ robots.js                  # Endpoints for robots.txt
   │  ├─ index.js                   # Test endpoint
   │  └─ users.js                   # Endpoints for user authentication
   ├─ app.js                        # Where the Express app object is created
   ├─ db.js                         # File to require to access the db
   ├─ error-tracking.js             # Configuration for the error tracking tool
   └─ index.js                      # Starting point of the application
```

## Initial setup

Start by running:

```bash
yarn install
```

### Deploy the contract:

Remember to follow the guide in main [README](../README.md) to create environment variables in `.env` file.

Then to deploy the contract run this command:

```bash
docker/compose exec -T cg yarn run deploy-contract
```

### Create initial processor:

```bash
PROCESSOR_ACCOUNT=0x$(cat quorum/generated_configs/node2/dd/account.txt) && \
  docker/compose exec cg yarn run add-processor $PROCESSOR_ACCOUNT
```

### Seed the processors:

If you want to seed more processors than the initial configured one (for testing purposes) you can do it running the command below:

Execute:

```bash
docker-compose exec cg yarn run knex seed:run
```

It will seed 3 additional example processors with the following addresses:

```
0x5521a68D4F8253fC44BFb1490249369b3E299A4A
0xF4b9ed39dD183504252Ee5995C58DAc8197fa12D
0xe1A1DF8C6A2DEdd7fc85e2be8B3278cD3E599A02
```

### WALLET_PRIVATE_KEY (Only when using Rinkeby network)

See the `../quorum/README.md` for instructions on getting the private key.

Once you have it you need to prepend it with `0x` and add to `.env` file.

## Database migrations and seed files

This project uses `knex`. You can run the command line utility just doing

```
docker-compose exec cg yarn run knex
```

You'll see all the options available. Some examples:

```
docker-compose exec cg yarn run knex migrate:make [options] <name>          Create a named migration file.
docker-compose exec cg yarn run knex seed:make [options] <name>             Create a named seed file.
docker-compose exec cg yarn run knex seed:run                               Run seed files.
docker-compose exec cg yarn run knex migrate:latest                         Run migrations
```

Migrations are run everytime the server starts with `yarn run start` or `yarn run start-dev`

### Running tests

Integration tests access the API server and the database. These tests require the containers to be up to pass.

The command to run them is:

```
docker-compose exec cg yarn run test
```

## Debugging

### Debugging node JS

The project is prepared to be debugged thanks to the V8 debugging protocol on port 9230.
For example for VSCode you can create a launch configuration like this:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Docker",
      "port": 9230,
      "restart": true,
      "remoteRoot": "/app"
    }
  ]
}
```

### Debugging tests

If you want to debug the tests you need to run the tests using a separate command and not `yarn test`.
Debugging tests requires the containers to be up.

The command to run tests in debug mode is:

```
docker-compose exec cg yarn run test:debug
```

Then you can hook up any debugger supporting the V8 debugging protocol, but on port 9231.
For example for VSCode you can create a launch configuration like this:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Docker",
      "port": 9231,
      "restart": true,
      "remoteRoot": "/app"
    }
  ]
}
```

## Writing new tests

**App unit tests**

In the very particular case of wanting to unit test the express application
configuration (inside `app.js`) you can use an structure like this:

```javascript
const { initResources, fetch, closeResources } = require('./utils');

describe('App', () => {
  beforeAll(initResources);

  afterAll(closeResources);
});
```

This is useful in just a few scenarios:

- Testing HTTP headers
- Testing different responses based on env variables (e.g. the `/robots.txt`
  endpoint)

The only special thing about these tests is that they need to have the server
running, but not as an external process because you want to change the behavior
in each test.
