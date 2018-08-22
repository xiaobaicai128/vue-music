/*
* @Author: qiaoyong
* @Date:   2018-07-26 14:25:29
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-08-20 10:47:32
*/
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/random'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCELIST, list) // 映射到state
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.CURRENTINDEX, index)
  commit(types.SET_PLAY_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
export const randomPlay = function ({commit}, {list}) {
  commit(types.MODE, playMode.random)
  commit(types.SET_SEQUENCELIST, list)
  let randomList = shuffle(list)
  commit(types.CURRENTINDEX, 0)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_PLAY_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
