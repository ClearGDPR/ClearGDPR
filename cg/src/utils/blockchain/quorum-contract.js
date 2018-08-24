const Promise = require('bluebird');
const { getMyAddress } = require('../helpers');

class QuorumContract {
  constructor(web3, contractAbiJson = undefined, contractAddress) {
    this.web3 = web3;
    const contractAbiDefinition = contractAbiJson || require('./contract-abi.json');
    if (contractAddress) {
      this.contract = new web3.eth.Contract(contractAbiDefinition, contractAddress);
    } else {
      this.contract = new web3.eth.Contract(contractAbiDefinition);
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
    const newContract = await this.contract.deploy({ data }).send({
      gas: '4700000',
      from: this.contractOwnerAddress
      // If we need to deploy a private contract from an existing contract, use 'privateFor' or 'privateFrom' as shown below
      // privateFor: ["kPidpmUjAtagI4lLDvP2y2pPYDUVqLOk/wLa7q9sums="] // The privateFor specifies which nodes will have access to the private smart contract. The value is an array of strings, in which each string is the public key of the node inside the Quorum network. It's the public key used by the Enclave.
      // privateFrom: '7ZtpI6yn969H3NHBukwsTtO+E/LXtRO6FtH3vIBU/iM='
    });

    this.contract = newContract;
    return newContract;
  }

  // This function will be used in the future, leave it alone for now
  // async deployPrivateContract(contractByteCode){
  //   await this._unlockAccount(this.contractOwnerAddress);
  //   let privateContractAddress;
  //   this.web3.eth.sendTransaction(  // We cal also await this
  //     {
  //       from: this.contractOwnerAddress,
  //       gas: '4700000',
  //       data: contractByteCode,
  //       // privateFrom: '7ZtpI6yn969H3NHBukwsTtO+E/LXtRO6FtH3vIBU/iM='
  //       privateFor: ["kPidpmUjAtagI4lLDvP2y2pPYDUVqLOk/wLa7q9sums="]
  //     }).then(function(receipt){
  //       // console.log(receipt);
  //       privateContractAddress = receipt.contractAddress;
  //     });
  //
  //   return privateContractAddress;
  // }

  async transferFunds(accountAddressToFund) {
    await this._unlockAccount(this.contractOwnerAddress);
    this.web3.eth
      .sendTransaction({
        from: this.contractOwnerAddress,
        // gas: '4700000',
        to: accountAddressToFund,
        value: '10000000000000000000000' // the Controller can fund 10^5 accounts with this value
      })
      .then(function(receipt) {
        console.log(receipt);
      });

    // return privateContractAddress;
  }

  get methods() {
    return this.contract.methods;
  }

  get address() {
    return this.contract.options.address;
  }
}

module.exports = QuorumContract;
