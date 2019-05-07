const path = require('path')
const multiHtmlWebpackBuildPlugin = require('../../lib')

module.exports = {
  mode: 'production',
  entry: multiHtmlWebpackBuildPlugin.getEntry({
    entry: path.resolve(__dirname, './pages/**/*.js'),
    template: path.resolve(__dirname, './pages/**/*.html')
  }),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'static/[name].js',
    publicPath: '/'
  },
  plugins: [
    new multiHtmlWebpackBuildPlugin({
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
