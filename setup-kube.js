// This version creates the environment for our Kubernetes pods in AWS.
// The environment is required to deploy the demo websites

const crypto = require('crypto');
const exec = require('child_process').execSync;

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getKey() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(48, function(err, buffer) {
      if (err) reject(err);
      var token = buffer.toString('hex');
      resolve(token);
    });
  });
}

function getInput(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

// const args = process.argv.slice(2);
function logProgress(msg) {
  console.log(msg);
}

function checkPrereqs() {
  // check docker
  try {
    exec('docker -v');
  } catch (e) {
    logProgress('docker not found, exiting');
    process.exit(1);
  }
  try {
    exec('docker-compose -v');
  } catch (e) {
    logProgress('docker-compose not found, exiting');
    process.exit(1);
  }
}

/* eslint max-statements: 0 */
async function run() {
  await checkPrereqs();
  const defaultAccountPassword = await getKey();
  const defaultDbPassword = await getKey();

  let accountPassword = await getInput(
    `Enter an account password: default [${defaultAccountPassword}] `
  );

  if (!accountPassword) accountPassword = defaultAccountPassword;

  logProgress('Creating initial env files...');

  exec(`touch cg/.env cg/.controller.env cg/.processor.env api/.env \\
    quorum/node_1/.env quorum/node_2/.env \\
    docker/definitions/postgres/.env`);

  logProgress('Building docker images... this will take a while');

  exec(`docker/run --build`);

  logProgress('Generating quorum node configs');

  exec(`quorum/scripts/create_node.sh node1 127.0.0.1 127.0.0.1 9000 30303 50400 8545 8546 ${accountPassword} && \\
  quorum/scripts/create_node.sh node2 127.0.0.1 127.0.0.1 9001 30304 50401 8547 8548 ${accountPassword} && \\
  quorum/scripts/generate_env_vars.sh node1 node2`);

  logProgress('Copying quorum env files');

  exec(`cp quorum/generated_configs/node1/.env quorum/node_1/.env && \\
    cp quorum/generated_configs/node2/.env quorum/node_2/.env`);

  logProgress('Reading generated account addresses');

  const controllerAccount = `0x${exec(
    'cat quorum/generated_configs/node1/dd/account.txt'
  )}`.replace(/\n$/, '');
  const processorAccount = `0x${exec('cat quorum/generated_configs/node2/dd/account.txt')}`.replace(
    /\n$/,
    ''
  );

  let dbPassword = await getInput(`Enter a db password: default [${defaultDbPassword}] `);
  if (!dbPassword) dbPassword = defaultDbPassword;

  logProgress('Generating config for CG controller and CG processor');

  const subjectSecret = exec(
    `cg/scripts/generate_config.sh ${controllerAccount} ${processorAccount} ${accountPassword} ${dbPassword} quorum/generated_configs/node1`
  );

  logProgress('Generating config for demo API project');

  exec(`api/scripts/generate_config.sh ${dbPassword} ${subjectSecret}`);

  logProgress('Creating DB config...');

  exec(`echo "POSTGRES_PASSWORD=${dbPassword}" > docker/definitions/postgres/.env`);

  await getInput(
    `You're almost there! run 'docker/run' in another terminal to start the docker containers, press enter when complete`
  );

  logProgress('Deploying initial contract...');

  exec(`docker/compose exec -T cg yarn run deploy-contract`);

  logProgress('Adding initial processor');

  exec(`docker/compose exec -T cg yarn run add-processor ${processorAccount}`);

  logProgress('All done, the example UI should be accessible at http://localhost:3000');
}

run()
  .catch(console.error)
  .then(() => {
    // clean up
    rl.close();
  });
