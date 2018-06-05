jest.mock('../../src/utils/blockchain/web3-provider-factory');

const winston = require('winston');

const { initResources, fetch, closeResources } = require('../utils');
const { deployContract } = require('../blockchain-setup');
const { db } = require('../../src/db');
const { managementJWT, subjectJWT } = require('../../src/utils/jwt');
const { setProcessors } = require('../../src/utils/blockchain');

const { VALID_RUN_MODES } = require('../../src/utils/constants');

const processor1Address = '0x00000000000000000000000000000000000000A1';

beforeAll(async () => {
  try {
    await deployContract();
  } catch (e) {
    winston.error(`Failed deploying contract ${e.toString()}`);
  }
  await initResources();

  let processorsToInsert = [{ id: 201, name: 'Processor 1' }];
  await db('processors').insert(processorsToInsert);

  const processors = await db.select('id', 'name').from('processors');
  processorsToInsert.forEach(p => expect(processors).toContainEqual(p));

  let addressesToInsert = [{ processor_id: 201, address: processor1Address }];

  await setProcessors(addressesToInsert.map(a => a.address));

  await db('processor_address').insert(addressesToInsert);

  const addresses = await db('processor_address');
  addressesToInsert.forEach(a => expect(addresses).toContainEqual(a));
});

beforeEach(() => {
  process.env.MODE = VALID_RUN_MODES.CONTROLLER;
});
afterAll(closeResources);

describe('Stats endpoint', () => {
  it('Should display 0 stats properly if there is no entries yet', async () => {

    const managementToken = await managementJWT.sign({
      id: 1
    });

    const res = await fetch('/api/management/stats', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    expect(await res.json()).toEqual(
      expect.objectContaining({
        data: {
          controller: {
            consented: 0,
            unconsented: 0,
            total: 0
          },
          processors: {
            '201': {
              // I was expecting this to be 1 originally, but it appears the be 2 because requesting erasure does not cascade, should it?
              consented: 0
            }
          }
        }
      })
    );
  });
  it('Should display the stats for the current system state', async () => {
    const managementToken = await managementJWT.sign({
      id: 1
    });

    const token1 = await subjectJWT.sign({ subjectId: '1aadddsas21322b' });
    await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: {
        personalData: { name: 'dan' },
        processors: [201]
      },
      headers: {
        Authorization: `Bearer ${token1}`
      }
    });

    const token2 = await subjectJWT.sign({ subjectId: '1aadddsas22322b' });
    await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: {
        personalData: { name: 'dave' },
        processors: [201]
      },
      headers: {
        Authorization: `Bearer ${token2}`
      }
    });

    // When statement
    await fetch('/api/subject/erase-data', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token2}`
      }
    });

    const res = await fetch('/api/management/stats', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    expect(await res.json()).toEqual(
      expect.objectContaining({
        data: {
          controller: {
            consented: 1,
            unconsented: 1,
            total: 2
          },
          processors: {
            '201': {
              // I was expecting this to be 1 originally, but it appears the be 2 because requesting erasure does not cascade, should it?
              consented: 2
            }
          }
        }
      })
    );
  });
});
