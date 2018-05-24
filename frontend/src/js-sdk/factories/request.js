import fetch from 'isomorphic-fetch';
import { buildRequestBody, parseJSON } from '../utils/helpers';

export default class RequestFactory {
  constructor(config) {
    this.config = config;
  }

  request(endpoint, opt = {}) {
    const apiKey = this.config.getAPIKey();
    const accessToken = this.config.getAccessToken();
    const apiBaseURL = this.config.getBaseURL();
    const endpointURL = `${apiBaseURL}/${endpoint}`;
    const options = {
      method: opt.method || 'GET',
      body: buildRequestBody(opt.payload),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        Authorization: accessToken
      }
    };

    const promise = new Promise((resolve, reject) => {
      return fetch(endpointURL, options)
        .then(parseJSON)
        .then(res => {
          if (!res.ok) {
            reject(res.data);
          }
          resolve(res.data);
        })
        .catch(err => reject(err));
    });

    return promise;
  }
}
