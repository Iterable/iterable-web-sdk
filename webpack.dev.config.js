const path = require('path');

module.exports = {
  mode: 'development',
  entry: './dist/index.js',
  output: {
    filename: './index.js',
    path: path.resolve(__dirname),
    library: '@iterable/web-sdk',
    libraryTarget: 'umd'
  },
  devServer: {
    static: {
      directory: './dist'
    },
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  },
  devtool: 'eval'
};
