<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :key="index" :class="{'active':currentPageIndex === index}"></span>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import {addClass} from 'common/js/mdom.js'
export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: { // 接受外部组件对该轮播图组件的控制
    loop: {
      type: Boolean,
      default: true // 设置默认状态
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: { // 轮播时间间隔
      type: Number,
      default: 3000
    }
  },
  mounted () { // 初始化betterscroll
    setTimeout(() => { // 设置20毫秒的延时 20毫秒刷新
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    // 当改变屏幕大小（横屏）时需要重新计算sliderwidth
    window.addEventListener('resize', () => {
      if (!this.sliderScroll) {
        return // 当初始化时不需要计算
      }
      this._setSliderWidth(true)
      this.sliderScroll.refresh()
    })
  },
  destroyed () {
    clearTimeout(this.timer)
  },
  methods: {
    // 横向 所以先设置自容器宽度
    _setSliderWidth (isResize) {
      this.children = this.$refs.sliderGroup.children // 有多少个 li
      let width = 0 // ul 宽度
      let sliderWidth = this.$refs.slider.clientWidth // 屏幕宽 即每个li宽
      // 通脱循环给每个li添加class 并得出容器总宽度
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item') // 给每个li 添加新的class
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) { // 初始化的时候才执行以下函数 左右加一
        width += 2 * sliderWidth // 若自动轮播需要在左右两端各加一个图片
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider () {
      this.sliderScroll = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop, // 循环
          threshold: 0.3,
          speed: 400 // 轮播间隔
        }
      })
      this.sliderScroll.on('scrollEnd', () => { // bscroll自带的一个方法在滚动结束的时候返回
        let pageIndex = this.sliderScroll.getCurrentPage().pageX // 获得当前pageindex
        // if (this.loop) { // 旧版本
        //   pageIndex -= 1 // 自动循环播放 前后各加一张 所以要减掉 成为0
        // }
        this.currentPageIndex = pageIndex
        if (this.autoPlay) { // 防止手动滑动，它又自己滑动顺序错乱
          clearTimeout(this.timer) // 每次轮播一张后去掉定时器
          this._play()
        }
      })
    },
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    _play () {
      this.timer = setTimeout(() => { // 该定时器只会执行一次
        // this.sliderScroll.goToPage(pageIndex, 0, 400) // 自带接口 跳转到某一页 0 是指用方向  400是 轮播间隔
        this.sliderScroll.next()
      }, this.interval)
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll

</style>
