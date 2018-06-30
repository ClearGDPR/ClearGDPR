jest.mock('../../src/utils/blockchain/web3-provider-factory');
const ContractService = require('../../src/domains/management/contract/contract.service');
jest.mock('../../src/domains/management/contract/contract.service');

const { initResources, fetch, closeResources } = require('../utils');
const { managementJWT } = require('../../src/utils/jwt');
const { NotFound } = require('../../src/utils/errors');

beforeAll(initResources);
afterAll(closeResources);

describe('Getting contract details edge cases', () => {
  it('should return HTTP Not Found (404) error when contract does not exist', async () => {
    ContractService.mockImplementationOnce(() => {
      return {
        getContractDetails: () => null
      };
    });

    const token = await managementJWT.sign({ id: 1 });
    const res = await fetch('/api/management/contract/details', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(NotFound.StatusCode);
  });
});
