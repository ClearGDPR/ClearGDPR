jest.mock('../../src/utils/blockchain/web3-provider-factory');

const winston = require('winston');
const Promise = require('bluebird');
const { initResources, fetch, closeResources } = require('../utils');
const { deployContract } = require('../blockchain-setup');
const { subjectJWT } = require('../../src/utils/jwt');
const { db } = require('../../src/db');
const { decryptFromStorage, hash } = require('../../src/utils/encryption');
const { Unauthorized, BadRequest, NotFound } = require('../../src/utils/errors');
const {
  getSubjectDataState,
  recordConsentGivenTo,
  getIsErased,
  setProcessors
} = require('../../src/utils/blockchain');
const Blockchain = require('../../src/utils/blockchain');
const { SubjectDataStatus } = require('../../src/utils/blockchain/models');
const { VALID_RUN_MODES, DATA_STATUSES } = require('../../src/utils/constants');
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
  Blockchain.recordConsentGivenTo = recordConsentGivenTo;
  process.env.MODE = VALID_RUN_MODES.CONTROLLER;
});
afterAll(closeResources);

describe('Tests of subjects giving consent', () => {
  it('should return Unauthorized when no token is provided', async () => {
    const res = await fetch('/api/subject/consent', {
      method: 'POST',
      body: {}
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it('Should return Unauthorized when token has no subjectId', async () => {
    const token = await subjectJWT.sign({ test: '1' });
    const res = await fetch('/api/subject/consent', {
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

  it('Should return an error if the JWT token has expired', async done => {
    const token = await subjectJWT.sign({ test: '10' }, { expiresIn: 1 });
    expect.assertions(2);
    setTimeout(async () => {
      const res = await fetch('/api/subject/consent', {
        method: 'POST',
        body: {},
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      expect(res.status).toEqual(BadRequest.StatusCode);
      expect((await res.json()).error).toEqual('JWT token expired');
      done();
    }, 1100);
  });

  it('Should return Unauthorized when not in controller mode', async () => {
    process.env.MODE = VALID_RUN_MODES.PROCESSOR;
    const token = await subjectJWT.sign({ subjectId: '1aa22b' });
    const res = await fetch('/api/subject/consent', {
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

  it('Should not allow a new subject to give consent without specifying the consented processors', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '146897' });
    const personalData = { sensitiveData: 'some sensitive data' };
    const payload = {
      personalData
    };

    // When
    const res = await fetch('/api/subject/consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${subjectToken}`
      }
    });

    // Then
    expect(await res.json()).toMatchSnapshot();
  });

  it('Should not allow a new subject to give consent to a non-existent processor', async () => {
    // Given
    let subjectId = '1a2b1';
    const subjectIdHashed = hash(subjectId);
    const token = await subjectJWT.sign({ subjectId });
    const personalData = { sensitiveData: 'some sensitive data' };
    const payload = {
      personalData,
      processors: [291]
    };

    // When
    const res = await fetch('/api/subject/consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then
    expect(await res.ok).toBeFalsy();
    expect(await res.status).toBe(BadRequest.StatusCode);
    const [subject] = await db('subjects').where({ id: subjectIdHashed });
    expect(subject).toBeFalsy();
    expect(await res.json()).toEqual({
      error: 'At least one of the processors specified is not valid'
    });
  });

  it('Should not allow a new subject to give consent to a processor with no address', async () => {
    // Given
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

    // When
    const res = await fetch('/api/subject/consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then
    expect(await res.ok).toBeFalsy();
    expect(await res.status).toBe(BadRequest.StatusCode);
    const [subject] = await db('subjects').where({ id: subjectIdHashed });
    expect(subject).toBeFalsy();
    return expect(await res.json()).toEqual({
      error: `At least one of the processors doesn't have an address assigned`
    });
  });

  it('Should not allow a subject to give consent more than once', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '546857156' });
    const personalData = { sensitiveData: 'some sensitive data' };
    await fetch('/api/subject/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        personalData,
        processors: []
      }
    });

    // When
    const res = await fetch('/api/subject/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        personalData,
        processors: []
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
    expect(await res.json()).toEqual({
      error: 'Subject already gave consent'
    });
  });

  it('Should allow a new subject to give consent to controller and specified processors', async () => {
    // Given
    const token = await subjectJWT.sign({ subjectId: '1' });
    const personalData = { sensitiveData: 'some sensitive data' };
    const payload = {
      personalData,
      processors: [201, 203]
    };

    // When
    const res = await fetch('/api/subject/consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then
    let subjectIdHashed = hash('1');
    expect(await res.json()).toEqual({ success: true });
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
      addresses.map(async a => {
        expect(await getSubjectDataState(subjectIdHashed, a.address)).toBe(
          SubjectDataStatus.consented
        );
      })
    );
    // checking for controller state
    expect(await getSubjectDataState(subjectIdHashed)).toBe(SubjectDataStatus.consented);
  });

  it('Should allow a new subject to give consent only to controller and no other processor', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '9876547' });
    const personalData = { sensitiveData: 'some sensitive data' };
    const payload = {
      personalData,
      processors: []
    };

    // When
    const res = await fetch('/api/subject/consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${subjectToken}`
      }
    });

    // Then
    let subjectIdHashed = hash('9876547');
    expect(await res.json()).toEqual({ success: true });
    expect(await getSubjectDataState(subjectIdHashed)).toBe(SubjectDataStatus.consented);
    expect(await getSubjectDataState(subjectIdHashed, processor1Address)).toBe(
      SubjectDataStatus.unconsented
    );
  });

  it('Should not register consent if blockchain fails', async () => {
    // Given
    Blockchain.recordConsentGivenTo = jest.fn().mockImplementation(() => {
      throw Error('Boom!')
    });

    const subjectToken = await subjectJWT.sign({ subjectId: 'kevin-1' });
    const personalData = { sensitiveData: 'some sensitive data' };
    const payload = {
      personalData,
      processors: []
    };

    // When
    const res = await fetch('/api/subject/give-consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${subjectToken}`
      }
    });

    // Then
    let subjectIdHashed = hash('kevin-1');
    
    const [subject] = await db('subjects').where({ id: subjectIdHashed });
    expect(subject).toBeFalsy();
    expect(Blockchain.recordConsentGivenTo.mock.calls.length).toBe(1);
    expect(await getSubjectDataState(subjectIdHashed)).toBe(SubjectDataStatus.unconsented);
  });
});

