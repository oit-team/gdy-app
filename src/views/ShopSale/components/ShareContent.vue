<script>
import { screenshot } from '@/utils/screenshot'
import { Toast } from 'vant'

export default {
  provide() {
    return {
      ShareContent: this,
    }
  },
  props: {
    editable: Boolean,
  },
  data: () => ({
    orders: [],
  }),
  methods: {
    screenshot() {
      Toast.loading({
        message: '图片生成中...',
        duration: 0,
        forbidClick: true,
      })
      screenshot(this.$refs.contentRef).finally(Toast.clear)
    },
    registry(item) {
      this.orders.push(item)
    },
    unregister(item) {
      const index = this.orders.indexOf(item)
      if (index !== -1)
        this.orders.splice(index, 1)
    },
    getOrder(item) {
      return this.orders.indexOf(item)
    },
    order(item, orderIndex) {
      const index = this.orders.indexOf(item)
      const targetIndex = index + orderIndex
      if (index === -1 || targetIndex < 0 || targetIndex >= this.orders.length) return

      const target = this.orders[targetIndex]
      this.$set(this.orders, targetIndex, item)
      this.$set(this.orders, index, target)
    },
  },
}
</script>

<template>
  <div ref="contentRef">
    <slot></slot>
  </div>
</template>
