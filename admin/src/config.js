const location = window.location;

function buildPrefixedApiUri(prefix) {
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

const config = {
  // TODO: handle some way of configuring the API URL
  API_URL:
    location.hostname === 'localhost' ? 'http://localhost:8082' : buildPrefixedApiUri('cg-demo')
};

export default config;
