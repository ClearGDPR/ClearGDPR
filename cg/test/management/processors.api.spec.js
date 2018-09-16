jest.mock('../../src/utils/blockchain/web3-provider-factory');

const winston = require('winston');
const { initResources, fetch, closeResources } = require('../utils');
const { managementJWT } = require('../../src/utils/jwt');
const { db } = require('../../src/db');
const { Unauthorized, BadRequest, NotFound } = require('../../src/utils/errors');
const { deployContract } = require('../blockchain-setup');
const { isProcessor } = require('../../src/utils/blockchain');

beforeAll(async () => {
  try {
    await deployContract();
  } catch (e) {
    winston.error(`Failed deploying contract ${e.toString()}`);
  }
  await initResources();
});
beforeEach(async () => {
  jest.clearAllMocks();
  await db('processor_address').del();
  await db('processors').del();
});
afterAll(closeResources);

describe('List processors', () => {
  it('should not allow listing processors without a managementToken', async () => {
    // Given and When
    const res = await fetch('/api/management/processors', {
      method: 'DELETE'
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it('should return processors with addresses', async () => {
    // Given
    const managementToken = await managementJWT.sign({
      id: 1
    });

    await db('processors').insert({
      id: 521,
      name: 'Processor 1',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
      description: `some description`,
      scopes: JSON.stringify(['email', 'first name'])
    });

    await db('processors').insert({
      id: 525,
      name: 'Processor 2'
    });

    await db('processor_address').insert({
      processor_id: 521,
      address: '0x0000000000000000000000000000000000000003'
    });

    // When
    const res = await fetch('/api/management/processors', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    // Then
    expect(res.ok).toBeTruthy();
    expect(await res.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: 'Processor 1',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
          description: `some description`,
          scopes: expect.arrayContaining(['email', 'first name']),
          address: '0x0000000000000000000000000000000000000003'
        }),
        expect.objectContaining({
          id: expect.any(Number),
          name: 'Processor 2',
          address: null
        })
      ])
    );
  });
});

describe('Add processor', () => {
  // TODO - Negative test cases
});

describe('Update processor', () => {
  it('should not allow the update of the processor without a managementToken', async () => {
    // Given and When
    const res = await fetch('/api/management/processors', {
      method: 'PUT'
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it('should not allow empty body', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });

    // When
    const res = await fetch('/api/management/processors', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {}
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow processor without an ID', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });

    // When
    const res = await fetch('/api/management/processors', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {
        name: 'abc',
        description: 'some desc'
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow updating an address', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });

    // When
    const res = await fetch('/api/management/processors', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {
        id: 19838,
        name: 'abc',
        address: '0x0000000000000000000000000000000000000001'
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: '"address" is not allowed'
      })
    );
  });

  it('should return not found when processor does not exist', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });

    // When
    const res = await fetch('/api/management/processors', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {
        id: 19838,
        name: 'abc'
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(NotFound.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        error: 'Processor not found'
      })
    );
  });

  it('should update existing processor and not update the blockchain', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });

    await db('processors').insert({
      id: 912,
      name: 'Processor name',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
      description: `some description`,
      scopes: JSON.stringify(['email', 'first name'])
    });
    await db('processor_address').insert({
      processor_id: 912,
      address: '0x0000000000000000000000000000000000000001'
    });

    // When
    const res = await fetch('/api/management/processors', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {
        id: 912,
        name: 'Processor name updated',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo1.svg',
        description: `some description updated`,
        scopes: ['email', 'first name', 'updates']
      }
    });

    // Then
    expect(res.ok).toBeTruthy();
    const [updatedProcessor] = await db('processors').where({ id: 912 });
    expect(updatedProcessor).toEqual(
      expect.objectContaining({
        id: 912,
        name: 'Processor name updated',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo1.svg',
        description: `some description updated`,
        scopes: expect.arrayContaining(['email', 'first name', 'updates'])
      })
    );
    expect(await isProcessor('0x0000000000000000000000000000000000000001')).toBeFalsy();
  });

  it('should update only provided data', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });

    await db('processors').insert({
      id: 915,
      name: 'Processor name',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
      description: `some description`,
      scopes: JSON.stringify(['email', 'first name'])
    });

    // When
    const res = await fetch('/api/management/processors', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {
        id: 915,
        name: 'Processor name updated',
        description: `some description updated`
      }
    });

    // Then
    expect(res.ok).toBeTruthy();
    const [updatedProcessor] = await db('processors').where({ id: 915 });
    expect(updatedProcessor).toEqual(
      expect.objectContaining({
        id: 915,
        name: 'Processor name updated',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
        description: `some description updated`,
        scopes: expect.arrayContaining(['email', 'first name'])
      })
    );
  });
});

