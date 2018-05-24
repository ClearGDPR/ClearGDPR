import { merge } from 'lodash/object';

export function parseJSON(response) {
  const contentType = response.headers.get('Content-Type');

  if (contentType.indexOf('application/json') > -1) {
    return new Promise(resolve =>
      response.json().then(json => {
        return resolve({
          status: response.status,
          ok: response.ok,
          data: json
        });
      })
    );
  } else {
    return new Promise(resolve =>
      response.text().then(text => {
        return resolve({
          status: response.status,
          ok: response.ok,
          data: text
        });
      })
    );
  }
}

export function buildRequestBody(body) {
  return body ? JSON.stringify(body) : null;
}

/**
 * Merges objects values
 * @param {Object} options objects to be merged
 * @returns {Object} New merged object based on params
 */
export function mergeOptions(...objects) {
  return merge(...objects);
}
