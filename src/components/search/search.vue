<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <Scroll class="shortcut" :refreshDelay="refreshDelay" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="item in hotKey" :key="item.id" class="item" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <SearchList @select="addQuery" :searches="searchHistory" @deleteOne="deleteOne"></SearchList>
          </div>
        </div>
      </Scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <confrim ref="confirm" :text="text" confirmBtnText="清空" @confirm="deleteAll" @cancel="cancel"></confrim>
    <router-view></router-view>
  </div>
</template>
<script>
import SearchBox from '../../base/search-box/search-box'
import {getSearchHot} from '../../Api/search'
import {ERR_OK} from '../../Api/config'
import Suggest from 'components/suggest/suggest'
import {mapActions, mapGetters} from 'vuex'
import SearchList from '../../base/search-list/search-list'
import Confrim from '../../base/confirm/confirm'
import Scroll from '../../base/scroll/scroll'
import {playlistMixin, searchMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin, searchMixin],
  created () {
    this._getSearchHot()
  },
  data () {
    return {
      hotKey: [],
      query: '',
      text: '确定要清除所有历史记录？',
      refreshDelay: 100
    }
  },
  computed: {
    shortcut () {
      return this.hotKey.concat(this.searchHistory)
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) { // 若query不再发生变化，则手动刷新scroll
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  methods: {
    handlePlayList (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    // addQuery (query) {
    //   this.$refs.searchBox.setQuery(query) // 调用子组件方法/接口
    // },
    // onQueryChange (newQuery) {
    //   this.query = newQuery
    // },
    // blurInput () { // 去掉键盘 => 即使input失去焦点
    //   this.$refs.searchBox.blur() // 调用子组件方法
    // },
    // saveSearch () {
    //   this.saveSearchHistory(this.query)
    // },
    deleteOne (item) {
      this.deleteSearchHistory(item)
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    deleteAll () {
      this.clearSearchHistory()
      this.$refs.confirm.hide()
    },
    cancel () {
      this.$refs.confirm.hide()
    },
    _getSearchHot () {
      getSearchHot().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10) // 截取前十个数据
        }
      })
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confrim,
    Scroll
  }
}
</script>
<style lang="stylus">
 @import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
