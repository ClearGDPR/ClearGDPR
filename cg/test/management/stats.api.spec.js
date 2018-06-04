const { initResources, fetch, closeResources } = require('../utils');
const { db } = require('../../src/db');
const { managementJWT, subjectJWT } = require('../../src/utils/jwt');

beforeAll(initResources);
afterAll(closeResources);

describe('Display the stats for the current users', async () => {
  const managementToken = await managementJWT.sign({
    id: 1
  });

  await db('processors').insert({
    id: 843,
    name: 'Processor 1',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
    description: `some description`,
    scopes: JSON.stringify(['email', 'first name'])
  });

  const token1 = await subjectJWT.sign({ subjectId: '1aadddsas21322b' });
  await fetch('/api/subject/give-consent', {
    method: 'POST',
    body: {
      payload: { name: 'dan' },
      processors: [843]
    },
    headers: {
      Authorization: `Bearer ${token1}`
    }
  });

  const token2 = await subjectJWT.sign({ subjectId: '1aadddsas21322b' });
  await fetch('/api/subject/give-consent', {
    method: 'POST',
    body: {
      payload: { name: 'dave' },
      processors: [843]
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

  console.log(await res.json());

  expect(await res.json()).toEqual(
    expect.objectContaining({
      controller: {
        consented: 1,
        unconsented: 1,
        total: 2
      },
      processors: {
        '1': {
          consented: 1
        }
      }
    })
  );
});
