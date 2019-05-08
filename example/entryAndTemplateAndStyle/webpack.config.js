const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const MultiplePageWebpackPlugin = require('multiple-page-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: MultiplePageWebpackPlugin.getEntry({
    entry: path.resolve(__dirname, './pages/**/*.js'),
    style: path.resolve(__dirname, './pages/**/*.css'),
    template: path.resolve(__dirname, './pages/**/*.html')
  }),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'static/[name].js',
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    }]
  },
  plugins: [
    new MultiplePageWebpackPlugin({
      minify: {
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true
      },
      meta: {
        'Content-Type': {'http-equiv': 'Content-Type', 'content': 'text/html; charset=UTF-8'},
        'renderer': 'webkit',
        'X-UA-Compatible': {'http-equiv': 'X-UA-Compatible', 'content': 'IE=Edge,chrome=1'},
        'Pragma': {'http-equiv': 'Pragma', 'content': 'no-cache'},
        'Cache-Control': {'http-equiv': 'Cache-Control', 'content': 'no-cache'},
        'Expires': {'http-equiv': 'Expires', 'content': '0'}
      }
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].css',
      chunkFilename: 'static/css/[id].css',
    })
  ],
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    entrypoints: false
  }
}
