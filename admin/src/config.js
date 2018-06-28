function buildPrefixedApiUri(prefix) {
  const location = window.location;
  let parts = location.hostname.split('.');
  if (parts.length > 2) {
    parts.shift();
  }

  const hostname = parts.join('.');

  return (
    location.protocol +
    '//' +
    prefix +
    '.' +
    hostname +
    `${location.port ? `:${location.port}` : ''}`
  );
}

class Config {
  static get API_URL() {
    return window.location.hostname === 'localhost'
      ? 'http://localhost:8082'
      : buildPrefixedApiUri('cg-demo');
  }
}

export default Config;
