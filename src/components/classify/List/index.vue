<script>
const STATUS = {
  INACTIVE: 0,
  LOADING: 1,
  ERROR: 2,
  DONE: 3,
}

export default {
  props: {
    immediate: Boolean,
    promise: {
      type: Function,
      required: true,
    },
    pullRefresh: Boolean,
    loadMore: Boolean,
    finishedText: {
      type: String,
      default: '没有更多了'
    }
  },
  data: () => ({
    STATUS,
    pageNum: 1,
    loadStatus: STATUS.INACTIVE,
    refreshing: false,
  }),
  mounted() {
    this.immediate && this.load()
  },
  methods: {
    reset() {
      this.refreshing = false
      this.loadStatus = STATUS.INACTIVE
      this.pageNum = 1
      return this
    },
    reload() {
      this.reset().load()
    },
    async load() {
      if ([STATUS.LOADING, STATUS.DONE].includes(this.loadStatus))
        return

      try {
        this.loadStatus = STATUS.LOADING
        const done = await this.promise({
          pageNum: this.pageNum,
        })
        this.pageNum++
        this.loadStatus = !!done ? STATUS.DONE : STATUS.INACTIVE
      }
      catch (error) {
        this.loadStatus = STATUS.ERROR
        throw error
      }
    },
    async refresh() {
      try {
        this.pageNum = 1
        this.refreshing = true
        const done = await this.promise({
          pageNum: this.pageNum,
        })
        this.loadStatus = !!done ? STATUS.DONE : STATUS.INACTIVE
      }
      finally {
        this.refreshing = false
      }
    },
  },
}
</script>

<template>
  <van-pull-refresh
    :value="refreshing"
    :disabled="!pullRefresh"
    @refresh="refresh"
  >
    <van-list
      v-if="loadMore"
      :value="loadStatus === STATUS.LOADING"
      :finished="loadStatus === STATUS.DONE"
      :error="loadStatus === STATUS.ERROR"
      :finished-text="finishedText"
      @load="load"
    >
      <slot />
    </van-list>
    <slot v-else />
  </van-pull-refresh>
</template>
