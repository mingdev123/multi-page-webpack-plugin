##### webpack 多页面插件
```

```
```
//动态获取entry
entry:MultiPageWebpackPlugin.getEntry(path.resolve(__dirname, './libs/**/*.js'))
```
```
//动态获取entry和template
entry:MultiPageWebpackPlugin.getEntry({
  entry: path.resolve(__dirname, './pages/**/*.js'),
  template: path.resolve(__dirname, './pages/**/*.html')
})
plugins: [
  new MultiPageWebpackPlugin()
  ...
]
```
```
entry:MultiPageWebpackPlugin.getEntry({
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
