export default class TestUtils {
  static flushPromises() {
    // or: return new Promise(res => process.nextTick(res));
    return new Promise(resolve => setImmediate(resolve));
  }
}
