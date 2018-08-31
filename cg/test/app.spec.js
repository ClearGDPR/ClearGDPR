const { initResources, fetch, closeResources } = require('./utils');

describe('App', () => {
  beforeAll(initResources);

  it('Home page should return a message', async () => {
    const res = await fetch('/');
    expect(res.status).toEqual(200);
  });

  it('Healthz should return a JSON with status OK', async () => {
    const res = await fetch('/healthz');
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({ status: 'OK' });
  });

  it('Long healthz should return a JSON with status OK', async () => {
    const res = await fetch(`/healthz/long/${process.env.HEALTH_CHECK_SECRET}`);
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({ db: 'OK' });
  });

  it('OPTIONS should return proper allowed origins', async () => {
    const res = await fetch('/', {
      method: 'OPTIONS',
      headers: {
        origin: 'http://google.com'
      }
    });

    expect(res.headers.get('access-control-allow-origin')).toBeFalsy();

    const res2 = await fetch('/', {
      method: 'OPTIONS',
      headers: {
        origin: process.env.ALLOWED_REQUEST_ORIGIN.split(',')[0]
      }
    });
    expect(res2.headers.get('access-control-allow-origin')).toBeTruthy();

    const res3 = await fetch('/', {
      method: 'OPTIONS',
      headers: {
        origin: process.env.ALLOWED_REQUEST_ORIGIN.split(',')[1]
      }
    });

    expect(res3.headers.get('access-control-allow-origin')).toBeTruthy();
  });

  afterAll(closeResources);
});
