<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from 'better-scroll'

export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listernScroll: { // 实时监听scroll位置
      type: Boolean,
      default: false
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 200)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      // 监听左右联动滚动事件
      // 如果左右联动，想父组件派发时间 返回锚点坐标 父组件可以直接饮用时间不需要声明注册
      if (this.listernScroll) {
        let me = this
        this.scroll.on('scroll', (position) => {
          me.$emit('scroll', position)
        })
      }
    },
    enable () {
      // 代理better-scroll的enable方法
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () { // bs内置方法 实现跳转
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, 200)
    }
  }
}
</script>
