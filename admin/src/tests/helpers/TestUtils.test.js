import { flushPromises } from './TestUtils';

describe('(Helper) TestUtils', () => {
  it('should flush all promises', async () => {
    let a;
    let b;

    Promise.resolve()
      .then(() => {
        a = 1;
      })
      .then(() => {
        b = 2;
      });

    await flushPromises();

    expect(a).toBe(1);
    expect(b).toBe(2);
  });
});
