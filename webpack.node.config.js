const path = require('path');
const env = require('dotenv').config({ path: './.env' });
const webpack = require('webpack');

function getParsedEnv() {
  if (!env.error) {
    return env.parsed;
  }

  return {};
}

module.exports = {
  mode: 'production',
  entry: './dist/index.js',
  target: 'node',
  output: {
    filename: './index.node.js',
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