describe('Tests of subjects updating their consented processors', () => {
  it('Should not allow a subject to update consent without specifying the processors consented', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '6496968798796713565' });
    await fetch('/api/subject/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        personalData: 'some sensitive data',
        processors: []
      }
    });

    // When
    const res = await fetch('/api/subject/consent', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {}
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('Should not allow an existing subject to update consent to a non-existent processor', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '54687316598649874' });
    await fetch('/api/subject/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        personalData: {
          sensitiveData: 'some sensitive data'
        },
        processors: []
      }
    });

    // When
    const res = await fetch('/api/subject/consent', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        processors: [99999999]
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toEqual({
      error: 'At least one of the processors specified is not valid'
    });
  });

  it('Should not allow an existing subject to update consent to a processor with no address', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '6754852145987' });
    await db('processors').insert({
      id: 89673521,
      name: 'No address processor'
    });
    await fetch('/api/subject/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        personalData: {
          sensitiveData: 'some sensitive data'
        },
        processors: []
      }
    });

    // When
    const res = await fetch('/api/subject/consent', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        processors: [89673521]
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toEqual({
      error: `At least one of the processors doesn't have an address assigned`
    });
  });

  it('Should not allow a non-existing subject to update consent', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '1457636849461464612' });

    // When
    const res = await fetch('/api/subject/consent', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        processors: [201, 203]
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(NotFound.StatusCode);
    expect(await res.json()).toEqual({
      error: 'Subject not found'
    });
  });

  it('Should allow an existing subject to update consent to the specified processors', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '168798764848474' });
    await fetch('/api/subject/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        personalData: {
          sensitiveData: 'some sensitive data'
        },
        processors: []
      }
    });

    // When
    const res = await fetch('/api/subject/consent', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        processors: [201, 203]
      }
    });

    // Then
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      success: true
    });
  });
});

