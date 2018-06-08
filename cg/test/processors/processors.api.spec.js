jest.mock('../../src/utils/blockchain/web3-provider-factory');
jest.mock('../../src/utils/helpers');
const encryption = require('./../../src/utils/encryption');

const { initResources, fetch, closeResources } = require('../utils');
const { deployContract } = require('../blockchain-setup');
const { processorJWT } = require('../../src/utils/jwt');
const { db } = require('../../src/db');
const { encryptForStorage, hash } = require('../../src/utils/encryption');
const { Unauthorized } = require('../../src/utils/errors');
const helpers = require('./../../src/utils/helpers');

beforeAll(async () => {
  helpers.getMyAddress.mockReturnValue(process.env.MY_ADDRESS);
  await deployContract();
  await initResources();
});

afterAll(closeResources);

describe('Processor requesting data', () => {
  beforeEach(() => {
    helpers.inControllerMode.mockImplementation(() => true);
  });
  it('should not allow the processor to request data without a token', async () => {
    const res = await fetch(`/api/processors/subject/${hash('p1')}/data`, {
      method: 'GET'
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it('should not allow access if token payload does not have id', async () => {
    const token = await processorJWT.sign({ somethingElse: 1201 });
    const res = await fetch('/api/processors/subject/1000000/data', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it("should not allow the processor to request data for a subject they don't have access to", async () => {
    const token = await processorJWT.sign({ id: 1201 });
    const res = await fetch('/api/processors/subject/1000000/data', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it('should respond with the decrypted data for the subject requested', async () => {
    const key = encryption.generateClientKey();
    const testData = { test: 'true' };
    const subjectId = hash('p1');
    await db('subjects').insert({
      id: subjectId,
      personal_data: encryptForStorage(JSON.stringify(testData), key)
    });

    await db('subject_keys').insert({
      subject_id: subjectId,
      key
    });
    const processorAddress = '0xbdbb934b68b14559630c7036cd5c2891e823b4ba';
    await db('processors').insert({ id: 1201, name: 'test' });
    await db('processor_address').insert({
      processor_id: 1201,
      address: processorAddress
    });

    await db('subject_processors').insert({ subject_id: subjectId, processor_id: 1201 });

    const token = await processorJWT.sign({ id: 1201 });
    const res = await fetch(`/api/processors/subject/${subjectId}/data`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(await res.json()).toEqual(expect.objectContaining(testData));
  });

  it('should deny access to subject data if the node is not a controller', async () => {
    helpers.inControllerMode.mockImplementation(() => false);
    const key = encryption.generateClientKey();
    const testData = { test: 'true' };
    await db('subjects').insert({
      id: hash('p2'),
      personal_data: encryptForStorage(JSON.stringify(testData), key)
    });

    await db('subject_keys').insert({
      subject_id: hash('p2'),
      key
    });

    const token = await processorJWT.sign({ id: 1201 });
    const res = await fetch(`/api/processors/subject/${hash('p2')}/data`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    expect(res.status).toEqual(401);
  });
});

describe('Processor requesting contract details', () => {
  it('should not allow the processor to request contract details without a token', async () => {
    const res = await fetch(`/api/processors/contract/details`, {
      method: 'GET'
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  // no need to test more IMO, because the controller does exact same thing as the one in management domain (if we don't need it
  // there we can move the service method code)
});
