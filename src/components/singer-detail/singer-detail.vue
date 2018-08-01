<template>
  <transition name="slide">
    <musicList :songs="songs" :title="title" :bg-image="bgImage"></musicList>
  </transition>
</template>
<script>
import {mapGetters} from 'vuex' // 获取数据的语法糖
import {getSingerDetail} from '../../Api/singer'
import {ERR_OK} from '../../Api/config'
import {createSongs} from 'common/js/song'
import musicList from 'components/music-list/music-list'

export default {
  computed: {
    title () { // 计算属性 以函数方法形式 并需要返回值 return
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getDetail()
    // console.log(this.singer.id)
    // console.log(this.singer.name)
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) { // 如果没有id则返回刷新
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
          // console.log(this.songs)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSongs(musicData))
        }
      })
      return ret
    }
  },
  components: {
    musicList
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
