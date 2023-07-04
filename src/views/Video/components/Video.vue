<script>
export default {
  props: {
    src: String,
  },
  data: () => ({
    playing: false,
  }),
  computed: {
    player() {
      return this.$refs.player
    },
  },
  mounted() {
    this.player.addEventListener("play", () => {
      this.playing = true
    })

    this.player.addEventListener("pause", () => {
      this.playing = false
    })
  },
  methods: {
    play() {
      this.player.play()
    },
    pause() {
      this.player.pause()
    },
    stop() {
      this.pause()
      this.player.currentTime = 0
    },
    togglePlay() {
      this.player.paused ? this.play() : this.pause()
    },
  },
}
</script>

<template>
  <div class="relative" @click="togglePlay()">
    <van-icon v-if="!playing" name="play" class="absolute top-1/2 left-1/2 -translate-1/2 text-6xl color-white" />
    <video ref="player" :src="src" class="w-full h-full bg-black" loop :controls="false"></video>
  </div>
</template>
