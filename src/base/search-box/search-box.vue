<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" class="box" v-model="query" :placeholder="placeHolder" ref="inputQuery">
    <i v-show="query" class="icon-dismiss" @click="clear"></i>
  </div>
</template>
<script>
import {deBounce} from 'common/js/random'

export default {
  props: {
    placeHolder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (query) {
      this.query = query
    },
    blur () {
      this.$refs.inputQuery.blur()
    }
  },
  created () {
    this.$watch('query', deBounce((newQuery) => { // 节流函数
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>
<style lang="stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
