jest.mock('../../src/utils/blockchain/web3-provider-factory');
jest.mock('../../src/utils/helpers');

const encryption = require('../../src/utils/encryption');
const { initResources, fetch, closeResources } = require('../utils');
const { deployContract } = require('../blockchain-setup');
const { processorJWT } = require('../../src/utils/jwt');
const { db } = require('../../src/db');
const { encryptForStorage, hash } = require('../../src/utils/encryption');
const { Unauthorized, BadRequest, ValidationError } = require('../../src/utils/errors');
const helpers = require('../../src/utils/helpers');

const PROCESSOR_ID = 1;

beforeAll(async () => {
  helpers.getMyAddress.mockReturnValue(process.env.MY_ADDRESS);
  await deployContract();
  await initResources();

  await db('processors').insert({
    id: PROCESSOR_ID,
    name: 'test'
  });
});

afterAll(closeResources);

describe('List subjects that have given consent', () => {
  it('should not allow a processor to list subjects without a processor JWT', async () => {
    //GIVEN AND WHEN
    const res = await fetch('/api/processors/subjects', {
      method: 'GET',
      headers: {}
    });

    //THEN
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        error: 'Authorization header not sent'
      })
    );
  });

  it('should not allow a processor to list subjects with an invalid processor JWT', async () => {
    //GIVEN AND WHEN
    const res = await fetch('/api/processors/subjects', {
      method: 'GET',
      headers: {
        Authorization: `invalid_token`
      }
    });

    //THEN
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        error: 'Authorization header failed verification'
      })
    );
  });

  it('should not allow an authentic processor to list subjects which didnt give consent', async () => {
    //GIVEN
    const subjectData = {
      username: 'subject',
      email: 'subject@clevertech.biz'
    };
    const encryptionKey = encryption.generateClientKey();
    const encryptedSubjectData = encryptForStorage(JSON.stringify(subjectData), encryptionKey);
    const subjectIdHash = hash('user458246'); // Random ID to not influence other tests

    await db('subjects').insert({
      id: subjectIdHash,
      personal_data: encryptedSubjectData,
      objection: false,
      direct_marketing: true,
      email_communication: true,
      research: true
    });

    await db('subject_keys').insert({
      subject_id: subjectIdHash,
      key: encryption.generateClientKey()
    });

    //WHEN
    const processorToken = await processorJWT.sign({ id: PROCESSOR_ID });
    const res = await fetch('/api/processors/subjects', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${processorToken}`
      }
    });

    //THEN
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data).toHaveLength(0);
  });

  it('should allow an authentic processor to list subjects which did give consent', async () => {
    //GIVEN
    const subjectData = {
      username: 'subject',
      email: 'subject@clevertech.biz'
    };
    const encryptionKey = encryption.generateClientKey();
    const encryptedSubjectData = encryptForStorage(JSON.stringify(subjectData), encryptionKey);
    const subjectIdHash = hash('user458247'); // Random ID to not influence other tests

    await db('subjects').insert({
      id: subjectIdHash,
      personal_data: encryptedSubjectData,
      objection: false,
      direct_marketing: true,
      email_communication: true,
      research: true
    });

    await db('subject_keys').insert({
      subject_id: subjectIdHash,
      key: encryption.generateClientKey()
    });

    await db('subject_processors').insert({
      subject_id: subjectIdHash,
      processor_id: PROCESSOR_ID
    });

    //WHEN
    const processorToken = await processorJWT.sign({ id: PROCESSOR_ID });
    const res = await fetch('/api/processors/subjects', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${processorToken}`
      }
    });

    //THEN
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data).toHaveLength(1);
  });

  it('should not allow an authentic processor to list subjects which dont have an encryption key', async () => {
    //GIVEN
    const subjectData = {
      username: 'subject',
      email: 'subject@clevertech.biz'
    };
    const encryptionKey = encryption.generateClientKey();
    const encryptedSubjectData = encryptForStorage(JSON.stringify(subjectData), encryptionKey);
    const subjectIdHash = hash('user458248'); // Random ID to not influence other tests

    await db('subjects').insert({
      id: subjectIdHash,
      personal_data: encryptedSubjectData,
      objection: false,
      direct_marketing: true,
      email_communication: true,
      research: true
    });

    await db('subject_keys').insert({
      subject_id: subjectIdHash,
      key: '' // Empty encryption key in the DB implies that the subject should not be listed
    });

    await db('subject_processors').insert({
      subject_id: subjectIdHash,
      processor_id: PROCESSOR_ID
    });

    //WHEN
    const processorToken = await processorJWT.sign({ id: PROCESSOR_ID });
    const res = await fetch('/api/processors/subjects', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${processorToken}`
      }
    });

    //THEN
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(await res.json()).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: {
            username: 'subject',
            email: 'subject@clevertech.biz'
          }
        })
      ])
    );
  });

  it('should not allow an authentic processor to list subjects which have an invalid encryption key', async () => {
    //GIVEN
    const subjectData = {
      username: 'subject',
      email: 'subject@clevertech.biz'
    };
    const encryptionKey = encryption.generateClientKey();
    const encryptedSubjectData = encryptForStorage(JSON.stringify(subjectData), encryptionKey);
    const subjectIdHash = hash('user125469853'); // Random ID to not influence other tests

    await db('subjects').insert({
      id: subjectIdHash,
      personal_data: encryptedSubjectData,
      objection: false,
      direct_marketing: true,
      email_communication: true,
      research: true
    });

    await db('subject_keys').insert({
      subject_id: subjectIdHash,
      key: 'invalid_encryption_key' // Invalid encryption key in the DB implies that the subject should not be listed
    });

    await db('subject_processors').insert({
      subject_id: subjectIdHash,
      processor_id: PROCESSOR_ID
    });

    //WHEN
    const processorToken = await processorJWT.sign({ id: PROCESSOR_ID });
    const res = await fetch('/api/processors/subjects', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${processorToken}`
      }
    });

    //THEN
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(await res.json()).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: {
            username: 'subject',
            email: 'subject@clevertech.biz'
          }
        })
      ])
    );
  });

  it('should not allow a page query with the zero page number', async () => {
    //WHEN
    const processorToken = await processorJWT.sign({ id: PROCESSOR_ID });

    const res = await fetch('/api/processors/subjects?page=0', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${processorToken}`
      }
    });

    //THEN
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow a page query with a page number too big', async () => {
    //WHEN
    const processorToken = await processorJWT.sign({ id: PROCESSOR_ID });

    const res = await fetch('/api/processors/subjects?page=99999999999999', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${processorToken}`
      }
    });

    //THEN
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(ValidationError.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        error: 'page number too big, maximum page number is 1'
      })
    );
  });
});

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
    // Given
    const key = encryption.generateClientKey();
    const testData = { test: 'true' };
    const subjectId = hash('p1');
    await db('subjects').insert({
      id: subjectId,
      personal_data: encryptForStorage(JSON.stringify(testData), key),
      objection: false,
      direct_marketing: true,
      email_communication: true,
      research: true
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

    // When
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
      personal_data: encryptForStorage(JSON.stringify(testData), key),
      objection: false,
      direct_marketing: true,
      email_communication: true,
      research: true
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
});
