/*
* @Author: qiaoyong
* @Date:   2018-08-31 21:06:58
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-08-31 21:56:19
*/
var express = require('express')
var config = require('./config/index')

var app = express()

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // 反向代理 
    proxyTable: {
      '/api/getDiscList':{
        target:'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
        bypass:function(req,res,proxyOptions){
          req.headers.referer='https://c.y.qq.com';
          req.headers.host='c.y.qq.com';
        },
        pathRewrite:{
          '^/api/getDiscList':''
        }
      },
      '/api/getLyric': {
        target:'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg',
        bypass: function(req,res,proxyOptions) {
          req.headers.referer='https://i.y.qq.com';
          req.headers.host='i.y.qq.com';
        },
        pathRewrite:{
          '^/api/getLyric':''
        }
      },
      // '/api/getSongList': {
      //   target:'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
      //   bypass: function(req,res,proxyOptions) {
      //     req.headers.referer='https://y.qq.com';
      //     req.headers.host='y.qq.com';
      //   },
      //   pathRewrite:{
      //     '^/api/getSongList':''
      //   }
      // },
      '/api/getSongList':{
        target:'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
        bypass:function(req,res,proxyOptions){
          req.headers.referer='https://y.qq.com/n/yqq/playsquare/4277285623.html';
          // req.headers.host='c.y.qq.com';
        },
        // secure: false, //如果是https接口，需要配置这个参数
        // changeOrigin: true, //允许跨域
        pathRewrite:{
          '^/api/getSongList':''
        }
      },
      '/api/getSearch': {
        target: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
        bypass: function(req, res, proxyOptions) {
          req.headers.referer = 'https://y.qq.com/m/index.html'
        },
        pathRewrite: {
          '^/api/getSearch': ''
        }
      }
    },

    // Various Dev Server settings
    // host: 'localhost', // can be overwritten by process.env.HOST
    host: '0.0.0.0',
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

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
  }
}
app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})