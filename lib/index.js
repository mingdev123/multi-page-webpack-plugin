const path = require('path')
const glob = require('glob')
const globBasePlugin = require('glob-base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin')
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin')

//目录
let directories = []
//entry对象
let entryObject = {}
//template对象
let templateObject = {}

//获取entry名称 {xx/xx/xx.js =====> xx/xx/xx}
const getEntryName = (globBase, file) => {
  if (directories.indexOf(globBase) === -1) {
    directories.push(globBase)
  }
  return path
    .relative(globBase, file)
    .replace(path.extname(file), '')
    .split(path.sep)
    .join('/')
}

module.exports = class MultiHtmlWebpackBuildPlugin {
  constructor(options) {
    this.options = options || {}
  }

  /**
   * 获取entry
   * @param {String/Object} pattern glob全局匹配字符串如："./src/**.js" {entry: "./src/**.js",template: "./src/**.html",style: "./src/**.css"}
   */
  static getEntry(pattern) {
    if (typeof pattern === 'string') pattern = {entry: pattern}

    const {entry, template, style} = pattern || {}

    //获取entry
    if (!entry) {
      //如果entry没有并且有template时，添加一个空的js文件，不然没有entry了
      if (template) entryObject = {emptyEntry: [path.resolve(__dirname, './empty.js')]}
    } else {
      const _entryGlobBase = globBasePlugin(entry).base
      glob.sync(entry).forEach(file => {
        const entryName = getEntryName(_entryGlobBase, file)
        entryObject[entryName] = [file]
      })
    }

    //获取样式 将样式文件添加到entry中去
    if (style) {
      const _styleGlobBase = globBasePlugin(entry).base
      glob.sync(style).forEach(file => {
        const entryName = getEntryName(_styleGlobBase, file)
        const entryArr = entryObject[entryName] || []

        if (entryArr.length) {
          entryObject[entryName].push(file)
        }
      })
    }

    //获取html
    if (template) {
      const _templateGlobBase = globBasePlugin(template).base
      glob.sync(template).forEach(file => {
        const entryName = getEntryName(_templateGlobBase, file)
        templateObject[entryName] = file
      })
    }

    return entryObject
  }

  /**
   * webpack插件调用
   * @param compiler
   */
  apply(compiler) {
    /**
     * entry属性回调
     * @param context
     * @param entry
     * @return {boolean}
     */
    const entryOption = (context, entry) => {
      Object.keys(entry).forEach(name => {
        const item = entry[name]
        if (Array.isArray(item)) {
          return new MultiEntryPlugin(context, item, name)
        } else {
          return new SingleEntryPlugin(context, item, name)
        }
      })
    }

    if (compiler.hooks) {
      // Support Webpack >= 4
      compiler.hooks.entryOption.tap(this.constructor.name, entryOption.bind(this))
      compiler.hooks.afterCompile.tapAsync(this.constructor.name, this.afterCompile.bind(this))
      compiler.hooks.afterPlugins.tap(this.constructor.name, this.afterPlugins.bind(this))
    } else {
      // Support Webpack < 4
      compiler.plugin('entry-option', entryOption)
      compiler.plugin("after-compile", this.afterCompile.bind(this))
      compiler.plugin("after-plugins", this.afterPlugins.bind(this))
    }
  }

  /**
   * webpack afterCompile事件回调
   * @param compilation
   * @param callback
   */
  afterCompile(compilation, callback) {
    if (Array.isArray(compilation.contextDependencies)) {
      // Support Webpack < 4
      compilation.contextDependencies = compilation.contextDependencies.concat(directories)
    } else {
      // Support Webpack >= 4
      for (const directory of directories) {
        compilation.contextDependencies.add(directory)
      }
    }
    callback()
  }

  /**
   * webpack afterPlugins事件回调
   * @param compiler
   */
  afterPlugins(compiler) {
    Object.keys(templateObject).forEach(name => {
      const options = this.options || {}
      const template = templateObject[name]
      const suffix = path.extname(template)

      const HtmlWebpackPluginOptions = typeof options === 'function' ?
        options({entry: name, template}) :
        {
          ...options,
          filename: name + suffix,
          template,
          chunks: [name]
        }

      compiler.apply(new HtmlWebpackPlugin(HtmlWebpackPluginOptions))
    })
  }
}
