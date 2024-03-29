const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const env = require('dotenv').config({ path: './.env' });
const webpack = require('webpack');

module.exports = {
  mode: 'development',
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
        use: [MiniCssExtractPlugin.loader, 'css-loader']
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
    static: {
      directory: path.resolve(__dirname, './assets'),
      publicPath: '/assets'
    },
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
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
      'process.env': JSON.stringify(!env.error ? env.parsed : {})
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
};
