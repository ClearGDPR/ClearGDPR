jest.mock('../../src/utils/blockchain/web3-provider-factory');

const { initResources, fetch, closeResources, serverHost } = require('../utils');
const ws = require('ws');
const { managementJWT } = require('../../src/utils/jwt');
const { db } = require('../../src/db');
const { Unauthorized, BadRequest } = require('../../src/utils/errors');
const contractABIJson = JSON.stringify(require('../../src/utils/blockchain/contract-abi.json'));
const contractByteCode = require('../../src/utils/blockchain/contract-bytecode.js');
const { CONTRACT_CONFIG_KEY, recordConsentGivenTo, sha3 } = require('../../src/utils/blockchain');

beforeAll(initResources);
afterAll(closeResources);

describe('Deploying contract', () => {
  it('should not allow the management user to deploy contract without a token', async () => {
    const res = await fetch('/api/management/contract/deploy', {
      method: 'POST'
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it('should reject missing contract data', async () => {
    const token = await managementJWT.sign({ id: 1 });
    const contract = {};
    const res = await fetch('/api/management/contract/deploy', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: contract
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should reject bad contract JSON ABI or bytecode', async () => {
    const token = await managementJWT.sign({ id: 1 });
    const contract = {
      contractABIJson: 'bla bla bla',
      contractByteCode: 'bla bla bla'
    };

    const res = await fetch('/api/management/contract/deploy', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: contract
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should store contract details on the DB', async () => {
    const token = await managementJWT.sign({ id: 1 });
    const res = await fetch('/api/management/contract/deploy', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        contractByteCode,
        contractABIJson
      }
    });

    let result = await res.json();
    expect(result).toEqual(
      expect.objectContaining({
        address: expect.anything()
      })
    );

    const [config] = await db('config').where({ key: CONTRACT_CONFIG_KEY });
    expect(config.value).toEqual(
      expect.objectContaining({
        contractABIJson: expect.anything(),
        contractByteCode,
        address: expect.anything()
      })
    );
  });
});

describe('Getting contract details', () => {
  it('should not allow the management user to get contract details without a token', async () => {
    const res = await fetch('/api/management/contract/details', {
      method: 'GET'
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it('should return contract details from the DB', async () => {
    const token = await managementJWT.sign({ id: 1 });
    let address = '0x41412B44EC2Be0Dd147046320Dc2b0Bd09E83CB8';
    let contract = {
      contractABIJson,
      contractByteCode,
      address: address
    };

    await db.transaction(async trx => {
      const [config] = await db('config')
        .transacting(trx)
        .where({ key: CONTRACT_CONFIG_KEY });

      // handle situation when there already is a config created by other tests running in parallel
      if (!config) {
        await db('config')
          .transacting(trx)
          .insert({
            key: CONTRACT_CONFIG_KEY,
            value: JSON.stringify(contract)
          });
      } else {
        contract.contractABIJson = config.value.contractABIJson;
        contract.contractByteCode = config.value.contractByteCode;
        contract.address = config.value.address;
      }

      const res = await fetch('/api/management/contract/details', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return expect(await res.json()).toEqual(expect.objectContaining(contract));
    });
  });
});

describe('Event feed websocket', () => {
  let socketSubscription;
  beforeAll(() => {
    socketSubscription = new ws(`ws://${serverHost()}/api/management/events/feed`);
    socketSubscription.on('error', err => {
      console.error(err);
    });
  });

  it('should emit events that occur on the blockchain in nicer format', async done => {
    expect.assertions(4);
    socketSubscription.on('message', event => {
      const data = JSON.parse(event);
      expect(data.eventName).toEqual('Controller_ConsentGivenTo');
      expect(data.params.subjectId).toEqual(sha3('websocket-test'));
      expect(data.params.processorsConsented).toHaveLength(0);
      expect(data.fromName).toEqual('Master Controller Node');
      done();
    });
    await recordConsentGivenTo(sha3('websocket-test'), []);
  });

  afterAll(() => {
    socketSubscription.close();
  });
});
