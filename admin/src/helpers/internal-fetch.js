import { merge } from 'lodash/object';
import session from './Session';
import { toast } from 'react-toastify';

const internalFetch = (url, config = {}) => {
  const baseConfig = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const token = session.getToken();
  if (token) {
    baseConfig.headers['Authorization'] = `Bearer ${token}`;
  }

  const internalConfig = merge(baseConfig, config);

  return fetch(url, internalConfig)
    .then(async res => {
      if (res.status === 204) {
        return;
      }

      let resBody;
      try {
        resBody = await res.json();
      } catch (e) {
        console.error('Could not parse json response');
        throw new Error('Unknown error occurred');
      }

      if (res.status === 400 && resBody.error === 'JWT token expired') {
        session.destroy();
        window.location.assign('/login?expired=1');
        return;
        // throw new Error('Session expired');
      }
      if (res.status >= 400) {
        const error = new Error(resBody.message || resBody.error || 'Unknown error occurred');
        error.status = res.status;
        throw error;
      }
      return resBody;
    })
    .catch(e => {
      toast.error(e.message || 'A network error occurred');
      return Promise.reject(e);
    });
};

export default internalFetch;
