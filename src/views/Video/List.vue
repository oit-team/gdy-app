<script>
import { getVideoFrame } from '@/utils/helper'

export default {
  data: () => ({
    list: [],
    type: 1,

    isLoading: false,
  }),
  watch: {
    type() {
      this.$refs.list.reload()
      this.$refs.page.scrollTop = 0
    },
  },
  mounted() {
    this.scrollRecord = 0
    this.$root.$on('video:load', () => {
      this.$refs.list.load()
    })
  },
  activated() {
    this.$refs.page.scrollTop = this.scrollRecord
  },
  deactivated() {
    this.scrollRecord = this.$refs.page.scrollTop
  },
  methods: {
    getVideoFrame,
    async loadData({ pageNum }) {
      const res = await this.$post('/liveBroadcast/videoAssociation/getVideoAssociation', {
        pageSize: 20,
        pageNum,
        videoSource: this.type,
      })
      pageNum === 1
        ? this.list.splice(0, this.list.length, ...res.body.resultList)
        : this.list.push(...res.body.resultList)
      return this.list.length >= res.body.count
    },
    toSwipe(index) {
      this.$router.push({
        name: 'VideoSwipe',
        params: {
          list: this.list,
          index,
        },
      })
    },
  },
}
</script>

<template>
  <div class="h-100% flex flex-col overflow-auto bg-gray-100" ref="page">
    <van-tabs v-model="type" class="px-12 sticky top-0 bg-white z-100">
      <van-tab title="推荐" :name="''"></van-tab>
      <van-tab title="商品" :name="1"></van-tab>
      <van-tab title="搭配" :name="2"></van-tab>
      <van-tab title="面料" :name="4"></van-tab>
      <van-tab title="收藏" :name="101"></van-tab>
    </van-tabs>
    <vc-list ref="list" pull-refresh load-more :promise="loadData" class="p-3 overflow-initial" immediate>
      <vc-waterfall :data="list" gap="12px">
        <template #default="{ item, index }">
          <div class="flex flex-col bg-white rounded-lg shadow overflow-hidden" @click="toSwipe(index)">
            <img :src="getVideoFrame(item.videoUrl)" class="w-full">
            <div class="p-1 text-sm">
              <div>{{ item.displayName }}</div>
              <div class="flex justify-between items-center mt-1">
                <div>
                  {{ item.createTime }}
                </div>
                <div class="flex items-center">
                  <van-icon name="good-job-o" class="text-xl" />
                  <span class="text-sm">{{ item.likeCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </vc-waterfall>
    </vc-list>
  </div>
</template>

<style scoped lang="scss">
.van-tabs>>> {
  .van-tabs__wrap {
    height: 35px;
  }
}
</style>
