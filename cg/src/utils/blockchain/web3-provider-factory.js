const Web3 = require('web3');
require('./web3-monkey-patch');

function getWeb3Provider() {
  return new Web3.providers.WebsocketProvider(process.env.BLOCKCHAIN_NODE_URL);
}

module.exports = getWeb3Provider;
