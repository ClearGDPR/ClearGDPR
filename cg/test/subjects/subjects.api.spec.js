jest.mock('../../src/utils/blockchain/web3-provider-factory');

const encryption = require('./../../src/utils/encryption');
const winston = require('winston');
const Promise = require('bluebird');
const { initResources, fetch, closeResources } = require('../utils');
const { deployContract } = require('../blockchain-setup');
const { subjectJWT } = require('../../src/utils/jwt');
const { db } = require('../../src/db');
const { decryptFromStorage, hash } = require('../../src/utils/encryption');
const { Unauthorized, BadRequest } = require('../../src/utils/errors');
const {
  getSubjectDataState,
  recordConsentGivenTo,
  getIsErased,
  setProcessors
} = require('../../src/utils/blockchain');
const { SubjectDataStatus } = require('../../src/utils/blockchain/models');

const { VALID_RUN_MODES } = require('../../src/utils/constants');

const processor1Address = '0x00000000000000000000000000000000000000A1';
const processor2Address = '0x00000000000000000000000000000000000000A2';
const processor3Address = '0x00000000000000000000000000000000000000A3';

beforeAll(async () => {
  try {
    await deployContract();
  } catch (e) {
    winston.error(`Failed deploying contract ${e.toString()}`);
  }
  await initResources();

  let processorsToInsert = [
    { id: 201, name: 'Processor 1' },
    { id: 202, name: 'Processor 2' },
    { id: 203, name: 'Processor 3' }
  ];
  await db('processors').insert(processorsToInsert);

  const processors = await db.select('id', 'name').from('processors');
  processorsToInsert.forEach(p => expect(processors).toContainEqual(p));

  let addressesToInsert = [
    { processor_id: 201, address: processor1Address },
    { processor_id: 202, address: processor2Address },
    { processor_id: 203, address: processor3Address }
  ];

  await setProcessors(addressesToInsert.map(a => a.address));

  await db('processor_address').insert(addressesToInsert);

  const addresses = await db('processor_address');
  addressesToInsert.forEach(a => expect(addresses).toContainEqual(a));
});

beforeEach(() => {
  process.env.MODE = VALID_RUN_MODES.CONTROLLER;
});

afterAll(closeResources);

