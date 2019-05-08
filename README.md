##### webpack 多页面插件
```
npm i multiple-page-webpack-plugin -D
```
```
//动态获取entry
entry:MultiplePageWebpackPlugin.getEntry(path.resolve(__dirname, './libs/**/*.js'))
```
```
//动态获取entry和template
entry:MultiplePageWebpackPlugin.getEntry({
  entry: path.resolve(__dirname, './pages/**/*.js'),
  template: path.resolve(__dirname, './pages/**/*.html')
})
plugins: [
  new MultiplePageWebpackPlugin()
  ...
]
```
```
entry:MultiplePageWebpackPlugin.getEntry({
  entry: path.resolve(__dirname, './pages/**/*.js'),
  template: path.resolve(__dirname, './pages/**/*.html')
})
plugins: [
  new MultiplePageWebpackPlugin(({entry, template})=>{\
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
