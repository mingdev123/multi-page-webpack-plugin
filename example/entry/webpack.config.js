const path = require('path')
const multiHtmlWebpackBuildPlugin = require('multiple-page-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: multiHtmlWebpackBuildPlugin.getEntry(path.resolve(__dirname, './libs/**/*.js')),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    entrypoints: false
  }
}
