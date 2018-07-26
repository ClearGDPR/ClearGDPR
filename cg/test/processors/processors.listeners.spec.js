jest.mock('../../src/utils/blockchain/web3-provider-factory');
jest.mock('../../src/utils/blockchain/quorum-contract');
jest.mock('../../src/utils/helpers');
jest.mock('../../src/domains/processors/processors.helpers');

const encryption = require('./../../src/utils/encryption');
const { initResources, closeResources } = require('../utils');
const { deployContract } = require('../blockchain-setup');
const { startAll } = require('../../src/domains/processors/processors.listeners');
const { db } = require('../../src/db');
const { encryptForStorage, decryptFromStorage } = require('../../src/utils/encryption');
const {
  recordErasureByController,
  recordConsentGivenTo,
  recordRectificationByController,
  recordRestrictionByController,
  recordObjectionByController,
  sha3,
  setProcessors,
  getSubjectDataState
} = require('../../src/utils/blockchain');
const { SubjectDataStatus } = require('../../src/utils/blockchain/models');
const processorHelpers = require('../../src/domains/processors/processors.helpers');
const helpers = require('./../../src/utils/helpers');
const realHelpers = require.requireActual('./../../src/utils/helpers');
const nock = require('nock');

beforeAll(async () => {
  helpers.getMyAddress.mockReturnValue(process.env.MY_ADDRESS);
  helpers.retryAsync.mockImplementation(realHelpers.retryAsync);
  await deployContract();
  await initResources();
  helpers.inControllerMode.mockImplementation(() => false);
  processorHelpers.blockUntilContractReady.mockImplementationOnce(() => true);
  await startAll();
});
afterEach(async () => {
  nock.cleanAll();
  await db('subject_keys').del();
  await db('subjects').del();
});
afterAll(closeResources);

