<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <img src="./no-result@2x.png" alt="">
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/variable';
  @import '~common/stylus/mixin';

  .no-result {
    text-align: center;
    .no-result-icon {
      width: 86px;
      height: 86px;
      margin: 0 auto;
      @include bg-img('no-result')
      background-size: 86px 90px;
    }
    .no-result-text {
      margin-top: 30px;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }
</style>
