const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['es6-shim', './src/main'],
  mode: 'development',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new HtmlPlugin({ title: 'Multifunction Gizmo' })
  ]
};
