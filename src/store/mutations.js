/*
* @Author: qiaoyong
* @Date:   2018-07-26 14:26:49
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-07-31 20:38:53
*/
// actions对提交过来的操作进行业务逻辑处理
// 修改数据
import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE] (state, flag) { // boolean 值默认用flag来摇摆
    state.playing = flag
  },
  [types.SET_PLAY_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAY_LIST] (state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCELIST] (state, list) {
    state.sequenceList = list
  },
  [types.MODE] (state, mode) {
    state.mode = mode
  },
  [types.CURRENTINDEX] (state, index) {
    state.currentIndex = index
  },
  [types.CURRENTSONG] (state, song) {
    state.currentSong = song
  }
}

export default mutations
