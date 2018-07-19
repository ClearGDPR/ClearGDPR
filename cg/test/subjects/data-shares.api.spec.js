jest.mock('../../src/utils/blockchain/web3-provider-factory');
const { initResources, fetch, closeResources, fetchWithAuthorization } = require('../utils');
const { db } = require('../../src/db');
const { subjectJWT } = require('../../src/utils/jwt');
const { deployContract } = require('../blockchain-setup');
const { hash } = require('../../src/utils/encryption');
const { NotFound, BadRequest } = require('../../src/utils/errors');

beforeAll(async () => {
  try {
    await deployContract();
  } catch (e) {
    console.error(`Failed deploying contract ${e.toString()}`);
  }
  await initResources();
});
afterAll(closeResources);

async function createUser(id, data = { name: 'test' }) {
  const token = await subjectJWT.sign({ subjectId: id });
  await fetch('/api/subject/give-consent', {
    method: 'POST',
    body: {
      personalData: data,
      processors: []
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return token;
}

describe('Listing data-shares', () => {
  it('Should return the data-shares', async () => {
    //GIVEN
    const subjectId = '673211';
    const idHash = hash(subjectId);
    const token = await createUser(subjectId);
    await db('data_shares').insert({ subject_id: idHash, name: 'test1', token: 'token1' });
    await db('data_shares').insert({ subject_id: idHash, name: 'test2', token: 'token2' });

    //WHEN
    const res = await fetchWithAuthorization('/api/subject/data-shares/list', token);

    //THEN
    expect(res.status).toEqual(200);
    const jsonBody = await res.json();
    expect(jsonBody).toHaveLength(2);
    expect(jsonBody[0]).toEqual(
      expect.objectContaining({
        name: 'test1',
        url: `${process.env.CONTROLLER_URL}/api/subjects/data-shares/share?token=token1`
      })
    );
    expect(jsonBody[1]).toEqual(
      expect.objectContaining({
        name: 'test2',
        url: `${process.env.CONTROLLER_URL}/api/subjects/data-shares/share?token=token2`
      })
    );
  });

  it('Should not error if there are no data-shares', async () => {
    const subjectId = '84291212';
    const token = await createUser(subjectId);

    const res = await fetchWithAuthorization(`/api/subject/data-shares/list`, token);

    expect(res.status).toEqual(200);
    expect(await res.json()).toHaveLength(0);
  });
});

describe('Data share create', () => {
  it('Should create a data share', async () => {
    const subjectId = '84215211';
    const token = await createUser(subjectId);
    const body = { name: 'test6' };
    const res = await fetchWithAuthorization('/api/subject/data-shares/create', token, {
      method: 'POST',
      body
    });
    expect(res.status).toEqual(200);

    const [dataShare] = await db('data_shares').where({ name: 'test6' });
    expect(dataShare).toBeTruthy();
    expect(dataShare.token).toBeTruthy();
  });

  it('Should error if no name is provided', async () => {
    const subjectId = '8421511011';
    const token = await createUser(subjectId);
    const res = await fetchWithAuthorization('/api/subject/data-shares/create', token, {
      method: 'POST',
      body: {}
    });
    expect(res.status).toEqual(BadRequest.StatusCode);
  });
});

describe('Data share remove', () => {
  it('Should remove the requested data share', async () => {
    const subjectId = '84291211';
    const idHash = hash(subjectId);
    const token = await createUser(subjectId);
    await db('data_shares').insert({ subject_id: idHash, name: 'test7', token: 'none' });

    const [dataShare] = await db('data_shares').where({ name: 'test7' });

    expect(dataShare).toBeTruthy();

    const res = await fetchWithAuthorization(
      `/api/subject/data-shares/${dataShare.id}/remove`,
      token,
      {
        method: 'POST'
      }
    );

    expect(res.status).toEqual(200);
    const [dataShare2] = await db('data_shares').where({ name: 'test7' });
    expect(dataShare2).not.toBeTruthy();
  });

  it('Should error if the share does not exist', async () => {
    const subjectId = '8422291211';
    const token = await createUser(subjectId);

    const res = await fetchWithAuthorization(`/api/subject/data-shares/439101111/remove`, token, {
      method: 'POST'
    });

    expect(res.status).toEqual(NotFound.StatusCode);
  });
});

describe('Data share sharing', () => {
  it('Should provide the users personal data in a json format if token is correct', async () => {
    const subjectId = '2';
    const token = await createUser(subjectId, { customData: true });
    const res = await fetchWithAuthorization('/api/subject/data-shares/create', token, {
      method: 'POST',
      body: { name: 'testdatasharing' }
    });
    expect(res.status).toEqual(200);
    const [dataShare] = await db('data_shares').where({ name: 'testdatasharing' });

    const res2 = await fetch(`/api/subject/data-shares/share?token=${dataShare.token}`);

    expect(res2.status).toEqual(200);
    expect(await res2.json()).toEqual(expect.objectContaining({ customData: true }));
  });

  it('Should error if token is invalid', async () => {
    const res = await fetch(`/api/subject/data-shares/share?token=badtoken`);
    expect(res.status).toEqual(NotFound.StatusCode);
  });

  it('Should error if no token is provided', async () => {
    const res = await fetch(`/api/subject/data-shares/share`);
    expect(res.status).toEqual(BadRequest.StatusCode);
  });

  it('Should error if the user has no decrpytion key', async () => {
    const subjectId = '3';
    const idHash = hash(subjectId);
    const token = await createUser(subjectId);

    const res = await fetchWithAuthorization('/api/subject/data-shares/create', token, {
      method: 'POST',
      body: { name: 'no-decryption-key' }
    });

    expect(res.status).toEqual(200);
    const [dataShare] = await db('data_shares').where({ name: 'no-decryption-key' });
    await db('subject_keys')
      .where({ subject_id: idHash })
      .delete();

    const res2 = await fetch(`/api/subject/data-shares/share?token=${dataShare.token}`);

    expect(res2.status).toEqual(BadRequest.StatusCode);
  });
});
