/*
* @Author: qiaoyong
* @Date:   2018-07-27 20:37:24
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-08-22 14:55:15
*/
// 创建类

import {getLyric} from '../../Api/song.js'
// import {ERR_OK} from '../../Api/config'
// import {Base64} from 'js-base64'

export class Song {
  constructor ({id, songname, singer, albumname, albummid, duration, image, imageurl, url}) {
    // 绑到实例上来
    this.id = id
    this.songname = songname
    this.singer = singer
    this.imageurl = imageurl
    this.albumname = albumname
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.id).then((res) => {
        var ret = res
        if (typeof ret === 'string') {
          var reg = /^\w+\(({[^()]+})\)$/
          // 以单词a-z，A-Z开头，一个或多个
          // \(\)转义括号以（）开头结尾
          // （）是用来分组
          // 【^()】不以左括号/右括号的字符+多个
          // {}大括号也要匹配到
          var matches = ret.match(reg)
          if (matches) {
            ret = JSON.parse(matches[1])
          // 对匹配到的分组的内容进行转换
          }
        }
        var unescapeHTML = function (lrc) {
          var t = document.createElement('div')
          t.innerHTML = lrc + ''
          return t.innerHTML
        }
        this.lyric = unescapeHTML(ret.lyric)
        resolve(this.lyric)
        // console.log(this.lyric)
      })
    })
  }
}

// 工厂方法 调用new 创建实例
export function createSongs (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    // singer: musicData.singer[0].name,
    albumname: musicData.albumname,
    songname: musicData.songname,
    duration: musicData.interval, // 播放时长
    image: 'https://y.gtimg.cn/music/photo_new/T001R150x150M000' + musicData.singer[0].mid + '.jpg?max_age=2592000',
    imageurl: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000' + musicData.albummid + '.jpg?max_age=2592000',
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=6318207668&vkey=7311C5C105BD0176D63514D836DC0C953037ECB8F6C31FBE594D652F7198F0767E56452C394F6310B8ADEF1ACB7F04D5896AD546AFD9023F&uin=0&fromtag=38`
    // url: `http://dl.stream.qqmusic.qq.com/C400002dh98v0Clgrm.m4a?guid=6318207668&vkey=7311C5C105BD0176D63514D836DC0C953037ECB8F6C31FBE594D652F7198F0767E56452C394F6310B8ADEF1ACB7F04D5896AD546AFD9023F&uin=0&fromtag=38`
  })
}
// 遍历数组 找出数组中的对象的name
function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

// function getImgurl (singer) {
//   let ret = []
//   if (!singer) {
//     return ''
//   }
//   singer.forEach((s) => {
//     ret.push(s.mid)
//   })
//   return ret.join('/')
// }
