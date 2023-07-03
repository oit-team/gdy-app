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
    },
  },
  created() {
    this.loadData()
  },
  methods: {
    getVideoFrame,
    async loadData({ pageNum }) {
      const res = await this.$post('/liveBroadcast/videoAssociation/getVideoAssociation', {
        pageSize: 20,
        pageNum,
        videoSource: this.type,
      })
      this.list = pageNum === 1 ? res.body.resultList : [...this.list, ...res.body.resultList]
      return this.list.length >= res.body.count
    },
  },
}
</script>

<template>
  <div class="h-screen flex flex-col overflow-auto bg-gray-100">
    <van-tabs v-model="type" class="px-12 sticky top-0 bg-white z-100">
      <van-tab title="商品" :name="1"></van-tab>
      <van-tab title="搭配" :name="2"></van-tab>
      <van-tab title="面料" :name="3"></van-tab>
      <van-tab title="推荐" :name="4"></van-tab>
    </van-tabs>
    <vc-list ref="list" pull-refresh load-more :promise="loadData" class="p-3 overflow-initial">
      <vc-waterfall :data="list" gap="12px" immediate>
        <template #default="{ item }">
          <div class="flex flex-col bg-white rounded-lg shadow overflow-hidden" @click="$router.push(`/video/detail/${item.videoZoneId}`)">
            <img :src="getVideoFrame(item.videoUrl)" class="w-full">
            <div class="p-1 text-sm">
              <div>{{ item.displayName }}</div>
              <div class="flex justify-between items-center mt-1">
                <div class="flex items-center gap-2">
                  <img :src="item.headPortrait" class="w-7 h-7 rounded-full overflow-hidden">
                  {{ item.createIdName }}
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
