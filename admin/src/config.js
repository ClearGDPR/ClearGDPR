const envs = {
  development: {
    API_URL: 'http://localhost:8082'
  },
  staging: {
    API_URL: 'http://localhost:8082'
  },
  production: {
    API_URL: 'http://localhost:8082'
  }
};

const config = Object.assign({}, envs[process.env.NODE_ENV]);

export default config;
