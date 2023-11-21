const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    'repositree': './lib/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'repositree',
    umdNamedDefine: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: '/node_modules/',
        loader: 'babel-loader',
      },
    ],
  },
  target: 'node',
}
