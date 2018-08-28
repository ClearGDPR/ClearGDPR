const paths = require('./paths');
const libraryName = 'cleargdpr';
const outputFile = libraryName + '.min.js';

const config = {
  // Don't attempt to continue if there are any errors.
  bail: true,
  mode: 'production',
  entry: [require.resolve('./polyfills'), paths.appIndexJs],
  devtool: 'source-map',
  output: {
    path: paths.appBuild,
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  // module: {
  //   loaders: [
  //     {
  //       test: /(\.jsx|\.js)$/,
  //       loader: 'babel',
  //       exclude: /(node_modules|bower_components)/
  //     },
  //     {
  //       test: /(\.jsx|\.js)$/,
  //       loader: "eslint-loader",
  //       exclude: /node_modules/
  //     }
  //   ]
  // },
  // resolve: {
  //   // root: path.resolve('./src'),
  //   extensions: ['', '.js']
  // },
  // plugins: [
    // new UglifyJsPlugin({ minimize: true })
  // ]
};

module.exports = config;