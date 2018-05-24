const { initResources, fetch, integration, appUnit, closeResources } = require('./utils');

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

  integration('Long healthz should return a JSON with status OK', async () => {
    const res = await fetch(`/healthz/long/${process.env.HEALTH_CHECK_SECRET}`);
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({ db: 'OK' });
  });

  appUnit('robots.txt should allow indexing', async () => {
    process.env.ROBOTS_INDEX = 'true';
    const res = await fetch('/robots.txt');
    expect(res.status).toEqual(200);
    expect(await res.text()).toEqual('User-agent: *\nDisallow:\n');
  });

  appUnit('robots.txt should prevent indexing', async () => {
    process.env.ROBOTS_INDEX = 'false';
    const res = await fetch('/robots.txt');
    expect(res.status).toEqual(200);
    expect(await res.text()).toEqual('User-agent: *\nDisallow: /\n');
  });

  afterAll(closeResources);
});
