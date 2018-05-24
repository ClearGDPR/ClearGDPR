import RequestFactory from '../factories/request';

export class ResourceBase {
  constructor(config) {
    this._request = new RequestFactory(config);
  }

  request(endpoint, options) {
    return this._request.request(endpoint, options);
  }
}
