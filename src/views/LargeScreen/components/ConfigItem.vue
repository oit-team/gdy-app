<template>
  <div class="overflow-hidden flex-shrink-0">
    <van-image
      v-if="item.type === 'image'"
      class="h-full w-full"
      :src="convertImageSize(src, imageSize)"
      fit="cover"
      show-loading
    />
    <video
      v-else-if="item.type === 'video' && !placeholder"
      class="h-full w-full"
      :src="src"
      controls
      controlslist="nodownload"
    ></video>
    <div
      v-else
      class="bg-white grid place-content-center h-full"
    >
      <van-icon name="play" size="20" />
    </div>
  </div>
</template>

<script>
import { convertImageSize } from '@/utils/helper'

export default {
  props: {
    item: Object,
    fileMap: Object,
    placeholder: Boolean,
    imageSize: String,
  },

  computed: {
    src() {
      return this.fileMap[this.item.srcId] ? this.fileMap[this.item.srcId].resUrl : ''
    },
  },

  methods: {
    convertImageSize,
  },
}
</script>
