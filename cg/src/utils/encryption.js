const sodium = require('libsodium-wrappers');
const { sha3 } = require('./blockchain');

const APP_KEY_HEX = process.env.APP_KEY_HEX;

function mergeTypedArray(a, b) {
  const c = new Uint8Array(a.length + b.length);
  c.set(a);
  c.set(b, a.length);
  return c;
}

function encryptWithNonce(message, key) {
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const nonceWithCipher = mergeTypedArray(nonce, sodium.crypto_secretbox_easy(message, nonce, key));
  return sodium.to_hex(nonceWithCipher);
}

function decryptWithNonce(nonceWithCipherHex, key) {
  const nonceWithCipher = sodium.from_hex(nonceWithCipherHex);
  if (
    nonceWithCipher.length <
    sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES
  ) {
    throw new Error('Message too short to be decrypted');
  }
  const nonce = nonceWithCipher.slice(0, sodium.crypto_secretbox_NONCEBYTES),
    ciphertext = nonceWithCipher.slice(sodium.crypto_secretbox_NONCEBYTES);
  return sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
}

function encryptClientKey(clientKey) {
  const encryptedKey = encryptWithNonce(sodium.to_hex(clientKey), sodium.from_hex(APP_KEY_HEX));
  return encryptedKey;
}

function decryptClientKey(encryptedKey) {
  return sodium.from_hex(decryptWithNonce(encryptedKey, sodium.from_hex(APP_KEY_HEX)));
}

function generateClientKey() {
  const key = sodium.crypto_secretstream_xchacha20poly1305_keygen();
  return encryptClientKey(key);
}

function encryptForStorage(data, encryptedClientKey) {
  if (typeof data !== 'string') {
    throw new Error('Data must be a string');
  }
  const clientKey = decryptClientKey(encryptedClientKey);
  const encryptedData = encryptWithNonce(data, clientKey);

  return encryptedData;
}

function decryptFromStorage(encryptedData, encryptedKey) {
  const clientKey = decryptClientKey(encryptedKey);
  const data = sodium.to_string(decryptWithNonce(encryptedData, clientKey));

  return data;
}

function hash(clearText) {
  return sha3(clearText);
}

module.exports = {
  generateClientKey,
  encryptForStorage,
  decryptFromStorage,
  hash
};
