const path = require('path');
const env = require('dotenv').config({ path: './.env' });
const webpack = require('webpack');
const { version } = require('./package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
  target: 'node',
  output: {
    filename: './index.node.js',
    path: path.resolve(__dirname),
    library: '@iterable/web-sdk',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': `(${JSON.stringify(getParsedEnv())})`
    }),
    new MiniCssExtractPlugin({
      filename: 'dist/components/style.css' // Output CSS filename
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
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};
