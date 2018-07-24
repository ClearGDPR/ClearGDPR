const Promise = require('bluebird');
const { getMyAddress } = require('../helpers');

class QuorumContract {
  constructor(web3, contractAbiJson = undefined, contractAddress) {
    this.web3 = web3;
    const contractABIDefinition = contractAbiJson || require('./contract-abi.json');
    if (contractAddress) {
      this.contract = new web3.eth.Contract(contractABIDefinition, contractAddress);
    } else {
      this.contract = new web3.eth.Contract(contractABIDefinition);
    }

    this.contractOwnerAddress = process.env.CONTRACT_OWNER_ADDRESS;
    this.myAddress = getMyAddress();
  }

  async performMethod(methodName, params = []) {
    await this._unlockAccount(this.myAddress);
    return new Promise((resolve, reject) => {
      this.contract.methods[methodName](...params)
        .send({
          from: this.myAddress,
          gas: '4700000'
        })
        .once('transactionHash', resolve)
        .once('error', reject);
    });
  }

  async _unlockAccount(address) {
    await this.web3.eth.personal.unlockAccount(address, process.env.QUORUM_ACCOUNT_PASSWORD || '');
  }

  async deploy(data) {
    await this._unlockAccount(this.contractOwnerAddress);
    const newContract = await this.contract
      .deploy({ data })
      .send({ gas: '4700000', from: this.contractOwnerAddress });

    this.contract = newContract;
    return newContract;
  }

  get methods() {
    return this.contract.methods;
  }

  get address() {
    return this.contract.options.address;
  }
}

module.exports = QuorumContract;
