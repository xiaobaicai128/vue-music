/*
* @Author: qiaoyong
* @Date:   2018-07-27 20:37:24
* @E-mail: 21718534@zju.edu.cn
* @Last Modified by:   乔勇
* @Last Modified time: 2018-07-27 22:51:29
*/
// 创建类
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
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=6318207668&vkey=2BCB21573F434D6A15810028FA5EFC82220239C5BA75EAD0F866FE3D0ACD3CE7F34CB46940F5103AA7FD7F7ADA2614965CF28A02208EAAD7&uin=0&fromtag=38`
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
