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
    console.log(managementToken);

    const res = await fetch('/api/management/subjects/list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //THEN
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(await res.json()).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: 'subject',
          email: 'subject@clevertech.biz'
        })
      ])
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
    expect(await res.json()).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: 'subject',
          email: 'subject@clevertech.biz'
        })
      ])
    );
  });

  it('should allow an authentic manager to list subjects', async () => {
    //GIVEN
    const subjectData1 = {
      username: 'subject1',
      email: 'subject1@clevertech.biz'
    };
    const encryptionKey1 = generateClientKey();
    const encryptedSubjectData1 = encryptForStorage(JSON.stringify(subjectData1), encryptionKey1);
    const subjectIdHash1 = hash('user15786'); // Random ID to not influence other tests

    await db('subjects').insert({
      id: subjectIdHash1,
      personal_data: encryptedSubjectData1
    });

    await db('subject_keys').insert({
      subject_id: subjectIdHash1,
      key: encryptionKey1
    });

    const subjectData2 = {
      username: 'subject2',
      email: 'subject2@clevertech.biz'
    };
    const encryptionKey2 = generateClientKey();
    const encryptedSubjectData2 = encryptForStorage(JSON.stringify(subjectData2), encryptionKey2);
    const subjectIdHash2 = hash('user68751'); // Random ID to not influence other tests

    await db('subjects').insert({
      id: subjectIdHash2,
      personal_data: encryptedSubjectData2
    });

    await db('subject_keys').insert({
      subject_id: subjectIdHash2,
      key: encryptionKey2
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
