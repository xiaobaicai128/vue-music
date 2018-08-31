<template>
  <transition name="slide">
    <music-list :title="title" :rank="rank" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getTopListMusic} from '../../Api/rank'
import {ERR_OK} from '../../Api/config'
import {createSongs} from 'common/js/song'

export default {
  components: {
    MusicList
  },
  created () {
    this._getTopListMusic()
  },
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  methods: {
    _getTopListMusic () {
      if (!this.topList) {
        this.$router.push('/rank')
        return
      }
      console.log(this.topList)
      getTopListMusic(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalList(res.songlist)
          // console.log(this.songs)
        }
      })
    },
    _normalList (list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
          ret.push(createSongs(musicData))
        }
      })
      return ret
    }
  },
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters(['topList'])
  }
}
</script>
<style lang="stylus">
  .slide-enter-active, .slid-leave-acitve
    transition: all, 0.3s, ease
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
