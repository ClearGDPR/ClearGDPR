const paths = require('./paths');
const libraryName = 'cleargdpr';
const outputFile = libraryName + '.min.js';

const config = {
  bail: true, // Don't attempt to continue if there are any errors.
  mode: 'production',
  entry: [require.resolve('./polyfills'), paths.appIndexJs],
  devtool: 'source-map',
  output: {
    path: paths.appBuild,
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  }
};

module.exports = config;
