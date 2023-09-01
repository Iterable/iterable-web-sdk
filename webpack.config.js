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
  entry: './src/index.ts',
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
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};
