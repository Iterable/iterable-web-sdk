const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const env = require('dotenv').config({ path: './.env' });
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      src: path.resolve(__dirname, 'src/'),
      '@iterable/web-sdk': path.resolve(__dirname, '../')
    }
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'ts', 'tsx', 'jsx']
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env.parsed)
    })
  ]
};
