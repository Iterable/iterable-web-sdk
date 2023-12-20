const path = require('path');
const env = require('dotenv').config({ path: './.env' });
const webpack = require('webpack');
const { version } = require('./package.json');
const CopyPlugin = require('copy-webpack-plugin');

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
  mode: 'development',
  entry: './dist/index.js',
  output: {
    filename: './index.js',
    path: path.resolve(__dirname),
    library: '@iterable/web-sdk',
    libraryTarget: 'umd'
  },
  devServer: {
    port: 8000,
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    },
    devMiddleware: {
      writeToDisk: true
    }
  },
  devtool: 'eval',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(getParsedEnv())
    }),
    new CopyPlugin({
      patterns: [{ from: './src/assets', to: './dist/assets' }]
    })
  ],
  watchOptions: {
    ignored: /node_modules/
  }
};
