const path = require('path');

module.exports = {
  mode: 'production',
  entry: './dist/index.js',
  target: 'node',
  output: {
    filename: './index.node.js',
    path: path.resolve(__dirname),
    library: 'base-module',
    libraryTarget: 'umd'
  }
};
