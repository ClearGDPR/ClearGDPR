const QuorumContract = require.requireActual('../quorum-contract');

class MockQuorumContract extends QuorumContract {
  constructor(web3, abiDefinition = undefined, contractAddress) {
    super(web3, abiDefinition, contractAddress);
    // we're setting this so all blockchain methods are executed in the context of the contract owner in tests
    this.myAddress = process.env.CONTRACT_OWNER_ADDRESS;
  }
}

module.exports = MockQuorumContract;
