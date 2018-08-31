<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" alt="" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.songname"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend.prevent="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls" >
                <img :src="currentSong.imageurl" alt="" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" :class="{'current': currentLine === index}" v-for="(line, index) in currentLyric.lines" :key="line.id" ref="lyricLine">
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formate(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onPregressByChange"></progress-bar>
            </div>
            <span class="time time-r">{{formate(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" @click="toggleFavoriteIcon(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="radius" :class="cdCls">
            <img  :src="currentSong.imageurl" width="40" height="40" alt="">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.songname"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i @click.prevent.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <PlayList ref="playList"></PlayList>
    <audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @timeupdate="timeUpdate" @ended="songEnd"></audio>
  </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import animations from 'create-keyframe-animation' // 使用JavaScript在浏览器中动态生成CSS关键帧动画。
import {preFixStyle} from 'common/js/mdom'
import ProgressBar from '../../base/progress-bar/progress-bar'
import ProgressCircle from '../../base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
// import {shuffle} from 'common/js/random'
import Lyric from 'lyric-parser'
import Scroll from '../../base/scroll/scroll'
import PlayList from 'components/playlist/playlist'
import {playListMode} from 'common/js/mixin'

const transform = preFixStyle('transform')
const transitionDuration = preFixStyle('transitionDuration')

export default {
  mixins: [playListMode],
  data () {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLine: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  computed: {
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    // iconMode () {
    //   return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    // },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  created () {
    this.touch = {}
  },
  methods: {
    back () {
      // this.fullScreen = false // 不能让用户在dom中直接修改vuex数据 所以要用vuex方法
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    next () {
      if (!this.songReady) {
        return
      } else {
        if (this.playList.length === 1) {
          this.loop()
          return
        }
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    prev () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    ready () {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    error () {
      this.songReady = true
    },
    timeUpdate (e) {
      this.currentTime = e.target.currentTime // 动态获得播放当前时间
    },
    formate (interval) {
      interval = interval | 0 // 向下取整 等于 math.floor（）
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    onPregressByChange (percent) {
      const onCurrentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = onCurrentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(onCurrentTime * 1000) // *1000毫秒
      }
    },
    // changeMode () {
    //   const mode = (this.mode + 1) % 3
    //   this.setPlayMode(mode)
    //   let list = null
    //   if (mode === playMode.random) {
    //     list = shuffle(this.sequenceList)
    //   } else {
    //     list = this.sequenceList
    //   }
    //   this.resetCurrentSong(list)
    //   this.setPlayList(list)
    // },
    resetCurrentSong (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    songEnd () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop () { // 循环播放
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0) // 跳转到开头部分
      }
    },
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) { // 当num为个位数时，进入循环
        num = '0' + num
        len++ // 跳出条件
      }
      return num
    },
    enter (el, done) { // done 回调函数，执行下一个函数
      const {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.2)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1.0)`
        }
      }
      // 注册动画
      animations.registerAnimation({
        name: 'move',
        // 插入自定义动画
        animation,
        // 参数设置
        presets: {
          duration: 1000, // 持续时间
          easing: 'linear', // 过渡效果
          delay: 50 // 延时
        }
      })
      // 执行动画
      animations.runAnimation(this.$refs.cdWrapper, 'move', () => {
        done()
      })
    },
    afterEnter () {
      // 取消动画
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      // this.$refs.cdWrapper.addEventListener('transformend', done)
      // 执行动画
      this.$refs.cdWrapper.addEventListener('transitionend', () => {
        done()
      })
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    togglePlaying () {
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    getLyric () {
      this.currentSong.getLyric().then((lyric) => {
        if (this.currentLyric !== lyric) {
          return
        }
        this.currentLyric = new Lyric(lyric, this.handelLyric) // 调用
        if (this.playing) {
          this.currentLyric.play()
        }
        // console.log(this.currentLyric)
      }).catch(() => { // 寻不到歌词时候 的错误处理
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLine = 0
      })
    },
    handelLyric ({lineNum, txt}) {
      this.currentLine = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    middleTouchStart (e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0 // 动画
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0 // 动画
    },
    middleTouchEnd () {
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) { // 从左往右滑动
          offsetWidth = -window.innerWidth
          opacity = 0 // 透明
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) { // 从右往左滑动
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms` // 动画
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms` // 动画
    },
    showPlayList () {
      this.$refs.playList.show()
    },
    _getPosAndScale () {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8 // window.innerWidth窗口的文档显示区的宽度，以像素计
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_PLAY_SCREEN', // 将其映射到mutation
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'CURRENTINDEX',
      setPlayMode: 'MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions(['savePlayHistory'])
  },
  watch: {
    currentSong (newsong, oldsong) {
      if (!newsong) {
        return
      }
      if (newsong.id === oldsong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.play() // 观察当前歌曲发生变化就 播放
        this.getLyric()
      }, 1000)
    },
    playing (newPlaying) {
      if (!this.songReady) {
        return
      }
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
      // this.songReady = false
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    PlayList
  }
}
</script>
<style lang="stylus">
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";

  .player {
    .normal-player {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-back {
            display: block;
            padding: 9px;
            font-size: $font-size-large-x;
            color: $color-theme;
            transform: rotate(-90deg);
          }
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              .image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
              &.play {
                animation: rotate 20s linear infinite;
              }
              &.pause {
              animation-play-state: paused;
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 50px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-bg-custom;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 85%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 35px;
            width: 30px;
            line-height: 30px;
            &.time-l {
              text-align: left;
              margin-right: 5px;
            }
            &.time-r {
              text-align: right;
              margin-left: 5px;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-custom2;
            }
            i {
              font-size: 30px;
            }
          }
          .i-small {
            i {
              font-size: 25px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 50px;
            }
          }
          .i-right {
            text-align: left;
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .4s;
        .top, .bottom {
          transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }
      &.normal-enter, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0);
        }
      }
    }
    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: $color-highlight-background;
      &.mini-enter-active, &.mini-leave-active {
        transition: all 0.4s;
      }
      &.mini-enter, &.mini-leave-to {
        opacity: 0;
      }
      .mini-progress-bar {
        position: absolute;
        width: 100%;
        bottom: 47px;
      }
      .icon {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        padding: 0 10px 0 20px;
        .radius {
          width 40px
          height 40px
          overflow hidden
          border-radius: 50%;
          &.play {
              animation: rotate 10s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
        }
        .imgWrapper {
          height: 100%;
          width: 100%;
          img {
            // overflow hidden
            border-radius: 50%;
            &.play {
              animation: rotate 10s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
          }
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
      .control {
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist {
          font-size: 30px;
          color: $color-theme;
        }
        .icon-mini {
          font-size: 32px;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg)
    }
  }
</style>
