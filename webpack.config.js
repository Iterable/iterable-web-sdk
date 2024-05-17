const path = require('path');
const env = require('dotenv').config({ path: './.env' });
const webpack = require('webpack');
const { version } = require('./package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function getParsedEnv() {
  if (!env.error) {
    return {
      ...env.parsed,
      VERSION: version,
      IS_EU_ITERABLE_SERVICE: process.env.IS_EU_ITERABLE_SERVICE || false
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
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'dist/assets/' // Output directory for images
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css']
  }
};
