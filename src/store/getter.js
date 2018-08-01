/*
* @Author: qiaoyong
* @Date:   2018-07-26 14:26:02
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-07-30 22:48:36
*/
// 从state中取得数据 渲染组件 映射到组件中
// 可以通过state的基础数据计算出新的数据
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}
