<template>
    <Scroll class="listview" :data="data" :listernScroll="listernScroll" @scroll="scroll" :probeType="probeType" ref="listView">
      <ul>
        <li v-for="group in data" :key="group.id" class="list-group" ref="listGroup">
          <h2 class="list-group-title">{{group.title}}</h2>
          <ul>
            <li @click="selectItem(item)" v-for="item in group.items" :key="item.id" class="list-group-item">
              <img v-lazy="item.avatar" class="avatar" alt="">
              <span class="name">{{item.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="list-shortcut" @touchstart.stop.prevent="onShortCutTouchStart" @touchmove.stop.prevent="onShortCutTouchMove">
        <ul>
          <li v-for="(item,index) in shortCutList" :key="item.id" class="item" :class="{'current':currentIndex===index}" :data-index="index">{{item}}</li>
        </ul>
      </div>
      <div class="list-fixed" v-show="fixedTitle" ref="fixed">
        <div class="fixed-title">{{fixedTitle}} </div>
      </div>
      <div class="loading-container" v-show="!data.length">
        <loading></loading>
      </div>
    </Scroll>
</template>
<script>
import Scroll from '../scroll/scroll'
import {getData} from 'common/js/mdom'
import Loading from '../../base/loading/loading'
const CHAPTER_HEIGHT = 18 // 字母高度  根据样式来的
const TITLE_HEIGHT = 30 // fixedtop 高度
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  created () {
    this.touch = {} // 定义一个对象用来接收移动的属性
    this.listernScroll = true
    this.listHeight = []
    this.probeType = 3 // bs 类型
  },
  data () {
    return {
      // click: true,
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  computed: {
    shortCutList () {
      // map()方法返回一个新数组，数组中的元素为原始数组元素调用函数处理的后值。
      // map()方法按照原始数组元素顺序依次处理元素。
      return this.data.map((group) => { // 数组的map方法 group 仅是一个形参 其他东西也可以
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    onShortCutTouchStart (e) {
      // 从e上获取data-index
      let touchIndex = getData(e.target, 'index') // 没有值 所以设置
      this.touch.y1 = e.touches[0].pageY // 获得首次触摸的锚点坐标
      this.touch.chapter = touchIndex // 第几个字母
      // console.log(this.touch.y1)
      this._scrollTo(touchIndex)
    },
    onShortCutTouchMove (e) {
      this.touch.y2 = e.touches[0].pageY // 移动中的锚点
      let delta = (this.touch.y2 - this.touch.y1) / CHAPTER_HEIGHT | 0 // 算出移动了几个字母 并向下取整
      let touchIndex = parseInt(this.touch.chapter) + delta
      this._scrollTo(touchIndex)
    },
    scroll (position) {
      this.scrollY = position.y // bs自带函数  获得实时滚动的y坐标
    },
    selectItem (item) {
      this.$emit('select', item) // 向外派发点击事件 创出被点击的内容 父组件监听
    },
    _scrollTo (index) {
      if (!index && index !== 0) { // 点击字母 如果没有点击到锚点元素 padding时无效
        return
      }
      // 如果 touchmove 超出范围
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight[index - 2]) {
        index = this.listHeight[index - 2]
      }
      this.scrollY = -this.listHeight[index] // 改变scrollY 随之改变 currentindex 高亮显示
      // 调用内置的scrollToElement方法 实现目标内容的跳转
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0) // 0 是缓动时间
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight // item.clientHeight 是每组的高度
        this.listHeight.push(height) // 每组的高度的集合
      }
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight() // 监视data，计算高度，渲染数据
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 1. 当滑动到最上面 newy 向下滑动 应该是负值
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 2. 当在中间部分滚动，length之所以 -1 是因为 当初高度列表定义必须多一个
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) { // newY 为负值
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 3. 最后一个
      this.currentIndex = listHeight.length - 2
    },
    diff (newValue) {
      let fixedTop = (newValue > 0 && newValue < TITLE_HEIGHT) ? newValue - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return // 判断如果两个title区块没有碰到，是不会触发 DOM 操作的
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style lang="stylus">
  @import "~common/stylus/variable";
*
  touch-action: pan-y;
  .listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;
    .list-group {
      padding-bottom: 30px;
      .list-group-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        background: $color-highlight-background;
        box-shadow: 2px 2px 0px #F5387D, 2px 2px 0px #B120FA;
        color: #fff
      }
      .list-group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
    .list-shortcut {
      position: absolute;
      padding: 5px 0px
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      text-align: center;
      font-family: Helvetica;
      border-radius 10px
      background-color rgba(0,0,0,0.2)
      .item {
        padding: 7px 10px 0;
        line-height: 1;
        color: $color-text-l;
        color: hsla(0, 0%, 100%, .5);
        font-size: $font-size-small;
        &.current {
          color: #ffcd32;
        }
      }
    }
    .list-fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title {
        margin-top -7px
        height: 38px;
        line-height: 43px;
        padding-left: 20px;
        font-size: $font-size-small;
        color #fff
        background: $color-highlight-background;
        // box-shadow: 2px 2px 0px #F5387D, 2px 2px 0px #B120FA;
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
