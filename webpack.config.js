const path = require('path');

module.exports = {
  mode: 'production',
  entry: './dist/index.js',
  output: {
    filename: './index.js',
    path: path.resolve(__dirname),
    library: 'base-module',
    libraryTarget: 'umd'
  }
};
