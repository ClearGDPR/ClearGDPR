const { initResources, fetch, closeResources } = require('../utils');
const { db } = require('../../src/db');

beforeAll(initResources);

afterAll(closeResources);

describe('Listing processors', () => {
  it('should return the processors', async () => {
    await db('processors').insert({
      id: 121,
      name: 'Processor 1',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
      description: `The free foundation is a non-profit and will process your data only to keep 
      track of donations and be able to thank you for support`,
      scopes: JSON.stringify(['email', 'first name'])
    });

    await db('processors').insert({
      id: 125,
      name: 'Processor 2'
    });

    await db('processors').insert({
      id: 124,
      name: 'Processor 3'
    });

    const res = await fetch(`/api/subject/processors`, {
      id: 123,
      method: 'GET'
    });

    expect(await res.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: 'Processor 1',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Free_logo.svg',
          description: `The free foundation is a non-profit and will process your data only to keep 
      track of donations and be able to thank you for support`,
          scopes: expect.arrayContaining(['email', 'first name'])
        }),
        expect.objectContaining({
          id: expect.any(Number),
          name: 'Processor 2'
        }),
        expect.objectContaining({
          id: expect.any(Number),
          name: 'Processor 3'
        })
      ])
    );
  });
});
