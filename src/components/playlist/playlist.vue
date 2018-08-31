<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showflag" @click="hide" @click.stop>
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span  class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll class="list-content" :refreshDelay="refreshDelay" :data="sequenceList" ref="contentList">
          <transition-group name="list" tag="ul" >
            <li :key="item.id" class="item" v-for="(item, index) in sequenceList" @click="selectItem(item, index)" ref="listItem">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.songname}}-{{item.singer}}</span>
              <span @click="toggleFavoriteIcon(item)" class="like">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div  class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表" confirmText="清空" @confirm="confirmClear" @cancel="concirmCancel"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Scroll from '../../base/scroll/scroll'
import {playMode} from 'common/js/config'
import Confirm from '../../base/confirm/confirm'
import {playListMode} from 'common/js/mixin'
import AddSong from 'components/add-song/add-song'

export default {
  mixins: [playListMode],
  data () {
    return {
      showflag: false,
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters(['sequenceList', 'currentSong', 'playList', 'mode']),
    modeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  methods: {
    show () {
      this.showflag = true
      setTimeout(() => {
        this.$refs.contentList.refresh() // 重新渲染dom 解决scroll不能滚动的问题\
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide () {
      this.showflag = false
    },
    getCurrentIcon (item) {
      if (item.id === this.currentSong.id) {
        return 'icon-play'
      }
      return ''
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex((song) => { // 从当前列表中找到这首歌的id => index
          return song.id === item.id
        })
      }
      this.currentIndex(index)
      this.setPlayingState(true)
    },
    scrollToCurrent (current) { // scroll自动滚动到当前位置
      const index = this.sequenceList.findIndex((song) => {
        return song.id === current.id
      })
      this.$refs.contentList.scrollToElement(this.$refs.listItem[index], 300)
    },
    deleteOne (item) {
      this.deleteSong(item)
      if (!this.playList.length) {
        this.hide()
      }
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    confirmClear () {
      this.clearSongAll()
      this.$refs.confirm.hide()
    },
    concirmCancel () {
      this.$refs.confirm.hide()
    },
    addSong () {
      this.$refs.addSong.show()
    },
    ...mapMutations({
      'currentIndex': 'CURRENTINDEX',
      'setPlayingState': 'SET_PLAYING_STATE'
    }),
    ...mapActions(['deleteSong', 'clearSongAll'])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!this.showflag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrent(newSong)
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable';
  @import '~common/stylus/mixin';

  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity 0.3s;
      .list-wrapper {
        transition: all 0.3s;
      }
    }
    &.list-fade-enter, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: $color-highlight-background;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            font-size: 30px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          &.list-enter-active, &.list-leave-active {
            transition: all 0.3s;
          }
          &.list-enter, &.list-leave-to {
            // width: 0;
            transform translate3d(-100%, 0, 0)
          }
          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .like {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;
          }
        }
      }
      .list-operate {
        width: 140px;
        margin: 20px auto 30px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
            color: $color-theme-custom1;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-close {
        text-align: center;
        line-height: 50px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
