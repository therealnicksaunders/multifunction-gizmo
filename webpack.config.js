const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main',
  mode: 'development',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlPlugin({ title: 'Multifunction Gizmo' })
  ]
};