describe('Processors listening for blockchain events', () => {
  it('should listen to the erasureRequest event', async done => {
    helpers.inControllerMode.mockImplementation(() => false);
    helpers.getMyAddress.mockImplementation(() => '0xedbbe1fa6bc80f55c9ac7e351b777874142baaf8');

    // trigger event
    const key = encryption.generateClientKey();

    const subjectId = sha3('12828282');

    await db('subjects').insert({
      id: subjectId,
      personal_data: encryptForStorage(JSON.stringify({ test: true }), key),
      objection: false,
      direct_marketing: true,
      email_communication: true,
      research: true
    });

    await db('subject_keys').insert({
      subject_id: subjectId,
      key
    });

    // we should be faking a blockchain event as a Controller here... then expecting the processor to react
    await recordErasureByController(subjectId);

    setTimeout(async () => {
      const [subjectKey] = await db('subject_keys').where({ subject_id: subjectId });
      // we are expecting the key to be thrown away
      expect(subjectKey).toEqual(undefined);
      expect(
        await getSubjectDataState(subjectId, '0xedbbe1fa6bc80f55c9ac7e351b777874142baaf8')
      ).toBe(SubjectDataStatus.erased);
      done();
    }, 1000);
  });

  it('should acknowledge consent events for itself', async done => {
    helpers.inControllerMode.mockImplementation(() => false);
    helpers.getMyAddress.mockImplementation(() => '0xedbbe1fa6bc80f55c9ac7e351b777874142baaf8');

    const fakeUserData = { name: 'test' };
    const subjectId = sha3('fakeuserid1239393');
    // we should be faking a blockchain event as a Controller here... then expecting the processor to react
    const fakeControllerResponse = nock(process.env.CONTROLLER_URL)
      .get(() => true)
      .reply(200, fakeUserData);

    await setProcessors(['0xedbbe1fa6bc80f55c9ac7e351b777874142baaf8']);
    await recordConsentGivenTo(subjectId, ['0xedbbe1fa6bc80f55c9ac7e351b777874142baaf8']);

    setTimeout(async () => {
      // check that a request was made in response to the blockchain consent event
      expect(fakeControllerResponse.isDone()).toEqual(true);
      const [subject] = await db('subjects').where({ id: subjectId });
      const [key] = await db('subject_keys').where({ subject_id: subjectId });

      let decryptedJson = decryptFromStorage(subject.personal_data, key.key);
      const decryptedPersonalData = JSON.parse(decryptedJson);

      // expect that the personal data was stored appropriately
      expect(decryptedPersonalData).toEqual(expect.objectContaining(fakeUserData));
      done();
    }, 4000);
  });

  it('should not acknowledge consent events for other nodes', async done => {
    helpers.inControllerMode.mockImplementation(() => false);
    helpers.getMyAddress.mockImplementation(() => '1');
    const fakeUserData = { name: 'test' };
    const subjectId = sha3('fakeuserid1239393');
    // we should be faking a blockchain event as a Controller here... then expecting the processor to react
    const fakeControllerResponse = nock(process.env.CONTROLLER_URL)
      .get(() => true)
      .reply(200, fakeUserData);

    await recordConsentGivenTo(subjectId, []);
    setTimeout(async () => {
      // check that a request was made in response to the blockchain consent event
      expect(fakeControllerResponse.isDone()).toEqual(false);
      done();
    }, 4000);
  });

  it('Should react to rectification events', async done => {
    // Given
    helpers.inControllerMode.mockImplementation(() => false);
    helpers.getMyAddress.mockImplementation(() => '0xedbbe1fa6bc80f55c9ac7e351b777874142baaf8');
    let subjectId = sha3('589');
    const encryptionKey = encryption.generateClientKey();
    await db('subjects').insert({
      id: subjectId,
      personal_data: encryptForStorage(JSON.stringify({ data: 'some data' }), encryptionKey),
      objection: false,
      direct_marketing: true,
      email_communication: true,
      research: true
    });
    await db('subject_keys').insert({
      subject_id: subjectId,
      key: encryptionKey
    });

    // When
    const fakeUserData = { name: 'rectification' };
    // we should be faking a blockchain event as a Controller here... then expecting the processor to react
    const fakeControllerResponse = nock(process.env.CONTROLLER_URL)
      .get(() => true)
      .reply(200, fakeUserData);

    await recordRectificationByController(subjectId);

    // Then
    setTimeout(async () => {
      // check that a request was made in response to the blockchain rectification event
      expect(fakeControllerResponse.isDone()).toEqual(true);
      const [subject] = await db('subjects').where({ id: subjectId });
      const [key] = await db('subject_keys').where({ subject_id: subjectId });
      let decryptedJson = decryptFromStorage(subject.personal_data, key.key);
      const decryptedPersonalData = JSON.parse(decryptedJson);
      // expect that the personal data was stored appropriately
      expect(decryptedPersonalData).toEqual(expect.objectContaining(fakeUserData));
      done();
    }, 4000);
  });

  it('Should react to restriction events', async done => {
    // Given
    // We need to insert a subject this way because the mocks override the endpoints (give-consent in this case)
    let subjectId = sha3('58669879');
    const encryptionKey = encryption.generateClientKey();
    await db('subjects').insert({
      id: subjectId,
      personal_data: encryptForStorage(JSON.stringify({ data: 'some data' }), encryptionKey),
      objection: false,
      direct_marketing: true,
      email_communication: true,
      research: true
    });
    await db('subject_keys').insert({
      subject_id: subjectId,
      key: encryptionKey
    });

    // When
    await recordRestrictionByController(subjectId, false, true, false);

    // Then
    setTimeout(async () => {
      // We have to wait for the processor to update his database with the new subject restrictions
      const [restrictions] = await db('subjects')
        .where('id', subjectId)
        .select('direct_marketing', 'email_communication', 'research');

      expect(restrictions).toEqual({
        direct_marketing: false,
        email_communication: true,
        research: false
      });
      done();
    }, 1000);
  });

  it('Should react to objection events', async done => {
    // Given
    let subjectId = sha3('986546983468');
    const encryptionKey = encryption.generateClientKey();
    await db('subjects').insert({
      id: subjectId,
      personal_data: encryptForStorage(JSON.stringify({ data: 'some data' }), encryptionKey),
      objection: false,
      direct_marketing: true,
      email_communication: true,
      research: true
    });
    await db('subject_keys').insert({
      subject_id: subjectId,
      key: encryptionKey
    });

    // When
    await recordObjectionByController(subjectId, true);

    // Then
    setTimeout(async () => {
      // We have to wait for the processor to update his database with the new subject restrictions
      const [objection] = await db('subjects')
        .where('id', subjectId)
        .select('objection');

      expect(objection).toEqual({
        objection: true
      });
      done();
    }, 1000);
  });
});