describe('Remove processors', () => {
  // The DELETE endpoint is currently waiting for Quorum developments, leave this empty for now
});

describe('TEST - Add processor used for development', () => {
  it('should not allow adding processors without a management managementToken', async () => {
    // Given and When
    const res = await fetch('/api/management/processors/TEST', {
      method: 'POST'
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it('should not allow an empty body', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });

    // When
    const res = await fetch('/api/management/processors/TEST', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {}
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not add a processor without a name', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });

    // When
    const res = await fetch('/api/management/processors/TEST', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {
        description: 'Some description'
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow processor with ID', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });

    // When
    const res = await fetch('/api/management/processors/TEST', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {
        id: 123,
        name: 'abc'
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: '"id" is not allowed'
      })
    );
  });

  it('should not allow a processor with an arbitrary key', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });

    // When
    const res = await fetch('/api/management/processors/TEST', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {
        blabla: 123,
        name: 'abc'
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: '"blabla" is not allowed'
      })
    );
  });

  it('should not allow improper address format', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });

    // When
    const res = await fetch('/api/management/processors/TEST', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {
        name: 'abc',
        address: '1234'
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow scopes that are not an array', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });

    // When
    const res = await fetch('/api/management/processors/TEST', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {
        name: 'abc',
        scopes: 'some scopes'
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should verify the type of the name parameter', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });

    // When
    const res = await fetch('/api/management/processors/TEST', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {
        name: 123
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should add a new processor and update the smart-contract', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });

    let payload = {
      name: 'Processor 123ABC unique name',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
      description: `some description`,
      scopes: ['email', 'first name']
    };

    // When
    const res = await fetch('/api/management/processors/TEST', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: payload
    });

    // Then
    expect(res.ok).toBeTruthy();
    const [processor] = await db('processors').where({
      name: 'Processor 123ABC unique name'
    });
    expect(processor).toBeDefined();
    expect(processor).toEqual(
      expect.objectContaining({
        name: 'Processor 123ABC unique name',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
        description: `some description`,
        scopes: ['email', 'first name']
      })
    );
    const [processorAddress] = await db('processor_address').where({ processor_id: processor.id });
    expect(processorAddress).toBeDefined();
    expect(await isProcessor(processorAddress.address)).toBeTruthy();
  });
});

describe('TEST - Remove processors used for development', () => {
  it('should not allow to delete processors without a management managementToken', async () => {
    // Given & When
    const res = await fetch('/api/management/processors/TEST', {
      method: 'DELETE'
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it('should not allow missing processors IDS', async () => {
    // Given
    const managementToken = await managementJWT.sign({
      id: 1
    });

    // When
    const res = await fetch('/api/management/processors/TEST', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow empty processor IDs array', async () => {
    // Given
    const managementToken = await managementJWT.sign({
      id: 1
    });

    // When
    const res = await fetch('/api/management/processors/TEST', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${managementToken}`,
        body: {}
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow strings in processors IDs', async () => {
    // Given
    const managementToken = await managementJWT.sign({
      id: 1
    });

    // When
    const res = await fetch('/api/management/processors/TEST', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {
        processorIds: [123, 'bla']
      }
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should remove processors from DB and smart-contract', async () => {
    // Given
    const managementToken = await managementJWT.sign({ id: 1 });
    await db('processors').insert({
      id: 1,
      name: 'Processor 1'
    });
    await db('processor_address').insert({
      processor_id: 1,
      address: '0x0000000000000000000000000000000000000001'
    });

    await db('processors').insert({
      id: 2,
      name: 'Processor 2'
    });
    await db('processor_address').insert({
      processor_id: 2,
      address: '0x0000000000000000000000000000000000000002'
    });

    // When
    const removedProcessorIds = [1];
    const res = await fetch('/api/management/processors/TEST', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${managementToken}`
      },
      body: {
        processorIds: removedProcessorIds
      }
    });

    // Then
    expect(res.ok).toBeTruthy();
    expect(await db('processors').where({ id: 1 })).toHaveLength(0);
    expect(await db('processors').where({ id: 2 })).toHaveLength(1);
    expect(await isProcessor('0x0000000000000000000000000000000000000001')).toBeFalsy();
    expect(await isProcessor('0x0000000000000000000000000000000000000002')).toBeTruthy();
  });
});
