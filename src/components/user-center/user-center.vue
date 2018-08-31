<template>
  <transition name="slide">
    <div class="user-center">
      <div  class="back" @click="back">
        <div class="icon-back"></div>
      </div>
      <div class="switches-wrapper">
        <switches :currentIndex="currentIndex" :switches="switches" @switchItem="switchItem"></switches>
      </div>
      <div class="play-btn" @click="random" ref="playBtn">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll v-if="currentIndex===0" ref="favoriteList" :data="favorite" class="list-scroll">
          <div class="list-inner">
            <song-list @select="selectSong" :songs="favorite"></song-list>
          </div>
        </scroll>
        <scroll v-if="currentIndex===1" ref="historyList" class="list-scroll" :data="playHistory">
          <div class="list-inner">
            <song-list @select="selectSong" :songs="playHistory"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noresultShow">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from '../../base/switches/switches'
import {mapGetters, mapActions} from 'vuex'
import Scroll from '../../base/scroll/scroll'
import SongList from '../../base/song-list/song-list'
import Song from 'common/js/song'
import {playlistMixin} from 'common/js/mixin'
import NoResult from '../../base/no-result/no-result'

export default {
  mixins: [playlistMixin],
  computed: {
    noresultShow () {
      if (this.currentIndex === 0) {
        return !this.favorite.length
      }
      if (this.currentIndex === 1) {
        return !this.playHistory.length
      }
    },
    noResultDesc () {
      if (this.currentIndex === 0) {
        return '暂无喜爱歌曲'
      }
      if (this.currentIndex === 1) {
        return '暂无播放历史'
      }
    },
    ...mapGetters(['favorite', 'playHistory'])
  },
  data () {
    return {
      currentIndex: 0,
      switches: [
        {name: '我的收藏'},
        {name: '最近播放'}
      ]
    }
  },
  methods: {
    switchItem (index) {
      this.currentIndex = index
    },
    back () {
      this.$router.back()
    },
    selectSong (song) {
      this.insertSong(new Song(song))
    },
    random () {
      let list = this.currentIndex === 0 ? this.favorite : this.playHistory
      if (list.length === 0) {
        return
      }
      list = list.map((song) => {
        return new Song(song)
      })
      this.randomPlay({list})
    },
    handlePlayList (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom // scroll父盒子
      this.$refs.favoriteList && this.$refs.favoriteList.refresh() // scroll组件自刷新
      this.$refs.historyList && this.$refs.historyList.refresh() // 判断一下 因为不一定是哪一个list列表
    },
    ...mapActions(['insertSong', 'randomPlay'])
  },
  components: {
    Scroll,
    SongList,
    Switches,
    NoResult
  }
}
</script>

<style lang="stylus" >
  @import '~common/stylus/variable';

  .user-center {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: $color-background;
    &.slide-enter-active, &.slide-leave-active {
      transition: all .3s;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .back {
      position: absolute;
      top: 6px;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme-d;
      }
    }
    .switches-wrapper {
      margin: 10px 0 30px 0
    }
    .play-btn {
      box-sizing: border-box;
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid $color-text-l;
      color: $color-text-l;
      border-radius: 100px;
      font-size: 0;
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
        color: $color-theme-custom1;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .list-wrapper {
      position: absolute;
      top: 110px;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
