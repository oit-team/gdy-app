'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api/api': {
        target: 'http://192.168.9.12:8132/mta-api/api',
        // target: 'https://app.gaodanyi.com:9443/mta-api/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api/api': ''
        }
      },
      '/api/mta': {
        target: 'http://192.168.9.12:8132/mta',
        // target: 'https://app.gaodanyi.com:9443/mta',
        changeOrigin: true,
        pathRewrite: {
          '^/api/mta': ''
        }
      },
      '/api': {
        target: 'http://192.168.9.65:8089',
        // target: 'https://app.gaodanyi.com:9443/mta-api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    },

    // Various Dev Server settings
    // host: 'localhost', // can be overwritten by process.env.HOST
    host: process.env.HOST || 'localhost', // can be overwritten by process.env.HOST
    port: process.env.PORT || 2100, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
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

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../gdy-app/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../gdy-app'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