describe('Tests of subject giving consent', () => {
  it('should return Unauthorized, when no token is provided', async () => {
    const res = await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: {}
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it('should return Unauthorized, token has no subjectId', async () => {
    const token = await subjectJWT.sign({ test: '1' });
    const res = await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: {},
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        error: 'You are not authorized to perform this action'
      })
    );
  });

  it('should return Unauthorized when not in controller mode', async () => {
    process.env.MODE = VALID_RUN_MODES.PROCESSOR;

    const token = await subjectJWT.sign({ subjectId: '1aa22b' });
    const res = await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: {},
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
    expect(await res.json()).toEqual({
      error: 'This route is only available to controller nodes'
    });
  });

  it('new subject gives consent to process her data', async () => {
    // Given (Arrange)

    // When (Act)
    const token = await subjectJWT.sign({ subjectId: '1' });
    const personalData = { sensitiveData: 'some sensitive data' };
    const payload = {
      personalData,
      processors: [201, 203]
    };

    const res = await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then (Assert)
    let subjectIdHashed = hash('1');

    expect(await res.text()).toEqual('OK');
    const [subject] = await db('subjects').where({ id: subjectIdHashed });
    expect(subject).toBeTruthy();
    expect(subject.personal_data).not.toBe(JSON.stringify(personalData));

    const [key] = await db('subject_keys').where({ subject_id: subjectIdHashed });
    expect(key).toBeTruthy();
    let decryptedJson = decryptFromStorage(subject.personal_data, key.key);
    const decryptedPersonalData = JSON.parse(decryptedJson);

    expect(decryptedPersonalData).toEqual(expect.objectContaining(personalData));

    const processors = await db('subject_processors').where({ subject_id: subjectIdHashed });

    // check that mappings have been created for each processor
    payload.processors.forEach(id => expect(processors.map(p => p.processor_id)).toContain(id));

    const addresses = await db
      .from('processor_address')
      .innerJoin(
        'subject_processors',
        'processor_address.processor_id',
        'subject_processors.processor_id'
      )
      .where('subject_processors.subject_id', '=', subjectIdHashed)
      .select('processor_address.address');

    // checking for each processor state
    await Promise.all(
      addresses.map(async a =>
        expect(await getSubjectDataState(subjectIdHashed, a.address)).toBe(
          SubjectDataStatus.shareable
        )
      )
    );
    // checking for controller state
    expect(await getSubjectDataState(subjectIdHashed)).toBe(SubjectDataStatus.shareable);
  });

  it('new subject gives consent to process her data with no processors provided', async () => {
    // Given (Arrange)

    // When (Act)
    const token = await subjectJWT.sign({ subjectId: '1' });
    const personalData = { sensitiveData: 'some sensitive data' };
    const payload = {
      personalData
    };

    const res = await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then (Assert)
    let subjectIdHashed = hash('1');

    expect(await res.text()).toEqual('OK');

    expect(await getSubjectDataState(subjectIdHashed)).toBe(SubjectDataStatus.shareable);
    expect(await getSubjectDataState(subjectIdHashed, processor1Address)).toBe(
      SubjectDataStatus.notShareable
    );
  });

  it('new subject gives consent to process her data with an empty processor list provided', async () => {
    // Given (Arrange)

    // When (Act)
    const token = await subjectJWT.sign({ subjectId: '1' });
    const personalData = { sensitiveData: 'some sensitive data' };
    const payload = {
      personalData,
      processors: []
    };

    const res = await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then (Assert)
    let subjectIdHashed = hash('1');

    expect(await res.text()).toEqual('OK');

    expect(await getSubjectDataState(subjectIdHashed)).toBe(SubjectDataStatus.shareable);
    expect(await getSubjectDataState(subjectIdHashed, processor1Address)).toBe(
      SubjectDataStatus.notShareable
    );
  });

  it('extending consent to more processors', async () => {
    let subjectId = '1a2b';
    let subjectIdHashed = hash(subjectId);

    const token = await subjectJWT.sign({ subjectId });
    const personalData = { sensitiveData: 'some sensitive data' };
    const payload = {
      personalData,
      processors: [201]
    };

    let res = await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(await res.text()).toEqual('OK');

    payload.processors = [201, 203];

    res = await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(await res.text()).toEqual('OK');

    expect(await getSubjectDataState(subjectIdHashed)).toBe(SubjectDataStatus.shareable);
    expect(await getSubjectDataState(subjectIdHashed, processor1Address)).toBe(
      SubjectDataStatus.shareable
    );
    expect(await getSubjectDataState(subjectIdHashed, processor3Address)).toBe(
      SubjectDataStatus.shareable
    );
  });

  it('giving consent to non-existent processor', async () => {
    let subjectId = '1a2b1';
    const subjectIdHashed = hash(subjectId);

    const token = await subjectJWT.sign({ subjectId });
    const personalData = { sensitiveData: 'some sensitive data' };
    const payload = {
      personalData,
      processors: [291]
    };

    const res = await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(await res.ok).toBeFalsy();
    expect(await res.status).toBe(BadRequest.StatusCode);

    const [subject] = await db('subjects').where({ id: subjectIdHashed });
    expect(subject).toBeFalsy();

    return expect(await res.json()).toEqual({
      error: 'Specified processor does not exist.'
    });
  });

  it('giving consent to processor with no address', async () => {
    let subjectId = '1a2b2';
    const subjectIdHashed = hash(subjectId);

    await db('processors').insert({
      id: 299,
      name: 'No address processor'
    });

    const token = await subjectJWT.sign({ subjectId });
    const personalData = { sensitiveData: 'some sensitive data' };
    const payload = {
      personalData,
      processors: [299]
    };

    const res = await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(await res.ok).toBeFalsy();
    expect(await res.status).toBe(BadRequest.StatusCode);

    const [subject] = await db('subjects').where({ id: subjectIdHashed });
    expect(subject).toBeFalsy();

    return expect(await res.json()).toEqual({
      error: `At least one of the processors doesn't have an address assigned`
    });
  });

  it('existing subject gives consent to process her data', async () => {
    // Given
    let subjectIdHash = hash('123');
    const encryptionKey = encryption.generateClientKey();
    await db('subjects').insert({
      id: subjectIdHash,
      personal_data: ''
    });

    await db('subject_keys').insert({
      subject_id: subjectIdHash,
      key: encryptionKey
    });

    // When
    const token = await subjectJWT.sign({ subjectId: '123' });
    const personalData = { sensitiveData: true };
    const res = await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: {
        personalData,
        processors: [201]
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then
    expect(await res.text()).toEqual('OK');
    const [subject] = await db('subjects').where({ id: subjectIdHash });
    const [key] = await db('subject_keys').where({ subject_id: subjectIdHash });

    let decryptedJson = decryptFromStorage(subject.personal_data, key.key);
    const decryptedPersonalData = JSON.parse(decryptedJson);

    expect(decryptedPersonalData).toEqual(expect.objectContaining(personalData));
    expect(await getSubjectDataState(subjectIdHash)).toBe(SubjectDataStatus.shareable);
    expect(await getSubjectDataState(subjectIdHash, processor1Address)).toBe(
      SubjectDataStatus.shareable
    );
  });

  it('existing subject gives consent to process her data does not affect other subjects', async () => {
    // Given
    let subjectIdHash = hash('123a');
    await db('subjects').insert({
      id: subjectIdHash,
      personal_data: ''
    });

    await db('subject_keys').insert({
      subject_id: subjectIdHash,
      key: encryption.generateClientKey()
    });

    await db('subjects').insert({
      id: hash('123b'),
      personal_data: 'abc'
    });

    await db('subject_keys').insert({
      subject_id: hash('123b'),
      key: 'abcd'
    });

    // When
    const token = await subjectJWT.sign({ subjectId: '123a' });
    const personalData = { sensitiveData: 'some new sensitive data', more: 'with two keys' };
    const payload = {
      personalData,
      processors: [201]
    };

    const res = await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then
    expect(await res.text()).toEqual('OK');
    const [subject] = await db('subjects').where({ id: hash('123b') });
    const [key] = await db('subject_keys').where({ subject_id: hash('123b') });

    expect(subject).toEqual(
      expect.objectContaining({
        personal_data: 'abc'
      })
    );

    expect(key).toEqual(
      expect.objectContaining({
        key: 'abcd'
      })
    );

    expect(await getSubjectDataState(subjectIdHash)).toBe(SubjectDataStatus.shareable);
    expect(await getSubjectDataState(subjectIdHash, processor1Address)).toBe(
      SubjectDataStatus.shareable
    );
  });

  it('existing subject without key gives consent to process her data', async () => {
    // Given
    let subjectIdHash = hash('1235a');
    await db('subjects').insert({
      id: subjectIdHash,
      personal_data:
        '7504344bd6413e6537503287529620dfce1fe9fc2b4af562c4961253b78f644187fcbc40dcf589c08c1d57baffa0bf08a9c79e39a9fb0e3eaa2bdfbcc53f07c1c55c4777dee23b31eeee78b966fc5c'
    });

    // When
    const token = await subjectJWT.sign({ subjectId: '1235a' });
    const personalData = {
      sensitiveData: 'some new sensitive data for John',
      more: 'with more keys'
    };
    const res = await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: {
        personalData,
        processors: [201]
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then
    expect(await res.text()).toEqual('OK');
    const [subject] = await db('subjects').where({ id: subjectIdHash });
    const [key] = await db('subject_keys').where({ subject_id: subjectIdHash });

    let decryptedJson = decryptFromStorage(subject.personal_data, key.key);
    const decryptedPersonalData = JSON.parse(decryptedJson);

    expect(decryptedPersonalData).toEqual(expect.objectContaining(personalData));

    expect(await getSubjectDataState(subjectIdHash)).toBe(SubjectDataStatus.shareable);
    expect(await getSubjectDataState(subjectIdHash, processor1Address)).toBe(
      SubjectDataStatus.shareable
    );
  });
});

describe('Tests of subject erasing data and revoking consent', () => {
  it('when subject erases data and revokes consent, then private key should be removed and transaction confirmed on blockchain', async () => {
    // Given
    let subjectId = hash('87abc');
    await db('subjects').insert({
      id: subjectId,
      personal_data:
        '7504344bd6413e6537503287529620dfce1fe9fc2b4af562c4961253b78f644187fcbc40dcf589c08c1d57baffa0bf08a9c79e39a9fb0e3eaa2bdfbcc53f07c1c55c4777dee23b31eeee78b966fc5c'
    });

    await db('subject_keys').insert({
      subject_id: subjectId,
      key:
        '40224607c20efdf1f922beb92fad5c55f6c9a3bb5cb8a64c6d8ee776ab6b7b4a0615eefa94195c59295848dbe516a118e3ad1406978ea072bf1757c4a9e2bc703904f602e12b2c2f02d1f5e7f103ced0740099c9e9fe969487aba8f2e86024f5118f3b85fea7ef24'
    });

    await recordConsentGivenTo(subjectId);
    expect(await getSubjectDataState(subjectId)).toBe(SubjectDataStatus.shareable);

    const token = await subjectJWT.sign({ subjectId: '87abc' });

    // When statement
    const res = await fetch('/api/subject/erase-data', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then (Assert)
    expect(await res.text()).toEqual('OK');
    const [key] = await db('subject_keys').where({ subject_id: subjectId });
    expect(key).not.toBeDefined();
    expect(await getIsErased(subjectId)).toBe(true);
    expect(await getSubjectDataState(subjectId)).toBe(SubjectDataStatus.erased);
  });
});

describe('Get data status', () => {
  it('should return status of consent for each of the processors', async () => {
    const subjectId = 'user12309';
    const idHash = hash(subjectId);
    await db('subjects').insert({
      id: idHash,
      personal_data:
        '7504344bd6413e6537503287529620dfce1fe9fc2b4af562c4961253b78f644187fcbc40dcf589c08c1d57baffa0bf08a9c79e39a9fb0e3eaa2bdfbcc53f07c1c55c4777dee23b31eeee78b966fc5c'
    });

    await db('subject_processors').insert({
      subject_id: idHash,
      processor_id: 201
    });

    await recordConsentGivenTo(idHash, [processor1Address]);
    expect(await getSubjectDataState(idHash)).toBe(SubjectDataStatus.shareable);
    expect(await getSubjectDataState(idHash, processor1Address)).toBe(SubjectDataStatus.shareable);

    const token = await subjectJWT.sign({ subjectId });

    const res = await fetch('/api/subject/data-status', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(res.ok).toBeTruthy();
    expect(await res.json()).toEqual(
      expect.objectContaining({
        controller: SubjectDataStatus.shareable,
        processors: expect.arrayContaining([
          {
            id: 201,
            status: SubjectDataStatus.shareable
          }
        ])
      })
    );
  });

  describe('Get Data', () => {
    it('Should allow the user to get their data', async () => {
      const subjectId = 'user8kdfkkdsks';
      const token = await subjectJWT.sign({ subjectId: subjectId });
      const personalData = {
        name: 'Dan Dan Dan',
        address: 'Yesterday'
      };
      const payload = {
        personalData,
        processors: []
      };

      await fetch('/api/subject/give-consent', {
        method: 'POST',
        body: payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const res = await fetch('/api/subject/access-data', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      expect(data).toEqual(expect.objectContaining(payload.personalData));
    });
  });
});
