const NodeEnvironment = require('jest-environment-node');

function getRandomId() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random()
    .toString(36)
    .substr(2, 9);
}

module.exports = class RandomDbEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();

    this.global.dbName = `${process.env.DB_DATABASE}_${getRandomId()}`;

    // needs to be required after setting the env variable
    const { dbSetup, dbTeardown } = require('./db-init');
    this.dbTeardown = dbTeardown;

    await dbSetup(this.global.dbName);
  }

  async teardown() {
    await this.dbTeardown(this.global.dbName);
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
};
