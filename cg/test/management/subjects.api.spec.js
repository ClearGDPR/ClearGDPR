const { initResources, fetch, closeResources } = require('../utils');
const { db } = require('../../src/db');
const {
  generateClientKey,
  encryptForStorage,
  decryptFromStorage,
  hash
} = require('../../src/utils/encryption');
const { managementJWT } = require('../../src/utils/jwt');
const { BadRequest, Unauthorized, ValidationError } = require('../../src/utils/errors');
const { omit } = require('underscore');
const { RECTIFICATION_STATUSES } = require('./../../src/utils/constants');

beforeAll(initResources);
beforeEach(async () => {
  await db('subject_keys').del();
  await db('rectification_requests').del();
  await db('subjects').del();
});
afterAll(closeResources);

async function createSubjectWithRectification(overrides = {}) {
  const idHash = hash(
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
  const key = await generateClientKey();
  await db('subjects')
    .insert({
      id: idHash,
      personal_data: encryptForStorage(JSON.stringify({ test: false }), key)
    })
    .returning('id');

  await db('subject_keys').insert({
    subject_id: idHash,
    key
  });

  const [rectificationRequestId] = await db('rectification_requests')
    .insert(
      Object.assign(
        {
          subject_id: idHash,
          request_reason: 'none',
          encrypted_rectification_payload: encryptForStorage(
            JSON.stringify(overrides.rectification_payload || { test: true }),
            key
          ),
          status: overrides.status || RECTIFICATION_STATUSES.PENDING
        },
        omit(overrides, ['rectification_payload'])
      )
    )
    .returning('id');

  return { subjectId: idHash, rectificationRequestId };
}

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
          data: {
            username: 'subject',
            email: 'subject@clevertech.biz'
          }
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
          data: {
            username: 'subject',
            email: 'subject@clevertech.biz'
          }
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
        paging: {
          total: 1,
          current: 1
        },
        data: expect.arrayContaining([
          expect.objectContaining({
            data: {
              username: 's******1',
              email: 's*********************z'
            }
          }),
          expect.objectContaining({
            data: {
              username: 's******2',
              email: 's*********************z'
            }
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
    expect((await res.json()).data).toEqual(expect.arrayContaining([]));
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
        paging: {
          total: 1,
          current: 1
        },
        data: expect.arrayContaining([
          expect.objectContaining({
            data: {
              username: 's******1',
              email: 's*********************z'
            }
          }),
          expect.objectContaining({
            data: {
              username: 's******2',
              email: 's*********************z'
            }
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
        paging: {
          current: 2,
          total: 2
        },
        data: expect.arrayContaining([
          expect.objectContaining({
            data: {
              username: 's******9',
              email: 's*********************z'
            }
          })
        ])
      })
    );
  });

  describe('List rectification requests', () => {
    it('Should list the requests sucessfully', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });
      await createSubjectWithRectification();
      await createSubjectWithRectification();
      const res = await fetch('/api/management/subjects/rectification-requests/list', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${managementToken}`
        }
      });

      const body = await res.json();
      expect(res.status).toEqual(200);
      expect(body.data).toHaveLength(2);
    });
    it('Should list the requests sucessfully when there is 0', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });

      const res = await fetch('/api/management/subjects/rectification-requests/list', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${managementToken}`
        }
      });

      const body = await res.json();
      expect(res.status).toEqual(200);
      expect(body.data).toHaveLength(0);
      expect(body.paging).toEqual({ current: 1, total: 1 });
    });
    it('Should fail if page number is too big', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });

      const res = await fetch('/api/management/subjects/rectification-requests/list?page=6', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${managementToken}`
        }
      });

      const body = await res.json();

      expect(res.status).toEqual(400);
      expect(body.error).toEqual('Page number too big, maximum page number is 1');
    });
    it('Should only serve pending rectification requests', async () => {
      await createSubjectWithRectification({ status: RECTIFICATION_STATUSES.APPROVED });
      await createSubjectWithRectification({ status: RECTIFICATION_STATUSES.DISAPPROVED });
      const managementToken = await managementJWT.sign({ id: 1 });

      const res = await fetch('/api/management/subjects/rectification-requests/list', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${managementToken}`
        }
      });

      const body = await res.json();
      expect(res.status).toEqual(200);
      expect(body.data).toHaveLength(0);
    });
    it('Should not list rectification requests for users without encryption keys', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });

      const { subjectId } = await createSubjectWithRectification();
      await createSubjectWithRectification();

      await db('subject_keys')
        .delete()
        .where({ subject_id: subjectId });

      const res = await fetch('/api/management/subjects/rectification-requests/list', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${managementToken}`
        }
      });

      const body = await res.json();

      expect(res.status).toEqual(200);
      expect(body.data).toHaveLength(1);
    });
  });

  describe('Rectification requests archive', () => {
    it('Should only list the requests with disapproved and approved statuses', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });
      await createSubjectWithRectification();
      await createSubjectWithRectification({ status: RECTIFICATION_STATUSES.DISAPPROVED });
      await createSubjectWithRectification({ status: RECTIFICATION_STATUSES.APPROVED });
      const res = await fetch('/api/management/subjects/rectification-requests/archive', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${managementToken}`
        }
      });

      const body = await res.json();
      expect(res.status).toEqual(200);
      expect(body.data).toHaveLength(2);
    });

    it('Should list the requests successfully when there is 0', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });

      const res = await fetch('/api/management/subjects/rectification-requests/archive', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${managementToken}`
        }
      });

      const body = await res.json();
      expect(res.status).toEqual(200);
      expect(body.data).toHaveLength(0);
      expect(body.paging).toEqual({ current: 1, total: 1 });
    });

    it('Should fail if page number is too big', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });

      const res = await fetch('/api/management/subjects/rectification-requests/archive?page=6', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${managementToken}`
        }
      });

      const body = await res.json();

      expect(res.status).toEqual(400);
      expect(body.error).toEqual('Page number too big, maximum page number is 1');
    });

    it('Should still list rectification requests for users without encryption keys', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });

      const { subjectId } = await createSubjectWithRectification({
        status: RECTIFICATION_STATUSES.APPROVED
      });

      await createSubjectWithRectification({
        status: RECTIFICATION_STATUSES.DISAPPROVED
      });

      await db('subject_keys')
        .delete()
        .where({ subject_id: subjectId });

      const res = await fetch('/api/management/subjects/rectification-requests/archive', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${managementToken}`
        }
      });

      const body = await res.json();

      expect(res.status).toEqual(200);
      expect(body.data).toHaveLength(2);
    });
  });

  describe('Show rectification requests', () => {
    it('Should show the rectification request data', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });

      const { rectificationRequestId } = await createSubjectWithRectification();

      const res = await fetch(
        `/api/management/subjects/rectification-requests/${rectificationRequestId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${managementToken}`
          }
        }
      );

      const body = await res.json();

      expect(res.status).toEqual(200);

      expect(body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          currentData: expect.any(Object),
          updates: expect.any(Object),
          createdAt: expect.any(String),
          status: RECTIFICATION_STATUSES.PENDING
        })
      );
    });

    it('Should error if the request does not exist', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });

      const res = await fetch(`/api/management/subjects/rectification-requests/1111111`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${managementToken}`
        }
      });

      expect(res.status).toEqual(404);
    });

    it('Should error if the rectification request subject has no key', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });

      const { subjectId, rectificationRequestId } = await createSubjectWithRectification();

      await db('subject_keys')
        .delete()
        .where({ subject_id: subjectId });

      const res = await fetch(
        `/api/management/subjects/rectification-requests/${rectificationRequestId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${managementToken}`
          }
        }
      );

      const body = await res.json();

      expect(res.status).toEqual(400);

      expect(body).toMatchSnapshot();
    });
  });

  describe('Update rectification request status', () => {
    it('Should be able to approve the rectification request', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });

      const { rectificationRequestId } = await createSubjectWithRectification();

      const res = await fetch(
        `/api/management/subjects/rectification-requests/${rectificationRequestId}/update-status`,
        {
          method: 'POST',
          body: {
            status: RECTIFICATION_STATUSES.APPROVED
          },
          headers: {
            Authorization: `Bearer ${managementToken}`
          }
        }
      );

      expect(res.status).toEqual(200);

      const [request] = await db('rectification_requests').where({ id: rectificationRequestId });
      expect(request.status).toEqual('APPROVED');
    });

    it('Should apply the rectification if the request is approved', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });

      const { rectificationRequestId } = await createSubjectWithRectification({
        rectification_payload: { custom_payload: true }
      });

      const res = await fetch(
        `/api/management/subjects/rectification-requests/${rectificationRequestId}/update-status`,
        {
          method: 'POST',
          body: {
            status: RECTIFICATION_STATUSES.APPROVED
          },
          headers: {
            Authorization: `Bearer ${managementToken}`
          }
        }
      );

      expect(res.status).toEqual(200);

      const [request] = await db('rectification_requests').where({ id: rectificationRequestId });
      expect(request.status).toEqual(RECTIFICATION_STATUSES.APPROVED);

      const [subject] = await db('subjects')
        .join('subject_keys', 'subjects.id', 'subject_keys.subject_id')
        .where({ subject_id: request.subject_id });

      expect(
        JSON.parse(decryptFromStorage(subject.personal_data, subject.key)).custom_payload
      ).toEqual(true);
    });

    it('Should be able to disapprove the rectification request', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });

      const { rectificationRequestId } = await createSubjectWithRectification();

      const res = await fetch(
        `/api/management/subjects/rectification-requests/${rectificationRequestId}/update-status`,
        {
          method: 'POST',
          body: {
            status: RECTIFICATION_STATUSES.DISAPPROVED
          },
          headers: {
            Authorization: `Bearer ${managementToken}`
          }
        }
      );

      expect(res.status).toEqual(200);

      const [request] = await db('rectification_requests').where({ id: rectificationRequestId });

      expect(request.status).toEqual('DISAPPROVED');
    });

    it('Should error if no status is provided', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });

      const { rectificationRequestId } = await createSubjectWithRectification();

      const res = await fetch(
        `/api/management/subjects/rectification-requests/${rectificationRequestId}/update-status`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${managementToken}`
          },
          body: {}
        }
      );

      expect(res.status).toEqual(400);
      expect(await res.json()).toMatchSnapshot();
    });

    it('Should error if the request does not exist', async () => {
      const managementToken = await managementJWT.sign({ id: 1 });

      const res = await fetch(
        `/api/management/subjects/rectification-requests/1212121/update-status`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${managementToken}`
          },
          body: {
            status: RECTIFICATION_STATUSES.APPROVED
          }
        }
      );

      expect(res.status).toEqual(404);
    });
  });
});
