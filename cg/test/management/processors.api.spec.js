jest.mock('../../src/utils/blockchain/web3-provider-factory');
jest.mock('../../src/utils/blockchain');

const { initResources, fetch, closeResources } = require('../utils');
const { managementJWT } = require('../../src/utils/jwt');
const { db } = require('../../src/db');
const { Unauthorized, BadRequest, NotFound } = require('../../src/utils/errors');
const blockchain = require('../../src/utils/blockchain');

beforeAll(initResources);

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(closeResources);

describe('List processors', () => {
  it('should not allow listing processors without a token', async () => {
    const res = await fetch('/api/management/processors', {
      method: 'DELETE'
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it('should return processors with addresses', async () => {
    const token = await managementJWT.sign({
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

    const res = await fetch('/api/management/processors', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

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
  it('should not allow adding processors without a token', async () => {
    const res = await fetch('/api/management/processors', {
      method: 'POST'
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it('should not allow empty body', async () => {
    const token = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/processors', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {}
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow processor without a name', async () => {
    const token = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/processors', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        description: 'Some description'
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow processor with ID', async () => {
    const token = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/processors', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        id: 123,
        name: 'abc'
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: '"id" is not allowed'
      })
    );
  });

  it('should not allow processor with arbitrary key', async () => {
    const token = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/processors', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        blabla: 123,
        name: 'abc'
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: '"blabla" is not allowed'
      })
    );
  });

  it('should not allow improper address format', async () => {
    const token = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/processors', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        name: 'abc',
        address: '1234'
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow scopes that are not an array', async () => {
    const token = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/processors', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        name: 'abc',
        scopes: 'some scopes'
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should verify the types of name parameter', async () => {
    const token = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/processors', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        name: 123
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should add new processor and update the blockchain', async () => {
    const token = await managementJWT.sign({ id: 1 });

    let payload = {
      name: 'Processor 123ABC unique name',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
      description: `some description`,
      scopes: ['email', 'first name'],
      address: '0x00000000000000000000000000000000000000A5'
    };

    const res = await fetch('/api/management/processors', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: payload
    });

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

    const [address] = await db('processor_address').where({ processor_id: processor.id });
    expect(address).toBeDefined();
    expect(address.address).toEqual(payload.address);

    expect(blockchain.setProcessors).toHaveBeenCalledWith(
      expect.arrayContaining([payload.address])
    );
  });
});

describe('Update processor', () => {
  it('should not allow the update of the processor without a token', async () => {
    const res = await fetch('/api/management/processors', {
      method: 'PUT'
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it('should not allow empty body', async () => {
    const token = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/processors', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {}
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow processor without an ID', async () => {
    const token = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/processors', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        name: 'abc',
        description: 'some desc'
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow updating an address', async () => {
    const token = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/processors', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        id: 19838,
        name: 'abc',
        address: '0x0000000000000000000000000000000000000001'
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: '"address" is not allowed'
      })
    );
  });

  it('should return not found when processor does not exist', async () => {
    const token = await managementJWT.sign({ id: 1 });

    const res = await fetch('/api/management/processors', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        id: 19838,
        name: 'abc'
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(NotFound.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        error: 'Processor not found'
      })
    );
  });

  it('should update existing processor and not update the blockchain', async () => {
    const token = await managementJWT.sign({ id: 1 });

    await db('processors').insert({
      id: 912,
      name: 'Processor name',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
      description: `some description`,
      scopes: JSON.stringify(['email', 'first name'])
    });

    const res = await fetch('/api/management/processors', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        id: 912,
        name: 'Processor name updated',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo1.svg',
        description: `some description updated`,
        scopes: ['email', 'first name', 'aaa']
      }
    });

    expect(res.ok).toBeTruthy();

    const [updatedProcessor] = await db('processors').where({ id: 912 });
    expect(updatedProcessor).toEqual(
      expect.objectContaining({
        id: 912,
        name: 'Processor name updated',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo1.svg',
        description: `some description updated`,
        scopes: expect.arrayContaining(['email', 'first name', 'aaa'])
      })
    );

    expect(blockchain.setProcessors).not.toHaveBeenCalled();
  });

  it('should update only provided data', async () => {
    const token = await managementJWT.sign({ id: 1 });

    await db('processors').insert({
      id: 915,
      name: 'Processor name',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
      description: `some description`,
      scopes: JSON.stringify(['email', 'first name'])
    });

    const res = await fetch('/api/management/processors', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        id: 915,
        name: 'Processor name updated',
        description: `some description updated`
      }
    });

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
  it('should not allow the delete processors without a token', async () => {
    const res = await fetch('/api/management/processors', {
      method: 'DELETE'
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
  });

  it('should not allow missing IDS', async () => {
    const token = await managementJWT.sign({
      id: 1
    });

    const res = await fetch('/api/management/processors', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow empty IDs array', async () => {
    const token = await managementJWT.sign({
      id: 1
    });

    const res = await fetch('/api/management/processors', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        body: {}
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('should not allow numbers in processors IDs', async () => {
    const token = await managementJWT.sign({
      id: 1
    });

    const res = await fetch('/api/management/processors', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        processorIds: [123, 'bla']
      }
    });

    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);

    expect(await res.json()).toMatchSnapshot();
  });

  it('should remove processors from DB and blockchain', async () => {
    const token = await managementJWT.sign({
      id: 1
    });

    await db('processors').insert({
      id: 655,
      name: 'Processor 1'
    });
    await db('processor_address').insert({
      processor_id: 655,
      address: '0x0000000000000000000000000000000000000001'
    });

    await db('processors').insert({
      id: 612,
      name: 'Processor 2'
    });
    await db('processor_address').insert({
      processor_id: 612,
      address: '0x0000000000000000000000000000000000000002'
    });

    await db('processors').insert({
      id: 687,
      name: 'Processor 3'
    });
    await db('processor_address').insert({
      processor_id: 687,
      address: '0x0000000000000000000000000000000000000003'
    });

    await db('processors').insert({
      id: 694,
      name: 'Processor 4'
    });
    await db('processor_address').insert({
      processor_id: 694,
      address: '0x0000000000000000000000000000000000000004'
    });

    const removedProcessorIds = [612, 655];

    const res = await fetch('/api/management/processors', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        processorIds: removedProcessorIds
      }
    });

    expect(res.ok).toBeTruthy();
    expect(
      await db('processors').where({
        id: 612
      })
    ).toHaveLength(0);
    expect(
      await db('processors').where({
        id: 655
      })
    ).toHaveLength(0);
    expect(blockchain.setProcessors).toBeCalledWith(
      expect.arrayContaining([
        '0x0000000000000000000000000000000000000003',
        '0x0000000000000000000000000000000000000004'
      ])
    );
  });
});
