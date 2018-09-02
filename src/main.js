import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import './common/stylus/index.styl'

/* eslint-disable no-unused-vars */
import vConsole from 'vconsole' // 在手移动端调试工具
console.log('test')

fastclick.attach(document.body) // 去掉移动端点击等事件的300秒延时

Vue.use(VueLazyLoad, {
  loading: require('common/image/musical.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, // 注册vuex
  render: h => h(App)
})
