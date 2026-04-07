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

  return {
    VERSION: version
  };
}

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  experiments: {
    outputModule: true
  },
  output: {
    filename: './index.esm.js',
    path: path.resolve(__dirname),
    library: {
      type: 'module'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(getParsedEnv())
    }),
    new MiniCssExtractPlugin({
      filename: 'dist/components/style.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: require('./.babelrc.esm.js')
        },
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
              outputPath: 'dist/assets/'
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
