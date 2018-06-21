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

const env = {
  API_BASE:
    location.hostname === 'localhost' ? 'http://localhost:8080' : buildPrefixedApiUri('api-'),
  CG_API_BASE:
    location.hostname === 'localhost' ? 'http://localhost:8082' : buildPrefixedApiUri('cg-'),
  CG_API_KEY: 'notusedyet'
};

export default env;
