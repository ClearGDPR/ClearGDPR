const { provider } = require('ganache-cli');

const web3Provider = provider({
  accounts: [{ balance: '0x33B2E3C9FD0803CE8000000', secretKey: process.env.WALLET_PRIVATE_KEY }]
});

module.exports = () => web3Provider;
