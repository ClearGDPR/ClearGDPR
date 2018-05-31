const crypto = require('crypto');
var exec = require('child_process').exec;

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

function checkPrereqs() {
  // check docker
}

// const args = process.argv.slice(2);

async function run() {
  await checkPrereqs();
  const defaultAccountPassword = await getKey();
  const ACCOUNT_PASSWORD = getInput(
    `Enter an account password: default [${defaultAccountPassword}]`
  );

  exec(`touch cg/.env cg/.controller.env cg/.processor.env api/.env \\
    quorum/node_1/.env quorum/node_2/.env \\
    docker/definitions/postgres/.env \\
    && cp frontend/.env.example frontend/.env`);

  exec(`quorum/scripts/create_node.sh node1 172.13.0.2 172.13.0.4 9000 30303 50400 8545 8546 ${ACCOUNT_PASSWORD} && \\
    quorum/scripts/create_node.sh node2 172.13.0.3 172.13.0.5 9000 30303 50400 8545 8546 ${ACCOUNT_PASSWORD} && \\
    quorum/scripts/generate_env_vars.sh node1 node2`);

  exec(`cp quorum/generated_configs/node1/.env quorum/node_1/.env && \\
    cp quorum/generated_configs/node2/.env quorum/node_2/.env`);
}

run().catch(console.error);
