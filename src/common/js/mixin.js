import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/random'

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
export const playListMode = {
  computed: {
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters(['favorite'])
  },
  methods: {
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentSong(list)
      this.setPlayList(list)
    },
    resetCurrentSong (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    toggleFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite (song) {
      const index = this.favorite.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setFullScreen: 'SET_PLAY_SCREEN', // 将其映射到mutation
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'CURRENTINDEX',
      setPlayMode: 'MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions(['deleteFavoriteList', 'saveFavoriteList'])
  }
}

export const searchMixin = {
  computed: {
    ...mapGetters(['searchHistory'])
  },
  data () {
    return {
      query: ''
    }
  },
  methods: {
    blurInput () { // 去掉键盘 => 即使input失去焦点
      this.$refs.searchBox.blur() // 调用子组件方法
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    onQueryChange (newQuery) {
      this.query = newQuery
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query) // 调用子组件方法/接口
    },
    deleteOne (item) {
      this.deleteSearchHistory(item)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
