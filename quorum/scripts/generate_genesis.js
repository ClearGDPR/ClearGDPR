const fs = require('fs');
let arguments = process.argv.slice(2);

const balance = '1000000000000000000000000000';

let genesis = {
  alloc: {},
  coinbase: '0x0000000000000000000000000000000000000000',
  config: {
    homesteadBlock: 0
  },
  difficulty: '0x0',
  extraData: '0x',
  gasLimit: '0x2FEFD800',
  mixhash: '0x00000000000000000000000000000000000000647572616c65787365646c6578',
  nonce: '0x0',
  parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  timestamp: '0x00'
};

arguments.forEach(dir => {
  const path = `${process.cwd()}/quorum/generated_configs/${dir}/dd/account.txt`;
  // console.log(path);
  const account = fs
    .readFileSync(path)
    .toString()
    .split('\n')
    .shift();

  genesis.alloc[account] = {
    balance
  };
});

const genesis_base64 = Buffer.from(JSON.stringify(genesis)).toString('base64');

console.log(`${genesis_base64}`);
