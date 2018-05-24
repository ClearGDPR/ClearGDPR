const encryption = require('./../../src/utils/encryption');

describe('Encryption Utilities', () => {
  describe('generateClientKey', () => {
    it('Should generate a key that can be decrypted with the app key', () => {
      const key = encryption.generateClientKey();
      expect(typeof key).toBe('string');
      expect(key).toHaveLength(208);
    });
  });

  describe('encryptForStorage', () => {
    it('Should encrypt the data', () => {
      const key = encryption.generateClientKey();
      const encryptedData = encryption.encryptForStorage('data', key);
      expect(typeof encryptedData).toBe('string');
      expect(encryptedData.length).toBeGreaterThan(32);
    });

    it('Should error when no data is passed', () => {
      expect(() => encryption.encryptForStorage()).toThrowError();
    });
    it('should error when no key is passed', () => {
      expect(() => encryption.encryptForStorage('data')).toThrowError();
    });
  });

  describe('decryptFromStorage', () => {
    it('Should decrypt the data as expected', () => {
      const key = encryption.generateClientKey();
      const encryptedData = encryption.encryptForStorage('data', key);
      expect(typeof encryptedData).toBe('string');
      expect(encryptedData.length).toBeGreaterThan(32);

      const decryptedData = encryption.decryptFromStorage(encryptedData, key);
      expect(decryptedData).toBe('data');
    });
    it('Should error when given bad data', () => {
      const key = encryption.generateClientKey();
      expect(() => encryption.decryptFromStorage('bad-data', key)).toThrowError();
    });
    it('Should error when given a bad key', () => {
      const key = encryption.generateClientKey();
      const encryptedData = encryption.encryptForStorage('data', key);
      expect(() => encryption.decryptFromStorage(encryptedData, 'wrongkey')).toThrowError();
    });
  });
});
