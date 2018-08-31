/*
* @Author: qiaoyong
* @Date:   2018-07-26 14:25:29
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-08-30 21:15:03
*/
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/random'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex((item) => { // es6  api 返回index序号 -1位没有
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

export const insertSong = function ({commit, state}, song) {
  let playList = state.playList.slice() // 创建数组副本，而不用改动原数组
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 查找待插入歌曲是否已经在要播放列表中
  let fpIndex = findIndex(playList, song)
  // 因为要插入一首歌，所以index++
  currentIndex++
  // 插入到当前索引位置
  playList.splice(currentIndex, 0, song) // 删除从当前索引开始的0个元素，并用送替换被删除的元素 => 插入元素
  // 如果已经包含这首歌  要删除原来的
  if (fpIndex > -1) {
    // 1.如果要插入的序号大于原歌曲列表序号
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCELIST, sequenceList)
  commit(types.CURRENTINDEX, currentIndex)
  commit(types.SET_PLAY_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCHHISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCHHISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCHHISTORY, clearSearch())
}

export const deleteSong = function ({commit, state}, song) {
  let playList = state.playList.slice() // 创建数组副本，而不用改动原数组
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  // 判断 如若所要删除的在正在播放的前面
  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCELIST, sequenceList)
  commit(types.CURRENTINDEX, currentIndex)

  // 如果全删完了 或者删除了最后一首歌
  if (!playList.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

export const clearSongAll = function ({commit}) {
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCELIST, [])
  commit(types.CURRENTINDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAYHISTORY, savePlay(song))
}

export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE, saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE, deleteFavorite(song))
}
