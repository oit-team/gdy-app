<script>
import { getVideoFrame } from '@/utils/helper'
import dayjs from 'dayjs'

export default {
  data: () => ({
    list: [],
    type: 1,
    searchForm: {
      displayName: '',
      endCreateTime: '',
      startCreateTime: '',
    },

    isLoading: false,
    searchPopup: false,
    showCalendar: false,
  }),
  watch: {
    type() {
      this.resetSearch()
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
        ...this.searchForm,
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
    resetSearch() {
      this.searchForm = {
        displayName: '',
        endCreateTime: '',
        startCreateTime: '',
      }
    },
    submitSearch() {
      this.searchPopup = false
      this.$refs.list.reload()
    },
    onConfirm(e) {
      this.searchForm.startCreateTime = dayjs(e[0]).format('YYYY-MM-DD')
      this.searchForm.endCreateTime = dayjs(e[1]).format('YYYY-MM-DD')
      this.showCalendar = false
    },
  },
}
</script>

<template>
  <div class="h-100% flex flex-col overflow-auto bg-gray-100" ref="page">
    <div class="sticky top-0 flex items-center px-10 z-100000 bg-white">
      <van-tabs v-model="type" class="flex-1">
        <van-tab title="推荐" :name="''"></van-tab>
        <van-tab title="商品" :name="1"></van-tab>
        <van-tab title="搭配" :name="2"></van-tab>
        <van-tab title="面料" :name="4"></van-tab>
        <van-tab title="收藏" :name="101"></van-tab>
      </van-tabs>
      <div class="w-0 flex">
        <van-icon name="search" size="20" @click="searchPopup = true"/>
      </div>
    </div>
    <van-popup v-model="searchPopup" position="top">
      <div class="pt-10">
        <van-field v-model="searchForm.displayName" label="名称" placeholder="请输入名称" input-align="right" />
        <van-cell title="日期" :value="`${searchForm.startCreateTime}-${searchForm.endCreateTime}`" @click="showCalendar = true"/>
        <van-button @click="submitSearch" block class="mt-2">搜索</van-button>
      </div>
    </van-popup>
    <vc-list ref="list" pull-refresh load-more :promise="loadData" class="p-3 overflow-initial" immediate>
      <vc-waterfall :data="list" gap="12px">
        <template #default="{ item, index }">
          <div class="flex flex-col bg-white rounded-lg shadow overflow-hidden" @click="toSwipe(index)">
            <img :src="getVideoFrame(item.videoUrl)" class="w-full">
            <div class="p-1 text-sm">
              <div>{{ item.displayName }}</div>
              <div class="flex justify-between items-center mt-1 text-xs">
                <div class="color-gray-500">
                  {{ item.createTime }}
                </div>
                <div class="flex items-center">
                  <van-icon :name="item.isLike ? 'like color-red-500' : 'like-o'"/>
                  <span class="ml-1">{{ item.likeCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </vc-waterfall>
    </vc-list>

    <van-calendar v-model="showCalendar" type="range" @confirm="onConfirm" :min-date="new Date('2020')"/>
  </div>
</template>

<style scoped lang="scss">
.van-tabs>>> {
  .van-tabs__wrap {
    height: 35px;
  }
}
</style>
