/*
* @Author: qiaoyong
* @Date:   2018-07-26 14:27:26
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-08-21 10:09:06
*/
// vuex 跨组件数据共享管理
// 数据存储 一般是异步获取 最基础的全局数据
import {playMode} from 'common/js/config'
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [], // 顺序播放
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {}
}

export default state