describe('Tests of subjects erasing data and revoking consent', () => {
  it('When a subject erases his data and revokes consent, then his private key should be removed and the transaction confirmed on blockchain', async () => {
    // Given
    let subjectId = hash('8547567523');
    await db('subjects').insert({
      id: subjectId,
      personal_data:
        '7504344bd6413e6537503287529620dfce1fe9fc2b4af562c4961253b78f644187fcbc40dcf589c08c1d57baffa0bf08a9c79e39a9fb0e3eaa2bdfbcc53f07c1c55c4777dee23b31eeee78b966fc5c',
      objection: false,
      direct_marketing: true,
      email_communication: true,
      research: true
    });

    await db('subject_keys').insert({
      subject_id: subjectId,
      key:
        '40224607c20efdf1f922beb92fad5c55f6c9a3bb5cb8a64c6d8ee776ab6b7b4a0615eefa94195c59295848dbe516a118e3ad1406978ea072bf1757c4a9e2bc703904f602e12b2c2f02d1f5e7f103ced0740099c9e9fe969487aba8f2e86024f5118f3b85fea7ef24'
    });

    await recordConsentGivenTo(subjectId);
    expect(await getSubjectDataState(subjectId)).toBe(SubjectDataStatus.consented);
    const subjectToken = await subjectJWT.sign({ subjectId: '8547567523' });

    // When
    const res = await fetch('/api/subject/data', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      }
    });

    // Then
    expect(await res.json()).toEqual({ success: true });
    const [key] = await db('subject_keys').where({ subject_id: subjectId });
    expect(key).not.toBeDefined();
    expect(await getIsErased(subjectId)).toBe(true);
    expect(await getSubjectDataState(subjectId)).toBe(SubjectDataStatus.erased);
  });

  it('Should remove the consent from the processors when a subject data is erased', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '57257' });
    const personalData = {
      name: 'subject',
      email: 'subject@clevertech.biz'
    };
    const res1 = await fetch('/api/subject/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        personalData,
        processors: [201]
      }
    });

    // When
    const res2 = await fetch('/api/subject/data', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      }
    });
    const res3 = await fetch('/api/subject/data/status', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      }
    });

    // Then
    expect(res1.ok).toBeTruthy();
    expect(res1.status).toBe(200);
    expect(await res1.json()).toEqual({ success: true });
    expect(res2.ok).toBeTruthy();
    expect(res2.status).toBe(200);
    expect(await res2.json()).toEqual({ success: true });
    expect(res3.ok).toBeFalsy()
    expect(res3.status).toBe(404);
    expect(await res3.json()).toEqual(
      expect.objectContaining({ error: 'Subject is erased' })
    );
  });
});

describe('Tests of subjects getting their data status per processor', () => {
  it('Should return status of consent for each of the processors', async () => {
    // Given
    const subjectId = 'user12309';
    const idHash = hash(subjectId);
    await db('subjects').insert({
      id: idHash,
      personal_data:
        '7504344bd6413e6537503287529620dfce1fe9fc2b4af562c4961253b78f644187fcbc40dcf589c08c1d57baffa0bf08a9c79e39a9fb0e3eaa2bdfbcc53f07c1c55c4777dee23b31eeee78b966fc5c',
      objection: false,
      direct_marketing: true,
      email_communication: true,
      research: true
    });
    await db('subject_processors').insert({
      subject_id: idHash,
      processor_id: 201
    });
    await recordConsentGivenTo(idHash, [processor1Address]);
    const subjectToken = await subjectJWT.sign({ subjectId });

    // When
    const res = await fetch('/api/subject/data/status', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      }
    });

    // Then
    expect(await getSubjectDataState(idHash)).toBe(SubjectDataStatus.consented);
    expect(await getSubjectDataState(idHash, processor1Address)).toBe(SubjectDataStatus.consented);
    expect(res.ok).toBeTruthy();
    expect(await res.json()).toEqual(
      expect.objectContaining({
        controller: DATA_STATUSES.CONSENTED,
        processors: expect.arrayContaining([
          {
            id: 201,
            status: DATA_STATUSES.CONSENTED
          }
        ])
      })
    );
  });
});

