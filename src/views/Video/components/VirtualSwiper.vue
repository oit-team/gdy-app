<template>
  <div class="swiper-container">
    <div class="swiper-wrapper"></div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import Vue from 'vue'

export default {
  props: {
    slides: Array,
    initialSwipe: Number,
  },
  watch: {
    slides() {
      this.updateSlides()
    },
  },
  mounted() {
    let lastIndex = undefined
    this.swiper = new Swiper('.swiper-container', {
      direction: 'vertical',
      virtual: {
        renderSlide: (data, index) => {
          const Slide = Vue.extend({
            render: (h) => {
              return h(
                'div',
                { class: 'swiper-slide' },
                this.$scopedSlots.slide({ data, index })
              )
            },
          })
          const slide = new Slide()
          return slide.$mount().$el
        },
      },
      on: {
        slideChange: () => {
          this.$nextTick(() => {
            this.$emit('change', {
              index: this.swiper.activeIndex,
              lastIndex,
            })
            lastIndex = this.swiper.activeIndex
          })
        },
      },
    })
    this.updateSlides()
    this.$nextTick(() => {
      this.initialSwipe !== undefined && this.swiper.slideTo(this.initialSwipe, 0)
    })
  },
  methods: {
    updateSlides() {
      this.swiper.virtual.slides = this.slides
      this.swiper.virtual.update()
    }
  },
}
</script>
