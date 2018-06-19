const { initResources, fetch, closeResources } = require('../utils');
const { db } = require('../../src/db');
const { generateClientKey, encryptForStorage, hash } = require('../../src/utils/encryption');
const { managementJWT } = require('../../src/utils/jwt');
const { BadRequest, Unauthorized, ValidationError } = require('../../src/utils/errors');

beforeAll(initResources);
beforeEach(async () => {
  await db('subject_keys').del();
  await db('subjects').del();
});
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

  it('should not allow an authentic manager to list subjects which dont have an encryption key', async () => {
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
    expect(await res.json()).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: 'subject',
          email: 'subject@clevertech.biz'
        })
      ])
    );
  });

  it('should not allow an authentic manager to list subjects which have an invalid encryption key', async () => {
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

  it('should allow an authentic manager to list subjects which have valid encryption keys', async () => {
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
      expect.objectContaining({
        requestedPage: 1,
        numberOfPages: 1,
        subjects: expect.arrayContaining([
          expect.objectContaining({
            username: 's******1',
            email: 's*********************z'
          }),
          expect.objectContaining({
            username: 's******2',
            email: 's*********************z'
          })
        ])
      })
    );
  });

  it('should return an empty subjects list when no subject has given consent', async () => {
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
    expect(await res.json()).toEqual(expect.arrayContaining([]));
  });

  it('should not allow a page query with a negative page number', async () => {
    //WHEN
    const managementToken = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/subjects/list?page=-1', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //THEN
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow a page query with the zero page number', async () => {
    //WHEN
    const managementToken = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/subjects/list?page=0', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //THEN
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow a page query with a page number too big', async () => {
    //WHEN
    const managementToken = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/subjects/list?page=99999999999999', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
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

  it('should not allow a page query without an integer page number', async () => {
    //WHEN
    const managementToken = await managementJWT.sign({ id: 1 });
    const res = await fetch('/api/management/subjects/list?page=string', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //THEN
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should allow a page query with a valid page number', async () => {
    //GIVEN
    const subjectData1 = {
      username: 'subject1',
      email: 'subject1@clevertech.biz'
    };
    const encryptionKey1 = generateClientKey();
    const encryptedSubjectData1 = encryptForStorage(JSON.stringify(subjectData1), encryptionKey1);
    const subjectIdHash1 = hash('1');

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
    const subjectIdHash2 = hash('2');

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
    const res = await fetch('/api/management/subjects/list?page=1', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //THEN
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        requestedPage: 1,
        numberOfPages: 1,
        subjects: expect.arrayContaining([
          expect.objectContaining({
            username: 's******1',
            email: 's*********************z'
          }),
          expect.objectContaining({
            username: 's******2',
            email: 's*********************z'
          })
        ])
      })
    );
  });

  it('should allow a page query with a valid page number that is greater than 1', async () => {
    //GIVEN
    let subjectData;
    let encryptionKey;
    let encryptedSubjectData;
    let subjectId;

    for (let i = 0; i < 11; i++) {
      //PAGE_SIZE is 10
      subjectData = {
        username: `subject${i}`,
        email: `subject${i}@clevertech.biz`
      };
      encryptionKey = generateClientKey();
      encryptedSubjectData = encryptForStorage(JSON.stringify(subjectData), encryptionKey);
      subjectId = i; // The IDs are not hashed here because they introduce a random factor in the test
      // That is, the query in the db is ordered by ID, and if it was hashed it would not be possible to determine the order of the IDs

      await db('subjects').insert({
        id: subjectId,
        personal_data: encryptedSubjectData
      });

      await db('subject_keys').insert({
        subject_id: subjectId,
        key: encryptionKey
      });
    }
    //WHEN
    const managementToken = await managementJWT.sign({ id: 1 });
    const res = await fetch('/api/management/subjects/list?page=2', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //THEN
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        requestedPage: 2,
        numberOfPages: 2,
        subjects: expect.arrayContaining([
          expect.objectContaining({
            username: 's******9',
            email: 's*********************z'
          })
        ])
      })
    );
  });

  describe('List rectification requests', () => {
    it('Should list the requests sucessfully', () => {});
    it('Should fail if page number is too big', () => {});
    it('Should only serve pending rectification requests', () => {});
    it('Should list rectification requets for users without encryption keys', () => {});
  });
});
