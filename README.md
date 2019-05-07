##### webpack 多页面插件
```
npm i multi-html-webpack-build-plugin -D
```
```
//动态获取entry
entry:MultiHtmlWebpackBuildPlugin.getEntry(path.resolve(__dirname, './libs/**/*.js'))
```
```
//动态获取entry和template
entry:MultiHtmlWebpackBuildPlugin.getEntry({
  entry: path.resolve(__dirname, './pages/**/*.js'),
  template: path.resolve(__dirname, './pages/**/*.html')
})
plugins: [
  new MultiPageWebpackPlugin()
  ...
]
```
```
entry:MultiHtmlWebpackBuildPlugin.getEntry({
  entry: path.resolve(__dirname, './pages/**/*.js'),
  template: path.resolve(__dirname, './pages/**/*.html')
})
plugins: [
  new MultiPageWebpackPlugin(({entry, template})=>{\
    ...
    return {
      filename: entry + '.html',
      template,
      chunks: [entry]
    }
  })
  ...
]
```
