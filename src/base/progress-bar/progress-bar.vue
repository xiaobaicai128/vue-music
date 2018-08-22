<template>
  <!-- 进度条 总体长度 -->
  <div  class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <!-- 进度条 已播放长度 -->
      <div class="progress" ref="progress"></div>
      <!-- 进度条 按钮 -->
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {preFixStyle} from 'common/js/mdom'

const progressBtnWidth = 16
const transform = preFixStyle('transform')

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // 总宽度
        const progressWidth = newPercent * progressBarWidth
        this.$refs.progress.style.width = `${progressWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${progressWidth}px, 0, 0)`
      }
    }
  },
  created () {
    this.touch = {} // 将touch的数据挂在此对象下
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true // 初始化
      this.touch.startX = e.touches[0].pageX // 记录触摸时的位置
      this.touch.left = this.$refs.progress.clientWidth // 记录已经进行的宽度
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX // 实时得到移动的x位点 减去记录的x坐标
      const progressWidth = Math.min(Math.max(0, deltaX + this.touch.left), this.$refs.progressBar.clientWidth - progressBtnWidth)
      this.$refs.progress.style.width = `${progressWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${progressWidth}px, 0, 0)`
    },
    progressTouchEnd () {
      this.touch.initiated = false
      this._trgglePercent()
    },
    progressClick (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this.$refs.progress.style.width = `${offsetWidth}px` // e.offsetX 是点击后的偏移量
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this._trgglePercent()
    },
    _trgglePercent () {
      const progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // 总宽度
      const percent = this.$refs.progress.clientWidth / progressBarWidth
      this.$emit('percentChange', percent) // 派发事件
    }
  }
}
</script>

<style lang="stylus">
  @import "~common/stylus/variable";

  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: #ffcd32;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
