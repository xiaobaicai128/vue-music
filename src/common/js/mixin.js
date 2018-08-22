import {mapGetters} from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () { // 渲染完毕后触发
    this.handlePlayList(this.playList)
  },
  activated () { // keep-alive 切换的时候 触发
    this.handlePlayList(this.playList)
  },
  watch: {
    playList (newList) {
      this.handlePlayList(newList)
    }
  }
}
