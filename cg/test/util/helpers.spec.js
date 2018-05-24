jest.mock('bluebird');
const Promise = require('bluebird');
const winston = require('winston');
require('winston-spy');

const { retryAsync } = require('../../src/utils/helpers');

describe('Retry async', () => {
  const winstonSpy = jest.fn(() => console.log('Spy is spying'));

  beforeAll(() => {
    winston.remove(winston.transports.Console);
    winston.add(winston.transports.SpyLogger, { spy: winstonSpy, level: 'silly' });
  });

  afterAll(() => {
    winston.remove(winston.transports.SpyLogger);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should retry 3 times if no options provided', async () => {
    const callCounter = jest.fn();
    const mockPromise = async () => {
      callCounter();
      throw new Error(`I'm a test error`);
    };

    await retryAsync(mockPromise);

    expect(callCounter).toHaveBeenCalledTimes(3);
    expect(winstonSpy.mock.calls.filter(([logSeverity]) => logSeverity === 'info')).toHaveLength(3);
    expect(winstonSpy.mock.calls.filter(([logSeverity]) => logSeverity === 'debug')).toHaveLength(
      3
    );
    expect(winstonSpy.mock.calls.filter(([logSeverity]) => logSeverity === 'error')).toHaveLength(
      1
    );
    expect(Promise.delay).toHaveBeenCalledTimes(3);
    expect(Promise.delay).toHaveBeenLastCalledWith(1000);
  });

  it('should return value after successful result on last attempt', async () => {
    const callCounter = jest.fn();
    let count = 0;
    const mockPromise = async () => {
      count++;
      callCounter();
      if (count < 3) {
        throw new Error(`I'm a test error`);
      } else {
        return 'good result';
      }
    };

    const result = await retryAsync(mockPromise);

    expect(result).toEqual('good result');
    expect(callCounter).toHaveBeenCalledTimes(3);
    expect(winstonSpy.mock.calls.filter(([logSeverity]) => logSeverity === 'info')).toHaveLength(2);
    expect(winstonSpy.mock.calls.filter(([logSeverity]) => logSeverity === 'debug')).toHaveLength(
      2
    );
    expect(winstonSpy.mock.calls.filter(([logSeverity]) => logSeverity === 'error')).toHaveLength(
      0
    );
    expect(Promise.delay).toHaveBeenCalledTimes(3);
    expect(Promise.delay).toHaveBeenLastCalledWith(1000);
  });

  it('should resolve on 2. successful attempt', async () => {
    const callCounter = jest.fn();
    let count = 0;
    const mockPromise = async () => {
      count++;
      callCounter();
      if (count < 2) {
        throw new Error(`I'm a test error`);
      } else {
        return 'good result';
      }
    };

    const result = await retryAsync(mockPromise);

    expect(result).toEqual('good result');
    expect(callCounter).toHaveBeenCalledTimes(2);
    expect(winstonSpy.mock.calls.filter(([logSeverity]) => logSeverity === 'info')).toHaveLength(1);
    expect(winstonSpy.mock.calls.filter(([logSeverity]) => logSeverity === 'debug')).toHaveLength(
      1
    );
    expect(winstonSpy.mock.calls.filter(([logSeverity]) => logSeverity === 'error')).toHaveLength(
      0
    );
    expect(Promise.delay).toHaveBeenCalledTimes(2);
    expect(Promise.delay).toHaveBeenLastCalledWith(500);
  });

  it('should resolve on 1. successful attempt', async () => {
    const callCounter = jest.fn();
    const mockPromise = async () => {
      callCounter();
      return 'good result';
    };

    const result = await retryAsync(mockPromise);

    expect(result).toEqual('good result');
    expect(callCounter).toHaveBeenCalledTimes(1);
    expect(winstonSpy.mock.calls.filter(([logSeverity]) => logSeverity === 'info')).toHaveLength(0);
    expect(winstonSpy.mock.calls.filter(([logSeverity]) => logSeverity === 'debug')).toHaveLength(
      0
    );
    expect(winstonSpy.mock.calls.filter(([logSeverity]) => logSeverity === 'error')).toHaveLength(
      0
    );
    expect(Promise.delay).toHaveBeenCalledTimes(1);
    expect(Promise.delay).toHaveBeenLastCalledWith(0);
  });

  it('should respect maxRetries option', async () => {
    const callCounter = jest.fn();
    const mockPromise = async () => {
      callCounter();
      throw new Error(`I'm a test error`);
    };

    await retryAsync(mockPromise, { maxRetries: 5 });

    expect(callCounter).toHaveBeenCalledTimes(5);
    expect(Promise.delay).toHaveBeenLastCalledWith(2000);
  });

  it('should respect interval option', async () => {
    const callCounter = jest.fn();
    const mockPromise = async () => {
      callCounter();
      throw new Error(`I'm a test error`);
    };

    await retryAsync(mockPromise, { interval: 2000 });

    expect(callCounter).toHaveBeenCalledTimes(3);
    expect(Promise.delay).toHaveBeenLastCalledWith(4000);
  });

  it('should respect interval and maxRetries options', async () => {
    const callCounter = jest.fn();
    const mockPromise = async () => {
      callCounter();
      throw new Error(`I'm a test error`);
    };

    await retryAsync(mockPromise, { interval: 2000, maxRetries: 8 });

    expect(callCounter).toHaveBeenCalledTimes(8);
    expect(Promise.delay).toHaveBeenLastCalledWith(14000);
  });
});
