import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import './common/stylus/index.styl'

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
