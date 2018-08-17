const { initResources, fetch, closeResources } = require('../utils');
const { db } = require('../../src/db');
const { managementJWT } = require('../../src/utils/jwt');
const { ValidationError } = require('../../src/utils/errors');

const TEST_CONFIG = {
  email: {
    type: 'email',
    label: 'email',
    required: true,
    placeholder: 'Provide your email'
  }
};

let token;

beforeAll(async () => {
  await initResources();

  token = await managementJWT.sign({
    id: 1
  });

  const key = 'SUBJECT_DATA_ATTRIBUTES_CONFIG';
  await db('config')
    .where('key', key)
    .delete();

  await db('config').insert([
    {
      value: JSON.stringify(TEST_CONFIG),
      key
    }
  ]);
});

afterAll(closeResources);

describe('Data attributes config API', () => {
  it('should provide way to fetch current config', async () => {
    const res = await fetch('/api/management/data/attributes-config', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const config = await res.json();

    expect(config).toEqual(TEST_CONFIG);
  });

  it('should be able to set new config', async () => {
    const name = {
      label: 'name',
      type: 'string',
      required: false,
      placeholder: 'Provide your name'
    };
    const newConfig = { ...TEST_CONFIG, name };

    await fetch('/api/management/data/attributes-config/update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: newConfig
    });

    const res = await fetch('/api/management/data/attributes-config', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const config = await res.json();

    expect(config).toEqual(newConfig);
  });

  it('should validate data attributes config', async () => {
    const name = {
      type: 'string',
      required: false,
      placeholder: 'Provide your name'
    };
    const newConfig = { ...TEST_CONFIG, name };

    const res = await fetch('/api/management/data/attributes-config/update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: newConfig
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(ValidationError.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'child "name" fails because [child "label" fails because ["label" is required]]'
      })
    );
  });
});
