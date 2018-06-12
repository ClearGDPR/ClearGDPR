const location = window.location;

function buildPrefixedApiUri(prefix) {
  return (
    location.protocol +
    '//' +
    prefix +
    location.hostname +
    `${location.port ? `:${location.port}` : ''}`
  );
}

const config = {
  API_URL: location.hostname === 'localhost' ? 'http://localhost:8082' : buildPrefixedApiUri('cg-')
};

export default config;
