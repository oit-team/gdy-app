<template>
  <div>
    <VirtualSwiper ref="swiperRef" :slides="list" class="h-screen" :initial-swipe="index" @change="swiperChange">
      <template #slide="{ data, index }">
        <Video :ref="`player-${index}`" :src="data.videoUrl" class="w-full h-full"></Video>
      </template>
    </VirtualSwiper>
  </div>
</template>

<script>
import VirtualSwiper from './components/VirtualSwiper.vue'
import Video from './components/Video.vue';

export default {
  components: {
    VirtualSwiper,
    Video,
  },
  data() {
    return {
      list: [],
      index: 0,
    }
  },
  created() {
    this.list = this.$route.params.list
    this.index = this.$route.params.index
  },
  methods: {
    swiperChange({ index, lastIndex }) {
      if (lastIndex !== undefined)
        this.getPlayer(lastIndex).stop()

      const player = this.getPlayer(index)
      player.play()
    },
    getPlayer(index) {
      return this.$refs[`player-${index}`]
    },
  },
}
</script>

<style>
</style>
