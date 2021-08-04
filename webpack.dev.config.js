const path = require('path');
const env = require('dotenv').config({ path: './.env' });
const webpack = require('webpack');

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
    contentBase: './dist',
    port: 8000
  },
  devtool: 'eval',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env.parsed)
    })
  ]
};
