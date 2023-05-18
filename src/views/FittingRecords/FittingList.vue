<template>
  <div class="h-screen bg-gray-100">
    <van-sticky>
      <Header title="试穿记录"></Header>
    </van-sticky>

    <!-- 记录列表 -->
    <van-empty v-if="showListEmpty" description="暂无数据，请重新加载" />
    <div v-else class="fittingList w-full pb-4">
      <van-pull-refresh v-model="refreshing" success-text="加载成功" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          @load="onLoad()"
        >
          <van-cell class="fitListItem" v-for="(item,index) in fittingList" :key="index"  @click="showPopup(item)">
             <div class="list flex justify-between">
              <div class="flex flex-1 flex-col">
                <div>设备名称：{{item.devSerialNum}}</div>
                <div>试衣时间：{{item.createTime}}</div>
              </div>
              <div class="listCount flex justify-between items-center">
                件数：<div class="countColor">{{item.styleCount}}</div>
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 弹出层 -->
    <van-popup v-model="show" round position="bottom" class="overflow-y-auto pt-3 box-border max-h-7/10 flex">
      <div class="h-full flex-1" v-if="fittingListItemDetail.length === 0">
        <van-empty description="暂无试衣数据" />
      </div>
      <div style="width: 100%" v-else>
        <div class="deviceInfo">
          <div>设备名称：{{fittingListItemInfo.devSerialNum}}</div>
          <div>试衣时间：{{fittingListItemInfo.createTime}}</div>
        </div>
        <div  class="grid grid-cols-3 gap-3 px-3 pb-3">
          <div v-for="(item,index) in fittingListItemDetail" :key="index">
            <div  class="fittingDetai box-border relative aspect-9/16 flex flex-col justify-center items-center rounded">
              <van-image
                height="120"
                fit="contain"
                :src="convertImageSize(item.resUrl, 's')"
              />
              <div class="fittingNo">{{item.styleNo}}</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

  </div>
</template>

<script>
import { convertImageSize } from '@/utils/helper'
import Header from '@/components/comps/header/header'
import { getFitGoodsInfo } from "@/api/fittingRecords"


export default {
  components: {
    Header,
  },

  data: () => ({
    loading: true,
    finished: false,
    refreshing: false,
    show: false,
    error: false,
    showListEmpty: false,
    fittingListItemInfo:{
      devSerialNum:'',
      createTime:''
    },

    formData: {
      pageNum:1,
      pageSize: 18,
    },
    fittingList: [], // 试衣列表
    fittingListItemDetail: [], // popUp列表
  }),

  activated() {
    this.formatData()
  },

  methods: {
    // 下拉刷新
    onRefresh() {
      this.refreshing = true
      this.formatData()
    },
    convertImageSize,
    formatData(){
      // 清空列表数据
      this.finished = false
      // 重新加载数据
      this.loading = true
      this.showListEmpty = false
      this.formData.pageNum = 1
      this.onLoad()
    },
    // 获取列表数据
    onLoad(){
      getFitGoodsInfo({
        ...this.formData,
      }).then((res) => {
        if (res.head.status !== 0) {
          this.$toast(res.head.msg)
          this.error = true
          return false
        } else {
          if (this.formData.pageNum === 1) {
            this.fittingList = res.body.result
            if (res.body.result.length === 0) this.showListEmpty = true
            if (res.body.count <= 18) {
              this.finished = true
            } else {
              this.formData.pageNum++
            }
          } else {
            this.fittingList = [...this.fittingList, ...res.body.result]
            if (res.body.count === this.fittingList.length) {
              this.finished = true
            } else if (res.body.count > this.fittingList.length) this.formData.pageNum++
          }
        }
      }).catch(() => {
        this.showListEmpty = true
        this.error = true
        this.finished = true
      }).finally(() => {
        this.loading = false
        this.refreshing = false
      })
    },
    // 弹出框
    showPopup(item){
      this.show = true
      this.fittingListItemInfo.devSerialNum = item.devSerialNum
      this.fittingListItemInfo.createTime = item.createTime
      this.fittingListItemDetail = item.styleList
    },
  },
}
</script>

<style lang='scss' scoped>
.fittingList {
  height: calc(100% - 45px);
  overflow-y: auto;
  box-sizing: border-box;
}
.fitListItem{
  &::after{
    border-bottom: 1px solid #aaa;
  }
  .listCount{
    .countColor{
      color: red;
      font-size: 16px;
    }
  }
}
.deviceInfo{
  padding: 10px 16px;
  color: #333;
  font-size: 14px;
}
.fittingDetai{
  border: 1px solid #ccc;
  border-radius: 5%;
  box-shadow: 2px 2px 2px #ccc;
  .fittingNo{
    font-size: 14px;
  }
}
</style>
