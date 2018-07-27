/*
* @Author: qiaoyong
* @Date:   2018-07-26 14:26:49
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-07-26 16:21:59
*/
// actions对提交过来的操作进行业务逻辑处理
import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  }
}

export default mutations
