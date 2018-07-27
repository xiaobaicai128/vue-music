/*
* @Author: qiaoyong
* @Date:   2018-07-26 14:26:21
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-07-26 15:41:06
*/

// vuex入口函数 配置vuex
import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getter'
import * as actions from './actions'
import mutations from './mutations'
import state from './state'

import createLooger from 'vuex/dist/logger' // vuex自带的插件 用来打印修改记录

Vue.use(Vuex)

// 开发时的调试工具 在开发时候是true， 在产品模式是false
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  mutations,
  state,
  strict: debug, // 严格模式 禁止用户跳过mutation直接修改state
  plugins: debug ? [createLooger()] : []
})