describe('Tests of subjects accessing their data', () => {
  it('Should allow a subject to get his data', async () => {
    // Given
    const subjectId = 'user8kdfkkdsks';
    const subjectToken = await subjectJWT.sign({ subjectId: subjectId });
    const personalData = {
      name: 'Dan Dan Dan',
      address: 'Yesterday'
    };
    const payload = {
      personalData,
      processors: []
    };
    await fetch('/api/subject/consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${subjectToken}`
      }
    });

    // When
    const res = await fetch('/api/subject/data', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      }
    });

    // Then
    const data = await res.json();
    expect(data).toEqual(expect.objectContaining(payload.personalData));
  });

  it('Should give a useful error if the user has erased their data', async () => {
    // Given
    const subjectId = 'user8dsdsaqqw';
    const token = await subjectJWT.sign({ subjectId: subjectId });
    const personalData = {
      name: 'Dan Dan Dan 2',
      address: 'Tomorrow'
    };
    const payload = {
      personalData,
      processors: []
    };
    await fetch('/api/subject/consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const res = await fetch('/api/subject/data', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    const res2 = await fetch('/api/subject/data', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // When
    const res3 = await fetch('/api/subject/data', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then
    expect(data).toEqual(expect.objectContaining(payload.personalData));
    expect(res2.status).toEqual(200);
    expect(res3.status !== 500).toEqual(true);
    expect(res3.status).toEqual(404);
  });
});

describe('Tests of subjects initiating rectifications', () => {
  it('Should allow a subject to begin the rectification process', async () => {
    // Given
    const id = '2-4';
    const token = await subjectJWT.sign({ subjectId: id });
    const payload = {
      personalData: {},
      processors: []
    };
    await fetch('/api/subject/consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // When
    const res = await fetch('/api/subject/rectification', {
      method: 'POST',
      body: { rectificationPayload: { name: 'dave' }, requestReason: 'my name is dave' },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then
    expect(res.status).toEqual(200);
    const [requestData] = await db('rectification_requests').where({ subject_id: hash(id) });
    await db('subject_keys').where({ subject_id: hash(id) });
    expect(requestData.request_reason).toEqual('my name is dave');
    expect(requestData.status).toEqual('PENDING');
  });

  it('Store the update payload in an encrypted format', async () => {
    // Given
    const id = '2-1';
    const token = await subjectJWT.sign({ subjectId: id });
    const payload = {
      personalData: {},
      processors: []
    };
    await fetch('/api/subject/consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // When
    const res = await fetch('/api/subject/rectification', {
      method: 'POST',
      body: { rectificationPayload: { name: 'dave' }, requestReason: 'my name is dave' },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then
    expect(res.status).toEqual(200);
    const [requestData] = await db('rectification_requests').where({ subject_id: hash(id) });
    const [subjectKey] = await db('subject_keys').where({ subject_id: hash(id) });
    expect(
      JSON.parse(decryptFromStorage(requestData.encrypted_rectification_payload, subjectKey.key))
    ).toEqual({
      name: 'dave'
    });
  });

  it('Error if error reason and payload are not provided', async () => {
    // Given
    const id = '2-5';
    const token = await subjectJWT.sign({ subjectId: id });
    const payload = {
      personalData: {},
      processors: []
    };
    await fetch('/api/subject/consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // When
    const res = await fetch('/api/subject/rectification', {
      method: 'POST',
      body: {},
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then
    const body = await res.json();
    expect(res.status).toEqual(400);
    expect(body).toMatchSnapshot();
  });

  it('Should error if the subject has no key', async () => {
    // Given
    const id = '2-3';
    const token = await subjectJWT.sign({ subjectId: id });
    const payload = {
      personalData: {},
      processors: []
    };
    await fetch('/api/subject/consent', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    await db('subject_keys')
      .where({ subject_id: hash(id) })
      .delete();

    // When
    const res = await fetch('/api/subject/rectification', {
      method: 'POST',
      body: { rectificationPayload: { name: 'dave' }, requestReason: 'my name is dave' },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Then
    const body = await res.json();
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(404);
    expect(body.error).toEqual('Subject keys not found');
  });
});

describe('Tests of subjects restricting the processing of their data', () => {
  it('Should not allow a subject that has given consent to restrict without specifying the actions to restrict', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '6947987194298749879' });
    await fetch('/api/subject/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        personalData: {
          sensitiveData: 'some sensitive data'
        },
        processors: []
      }
    });

    // When
    const res = await fetch('/api/subject/restrictions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {} // Empty
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('Should not allow a subject that has not given consent to restrict', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '98489719179871' });

    // When
    const res = await fetch('/api/subject/restrictions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        directMarketing: true,
        emailCommunication: false,
        research: false
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(NotFound.StatusCode);
    expect(await res.json()).toEqual({
      error: 'Subject not found'
    });
  });

  it('Should allow a subject that has given consent to restrict the processing of his data', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '124589635745498' });
    await fetch('/api/subject/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        personalData: {
          sensitiveData: 'some sensitive data'
        },
        processors: []
      }
    });

    // When
    const res = await fetch('/api/subject/restrictions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        directMarketing: true,
        emailCommunication: false,
        research: true
      }
    });

    // Then
    expect(res.ok).toBeTruthy();
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({
      success: true
    });
  });
});

