<template>
  <div class="singer" ref="singer">
    <list :data="list" @select="selectSinger" ref="list"></list>
      <router-view></router-view>
  </div>
</template>
<script>
import {getSingerList} from '../../Api/singer'
import {ERR_OK} from '../../Api/config'
import Singer from 'common/js/singer'
import List from '../../base/list/list'
import {mapMutations} from 'vuex' // vuex自带语法糖 将数据传至state
import {playlistMixin} from 'common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  mixins: [playlistMixin],
  data () {
    return {
      list: []
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh() // 调用list组件内的refresh方法
    },
    selectSinger (item) {
      this.$router.push({ // 动态路由
        path: `/singer/${item.id}`
      })
      this.setSinger(item) // 2.实现数据提交到state
    },
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singer = res.data // 得到的 数据不是object类型 所以要转变为object
          this.list = this._nomalSingerList(this.singer.list)
          // console.log(this.list)
        }
      })
    },
    _nomalSingerList (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => { // 遍历数组
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // console.log(map)
      // 为了获得有序列表  所以处理map
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) { // 所有按字母排序来的 放在一个数组中
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0) // 降序排列
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER' // 1.映射到vuex的mutation中
    })
  },
  components: {
    List
  }
}
</script>
<style lang="stylus">
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>
