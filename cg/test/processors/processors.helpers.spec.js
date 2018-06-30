jest.mock('../../src/utils/helpers');
jest.mock('../../src/domains/processors/processors.requests');
jest.mock('../../src/domains/shared-kernel/config.repository');

const { CONTRACT_CONFIG_KEY } = require('../../src/utils/blockchain');
const helpers = require('../../src/utils/helpers');
const requests = require('../../src/domains/processors/processors.requests');
const configRepository = require('../../src/domains/shared-kernel/config.repository');
const processorHelpers = require('../../src/domains/processors/processors.helpers');

beforeEach(() => {
  helpers.inControllerMode.mockClear();
  requests.getContractDetails.mockClear();
  configRepository.updateConfig.mockClear();
});

describe('Waiting for contract from controller', () => {
  it('should store contract details when a contract has been fetched', async done => {
    const contractDetails = {
      contractABIJson: '{}',
      contractByteCode: '0x000001',
      address: '0x00000000000000000000000000000000000000C1'
    };

    requests.getContractDetails.mockImplementation(() => {
      return contractDetails;
    });

    const interval = processorHelpers.pollForContractUpdate();
    expect.assertions(1);
    setTimeout(() => {
      expect(configRepository.updateConfig).toHaveBeenCalledWith(
        CONTRACT_CONFIG_KEY,
        JSON.stringify(contractDetails)
      );
      done();
    }, 2000);
    afterAll(() => {
      clearInterval(interval);
    });
  });

  it('Should block until a contract appears in the db', async done => {
    const contractDetails = {
      contractABIJson: '{}',
      contractByteCode: '0x000001',
      address: '0x00000000000000000000000000000000000000C1'
    };
    configRepository.getConfig.mockImplementation(() => {
      return contractDetails;
    });

    await processorHelpers.blockUntilContractReady();
    done();
  });
});
