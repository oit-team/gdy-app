<script>
export default {
  inject: ['ShareContent'],
  data: () => ({
    hide: false,
  }),
  computed: {
    order() {
      return this.ShareContent.getOrder(this)
    },
    editable() {
      return this.ShareContent.editable
    },
  },
  created() {
    this.ShareContent.registry(this)
  },
  beforeDestroy() {
    this.ShareContent.unregister(this)
  },
  methods: {
    up() {
      this.ShareContent.order(this, -1)
    },
    down() {
      this.ShareContent.order(this, 1)
    }
  },
}
</script>

<template>
  <div class="relative" v-show="editable || !hide" :style="{ order }">
    <slot></slot>
    <div class="absolute inset-0 z-10 bg-black bg-opacity-30 flex items-center justify-center" v-if="editable">
      <div class="flex gap-5 text-4xl color-white">
        <van-icon name="arrow-up" @click="up"/>
        <van-icon name="arrow-down" @click="down"/>
        <van-icon :name="hide ? 'closed-eye' : 'eye-o'" @click="hide = !hide"/>
      </div>
    </div>
  </div>
</template>
