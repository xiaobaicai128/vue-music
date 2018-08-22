<template>
  <transition name="slide">
    <musicList :title="title" :bg-image="bgImage" :songs="songs"></musicList>
  </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from '../../Api/getRecommend'
import {createSongs} from 'common/js/song'
// import {ERR_OK} from '../../Api/config'

export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created () {
    this._getSongList()
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then((res) => {
        // console.log(res.cdlist[0].songlist)
        this.songs = this._nomalSongList(res.cdlist[0].songlist)
      })
    },
    _nomalSongList (list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSongs(musicData))
        }
      })
      return ret
    }
  }
}
</script>
<style lang="stylus">
  .slide-enter-active, .slide-leave-active
  transition all 0.3s
  opacity 1
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
    opacity 0
</style>
