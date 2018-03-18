const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['es6-shim', './src/main'],
  mode: 'development',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ]
  },
  plugins: [
    new HtmlPlugin({ title: 'Multifunction Gizmo' })
  ]
};
