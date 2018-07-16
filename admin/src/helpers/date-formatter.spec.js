import format from './date-formatter';

describe('DateFormatter', () => {
  it('Should spit out the date in the expected format', () => {
    const date = new Date(1531758401763);
    expect(format(date)).toEqual('16/07/2018 4:26pm');
  });
});
