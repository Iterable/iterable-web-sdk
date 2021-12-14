const path = require('path');
const env = require('dotenv').config({ path: './.env' });
const webpack = require('webpack');
const { version } = require('./package.json');

function getParsedEnv() {
  if (!env.error) {
    return {
      ...env.parsed,
      VERSION: version
    };
  }

  return { VERSION: version };
}

module.exports = {
  mode: 'production',
  entry: './dist/index.js',
  output: {
    filename: './index.js',
    path: path.resolve(__dirname),
    library: '@iterable/web-sdk',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(getParsedEnv())
    })
  ]
};
