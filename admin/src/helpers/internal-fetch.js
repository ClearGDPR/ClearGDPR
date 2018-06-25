import merge from 'lodash/object/merge';
import session from '../../helpers/Session';

const internalFetch = (url, config = {}) => {
  const internalConfig = merge(
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.getToken()}`,
        'Content-Type': 'application/json'
      }
    },
    config
  );
  return fetch(url, internalConfig).then(async res => {
    if (res.status === 400 && (await res.json()).error === 'JWT token expired') {
      session.destroy();
    } else {
      return res;
    }
  });
};

export default internalFetch;
