<template>
  <transition name="slide">
    <div class="singer-detail">
      999
    </div>
  </transition>
</template>
<script>
import {mapGetters} from 'vuex' // 获取数据的语法糖
export default {
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    console.log(this.singer)
  }
}
</script>
<style lang="stylus">
@import '~common/stylus/variable'
.singer-detail
  position fixed
  z-index 100
  top 0
  left 0
  right 0
  bottom 0
  background $color-background
.slide-enter-active, .slide-leave-active
  transition all 0.3s
  opacity 1
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
  opacity 0
</style>
