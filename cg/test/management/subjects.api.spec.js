const { initResources, fetch, closeResources } = require('../utils');
const { db } = require('../../src/db');
const { generateClientKey, encryptForStorage, hash } = require('../../src/utils/encryption');
const { managementJWT } = require('../../src/utils/jwt');
const { Unauthorized } = require('../../src/utils/errors');

beforeAll(initResources);
afterAll(closeResources);

describe('List subjects that have given consent', () => {
  it('should not allow a manager to list subjects without a manager JWT', async () => {
    //GIVEN AND WHEN
    const res = await fetch('/api/management/subjects/list', {
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

  it('should not allow a manager to list subjects with an invalid manager JWT', async () => {
    //GIVEN AND WHEN
    const res = await fetch('/api/management/subjects/list', {
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

  it('should not allow an authentic manager to list subjects whose personal data is empty', async () => {
    //GIVEN
    const subjectData = {}; // Empty subject's personal data implies that the subject should not be listed
    const encryptionKey = generateClientKey();
    const encryptedSubjectData = encryptForStorage(JSON.stringify(subjectData), encryptionKey);
    const subjectIdHash = hash('subject652848158'); // Random ID to not influence other tests

    await db('subjects').insert({
      id: subjectIdHash,
      personal_data: encryptedSubjectData
    });

    await db('subject_keys').insert({
      subject_id: subjectIdHash,
      key: encryptionKey
    });

    //WHEN
    const managementToken = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/subjects/list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //THEN
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(
      expect.arrayContaining([])
      // Expects an empty array because a subject without personal data in the DB is filtered out by the listSubjects() function in the subjectsService class
    );
  });

  it('should not allow an authentic manager to list subjects without an encryption key', async () => {
    //GIVEN
    const subjectData = {
      username: 'subject',
      email: 'subject@clevertech.biz'
    };
    const encryptionKey = generateClientKey();
    const encryptedSubjectData = encryptForStorage(JSON.stringify(subjectData), encryptionKey);
    const subjectIdHash = hash('user458246'); // Random ID to not influence other tests

    await db('subjects').insert({
      id: subjectIdHash,
      personal_data: encryptedSubjectData
    });

    await db('subject_keys').insert({
      subject_id: subjectIdHash,
      key: '' // Empty encryption key in the DB implies that the subject should not be listed
    });

    //WHEN
    const managementToken = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/subjects/list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //THEN
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(
      expect.arrayContaining([])
      // Expects an empty array because a subject without an encryption key in the DB is filtered out by the listSubjects function in the subjectsService class
    );
  });

  it('should not allow an authentic manager to list subjects with an invalid encryption key', async () => {
    //GIVEN
    const subjectData = {
      username: 'subject',
      email: 'subject@clevertech.biz'
    };
    const encryptionKey = generateClientKey();
    const encryptedSubjectData = encryptForStorage(JSON.stringify(subjectData), encryptionKey);
    const subjectIdHash = hash('user125469853'); // Random ID to not influence other tests

    await db('subjects').insert({
      id: subjectIdHash,
      personal_data: encryptedSubjectData
    });

    await db('subject_keys').insert({
      subject_id: subjectIdHash,
      key: 'invalid_encryption_key' // Invalid encryption key in the DB implies that the subject should not be listed
    });

    //WHEN
    const managementToken = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/subjects/list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //THEN
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(
      expect.arrayContaining([])
      // Expects an empty array because a subject with an invalid encryption key in the DB is filtered out by the listSubjects function in the subjectsService class
    );
  });

  it('should allow an authentic manager to list subjects', async () => {
    //GIVEN
    const subjectData_1 = {
      username: 'subject1',
      email: 'subject1@clevertech.biz'
    };
    const encryptionKey_1 = generateClientKey();
    const encryptedSubjectData_1 = encryptForStorage(
      JSON.stringify(subjectData_1),
      encryptionKey_1
    );
    const subjectIdHash_1 = hash('user15786'); // Random ID to not influence other tests

    await db('subjects').insert({
      id: subjectIdHash_1,
      personal_data: encryptedSubjectData_1
    });

    await db('subject_keys').insert({
      subject_id: subjectIdHash_1,
      key: encryptionKey_1
    });

    const subjectData_2 = {
      username: 'subject2',
      email: 'subject2@clevertech.biz'
    };
    const encryptionKey_2 = generateClientKey();
    const encryptedSubjectData_2 = encryptForStorage(
      JSON.stringify(subjectData_2),
      encryptionKey_2
    );
    const subjectIdHash_2 = hash('user68751'); // Random ID to not influence other tests

    await db('subjects').insert({
      id: subjectIdHash_2,
      personal_data: encryptedSubjectData_2
    });

    await db('subject_keys').insert({
      subject_id: subjectIdHash_2,
      key: encryptionKey_2
    });

    //WHEN
    const managementToken = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/subjects/list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //THEN
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: 'subject1',
          email: 'subject1@clevertech.biz'
        }),
        expect.objectContaining({
          username: 'subject2',
          email: 'subject2@clevertech.biz'
        })
      ])
    );
  });
});
