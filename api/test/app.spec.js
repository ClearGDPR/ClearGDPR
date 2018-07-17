const { initResources, fetch, closeResources } = require('./utils');

describe('App', () => {
  beforeAll(initResources);

  it('Home page should return a message', async () => {
    const res = await fetch('/');
    expect(res.status).toEqual(200);
    expect(await res.text()).toEqual('<p>Hello Boilerplate</p>');
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
      method: 'OPTIONS'
    });

    expect(res.ok).toBeTruthy();
    expect(res.headers.get('access-control-allow-origin')).toEqual(
      process.env.ALLOWED_REQUEST_ORIGIN
    );
  });

  afterAll(closeResources);
});
