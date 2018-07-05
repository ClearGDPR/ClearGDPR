jest.mock('../../src/utils/helpers');
jest.mock('../../src/utils/blockchain/web3-provider-factory', () => {
  return () => undefined;
});

let mockIsListening = jest.fn();
let mockSha3 = jest.fn();
jest.mock('web3', () => {
  return jest.fn().mockImplementation(() => {
    return {
      utils: {
        sha3: mockSha3
      },
      eth: {
        net: {
          isListening: mockIsListening
        }
      }
    };
  });
});

const helpers = require('../../src/utils/helpers');
const { waitForGeth } = require('../../src/utils/blockchain');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Waiting for geth', () => {
  it('Should check and resolve if geth is listening', async () => {
    mockIsListening.mockReturnValue(true);

    await waitForGeth();

    expect(mockIsListening).toHaveBeenCalled();
  });

  it('Should wait 5s and resolve after isListening thrown and then returned true', async () => {
    let count = 0;
    mockIsListening.mockImplementation(() => {
      if (0 === count++) {
        throw new Error('Some error');
      } else {
        return true;
      }
    });

    await waitForGeth();
    expect(helpers.timeout).toHaveBeenCalledWith(5000);
    expect(mockIsListening).toHaveBeenCalledTimes(2);
  });

  it('Should wait 5s and resolve after isListening return false and then true', async () => {
    let count = 0;
    mockIsListening.mockImplementation(() => {
      return 0 !== count++;
    });

    await waitForGeth();
    expect(helpers.timeout).toHaveBeenCalledWith(5000);
    expect(mockIsListening).toHaveBeenCalledTimes(2);
  });
});
