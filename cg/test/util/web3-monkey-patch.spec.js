const Web3 = require('web3');
const QuorumContract = require('./../../src/utils/blockchain/quorum-contract');
const contractABI = require('../../src/utils/blockchain/contract-abi');
const contractByteCode = require('../../src/utils/blockchain/contract-bytecode');
const web3ProviderFactory = require('../../src/utils/blockchain/web3-provider-factory');
const web3 = new Web3(web3ProviderFactory());

let quorum;

beforeAll(async () => {
  quorum = new QuorumContract(web3, contractABI);
  await quorum.deploy(contractByteCode);
});

describe('Web3 monkey patch', () => {
  it('should allow the events to fire without crashing', async done => {
    const subjectId = web3.utils.sha3('12929292992');
    expect.assertions(2);

    quorum.contract.events.allEvents([], (err, data) => {
      expect(err).toBeNull();
      expect(data.returnValues.subjectId).toEqual(subjectId);
      done();
    });

    await quorum.performMethod('recordConsentGivenTo', [subjectId, []]);
  });
});
