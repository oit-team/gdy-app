<template>
  <van-swipe class="aspect-9/16 h-full mx-auto shadow-lg rounded overflow-hidden" ref="swiper" @change="$emit('change', $event)">
    <van-swipe-item v-for="(item, index) of config" :key="index">
      <div class="flex flex-col h-full">
        <van-image
          v-if="item.items[0]"
          :style="{flexBasis: `${item.divider * 100}%`}"
          :src="fileMap[item.items[0].srcId].resUrl"
          fit="cover"
        />
        <van-image
          v-if="item.items[1]"
          class="flex-1"
          :src="fileMap[item.items[1].srcId].resUrl"
          fit="cover"
        />
      </div>
    </van-swipe-item>
  </van-swipe>
</template>

<script>
export default {
  props: {
    config: {
      type: Array,
      default: () => [],
    },
    fileMap: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    swipeTo(index) {
      this.$refs.swiper.swipeTo(index)
    }
  },

  mounted() {
    // 修复滑动失效
    setTimeout(this.$refs.swiper.resize, 500)
  },
}
</script>
