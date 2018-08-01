/*
* @Author: qiaoyong
* @Date:   2018-07-26 14:25:29
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-07-31 20:39:56
*/
import * as types from './mutation-types'

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCELIST, list) // 映射到state
  commit(types.CURRENTINDEX, index)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_PLAY_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
