'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');//使用Node自带的文件路径插件

module.exports = {
  dev: {

    // Paths
    // 编译输出的二级目录
    assetsSubDirectory: 'static',
    // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名
    assetsPublicPath: '/',
    //代理配置，用于跨域处理。
    proxyTable: {
      '/store/*': {
        target: 'http://127.0.0.1:9090'  // 请求本地 需要store后台项目
      }
    },

    // Various Dev Server settings
    // 运行测试页面的host
    host: '127.0.0.1', // can be overwritten by process.env.HOST
    // 运行测试页面的端口
    port: 10002, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    //是否自动打开浏览器
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  //生产环境配置
  build: {
    // Template for index.html  编译注入的 index.html 文件,必须是本地的绝对路径
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths  编译输出的静态资源根路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 编译输出的二级目录
    assetsSubDirectory: 'static',
    // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名,或者部署服务器（Tomcat）中应用的名称。
    // assetsPublicPath: '/',
    assetsPublicPath: '/vue/',

    /**
     * Source Maps
     */

    //生成用于生产构建的源映射
    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // 是否开启 gzip
    productionGzip: false,
    // 需要使用 gzip 压缩的文件扩展名
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    //一个实用工具,用于分析项目的依赖关系https://www.npmjs.com/package/webpack-bundle-analyzer
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
