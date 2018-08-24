import 'es6-promises';
import Config from './config';
import Modules from './modules';
import { SDKError } from './common/exceptions';
import * as Helpers from './utils/helpers';
import Events, { EventTypes } from './events';

/**
 * Creates a new CG ClearGDPR API client
 * @constructor
 * @classdesc The CG SDK class provides methods to manage user's data
 * @param {Object}  options
 * @param {String}  options.apiKey Key used to sign up to the API
 * @param {String}  options.apiUrl URL to the API server without trailing slash
 * @param {String}  options.apiVersion (optional) Version of the API, like `v1`
 * @param {String}  options.apiTimeout (optional) Timeout used when a Request is made to the API
 * @param {Boolean} options.debug (optional) Flag to enable or disable complete error stack trace
 * @see {@link https://docs.cleargdpr.com/api}
 */
export class CG {
  constructor({ apiKey, apiUrl }) {
    if (!apiKey) {
      throw new SDKError('API Key is required.');
    }

    if (!apiUrl) {
      throw new SDKError('API URL is required.');
    }

    this._config = Helpers.mergeOptions(Config, { apiUrl });
    this.Events = new Events();
    this.setAPIKey(apiKey);
    this.registerModules();
  }

  registerModules() {
    Object.keys(Modules).map(key => {
      const endpoint = new Modules[key](this);
      Object.assign(this, { [key]: endpoint });
    });
  }

  getAccessToken() {
    return this._config.auth;
  }

  setAccessToken(accessToken) {
    if (accessToken) {
      this._setConfigField('auth', `Bearer ${accessToken}`);
      this.Events.emit(EventTypes.SET_ACCESS_TOKEN, accessToken);
    }
  }

  getAPIKey() {
    return this._config.auth;
  }

  setAPIKey(apiKey) {
    if (apiKey) {
      this._setConfigField('apiKey', apiKey);
      this.Events.emit(EventTypes.SET_API_KEY, apiKey);
    }
  }

  getBaseURL() {
    return this._config.apiVersion
      ? `${this._config.apiUrl}/${this._config.apiVersion}`
      : this._config.apiUrl;
  }

  _setConfigField(key, value) {
    this._config[key] = value;
  }
}