describe('Tests of subjects getting their restrictons', () => {
  it('Should not allow a subject that has not given consent to get restrictions', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '989874937987987' });

    // When
    const res = await fetch('/api/subject/restrictions', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(NotFound.StatusCode);
    expect(await res.json()).toEqual({
      error: 'Subject not found'
    });
  });

  it('Should allow a subject that has given consent to get his restrictions', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '989874937987987' });
    await fetch('/api/subject/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        personalData: {
          sensitiveData: 'some sensitive data'
        },
        processors: []
      }
    });

    // When
    const res = await fetch('/api/subject/restrictions', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      }
    });

    // Then
    expect(res.ok).toBeTruthy();
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({
      directMarketing: true,
      emailCommunication: true,
      research: true
    });
  });
});

describe('Tests of subjects objecting to the processing of their data', () => {
  it('Should not allow a subject that has given consent to object without specifying the objection', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '641698719871987' });
    await fetch('/api/subject/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        personalData: {
          sensitiveData: 'some sensitive data'
        },
        processors: []
      }
    });

    // When
    const res = await fetch('/api/subject/object', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {} // Empty
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('Should not allow a subject that has not given consent to object', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '9619879879847987' });

    // When
    const res = await fetch('/api/subject/object', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        objection: true
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(NotFound.StatusCode);
    expect(await res.json()).toEqual({
      error: 'Subject not found'
    });
  });

  it('Should allow a subject that has given consent to object to the processing of his data', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '68149879879817982' });
    await fetch('/api/subject/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        personalData: {
          sensitiveData: 'some sensitive data'
        },
        processors: []
      }
    });

    // When
    const res = await fetch('/api/subject/object', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        objection: true
      }
    });

    // Then
    expect(res.ok).toBeTruthy();
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({
      success: true
    });
  });
});

describe('Tests of subjects getting their objection status', () => {
  it('Should not allow a subject that has not given consent to get his objection status', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '124785212598348' });

    // When
    const res = await fetch('/api/subject/objection', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(NotFound.StatusCode);
    expect(await res.json()).toEqual({
      error: 'Subject not found'
    });
  });

  it('Should allow a subject that has given consent to get his objection status', async () => {
    // Given
    const subjectToken = await subjectJWT.sign({ subjectId: '6546873212765469874' });
    await fetch('/api/subject/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      },
      body: {
        personalData: {
          sensitiveData: 'some sensitive data'
        },
        processors: []
      }
    });

    // When
    const res = await fetch('/api/subject/objection', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${subjectToken}`
      }
    });

    // Then
    expect(res.ok).toBeTruthy();
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({
      objection: false
    });
  });
});
