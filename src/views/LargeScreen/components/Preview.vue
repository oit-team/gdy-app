<template>
  <van-swipe class="aspect-9/16 h-full mx-auto shadow-lg rounded overflow-hidden" ref="swiper" @change="$emit('change', $event)">
    <van-swipe-item v-for="(item, index) of config" :key="index">
      <div class="flex flex-col h-full overflow-hidden">
        <ConfigItem
          v-if="item.items[0]"
          :item="item.items[0]"
          :file-map="fileMap"
          image-size="x"
          :style="{flexBasis: `${item.divider * 100}%`}"
        ></ConfigItem>
        <ConfigItem
          v-if="item.items[1]"
          :item="item.items[1]"
          :file-map="fileMap"
          image-size="x"
          class="flex-1"
        ></ConfigItem>
      </div>
    </van-swipe-item>
  </van-swipe>
</template>

<script>
import { convertImageSize } from '@/utils/helper'
import ConfigItem from './ConfigItem.vue'

export default {
  components: {
    ConfigItem,
  },

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
    convertImageSize,
    swipeTo(index, options) {
      this.$refs.swiper.swipeTo(index, options)
    }
  },

  mounted() {
    // 修复滑动失效
    setTimeout(this.$refs.swiper.resize, 500)
  },
}
</script>
