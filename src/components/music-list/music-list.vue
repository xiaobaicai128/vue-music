<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">全部播放</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" @scroll="scroll" :probe-type="probeType" :listern-scroll="listernScroll" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from '../../base/scroll/scroll'
import SongList from '../../base/song-list/song-list'
import {preFixStyle} from '../../common/js/mdom'
import Loading from '../../base/loading/loading'
import {mapActions} from 'vuex'

const RESERVED_HEIGHT = 40
const transform = preFixStyle('transform')
export default {
  props: {
    bgImage: {
      type: String, // 实际上是图像的链接地址 所以要通过计算属性 获得完整图片
      default: ''
    },
    songs: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  mounted () {
  // 动态计算listtop值
    // console.log(this.$refs.list)  style在$el中
    this.imgHeight = this.$refs.bgImage.clientHeight
    this.minHeight = -this.$refs.bgImage.clientHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imgHeight}px`
  },
  created () {
    this.probeType = 3
    this.listernScroll = true
  },
  methods: {
    scroll (position) {
      this.scrollY = position.y // 滚动的y坐标
    },
    back () {
      this.$router.back()
    },
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay' // 调用action中的方法
    ])
  },
  watch: {
    scrollY (newY) {
      let translateY = Math.max(this.minHeight, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0 // 模糊度
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      // this.$refs.layer.style['webkitTransform'] = `translate3d(0, ${translateY}px, 0)`
      const percent = Math.abs(newY / this.imgHeight) // 计算出下滑与图片背景的比例
      if (newY > 0) { // 往下滑
        scale = 1 + percent // 缩放
        zIndex = 10
      } else {
        blur = Math.min(100 * percent, 100) // 最小模糊度为20
      }
      this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
      this.$refs.filter.style['filter'] = `blur(${blur}px)`
      // this.$refs.filter.style['filter'] = `contrast(${blur}%)`

      this.$refs.filter.style['webkitFilter'] = `blur(${blur}px)`
      if (newY < this.minHeight) { // 往上滑
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0 // 通过padding-top设置高度
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%' // 通过padding-top设置高度
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = 'block'
      }
      this.$refs.bgImage.style.zIndex = zIndex // 改变背景图的zindex
      this.$refs.bgImage.style[transform] = `scale(${scale})` // scale缩放比例 详情见transform：scale()
      // this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
    }
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.bgImage})`
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>
<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top // 基准点 transform-origin
      background-size: 100%
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
        background-size: cover
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      // z-index -10
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
