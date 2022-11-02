<template>
  <VueActions class="page" data="mouldList">
    <!--    头部-->
    <van-sticky>
      <div class="headBox">
        <backHeader style="background-color: #f5f5f5;" title="大屏模板">
          <span slot="left" class="head-class f-l" @click="$router.back()">
            <slot>
              <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
            </slot>
          </span>
          <span slot="right" class="head-class place-label" @click="$router.push('/large-screen/template/config')">
            <slot>
              <img class="add-icon" src="static/images/icon/addColl.png" alt="">
            </slot>
          </span>
        </backHeader>
      </div>
    </van-sticky>

    <!--    模板列表-->
    <div class="content w-full">
      <van-empty
        v-if="showEmpty"
        description="暂无数据"
      ></van-empty>
      <div v-else class="w-full">
        <van-pull-refresh
          v-model="isLoading"
          class="ub-refresh py-2 box-border"
          success-text="加载成功"
          @refresh="refresh"
        >
          <van-list
            v-model="loading"
            :finished="finished"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            finished-text="没有更多了"
            :immediate-check="false"
            @load="getData"
          >
            <van-swipe-cell
              v-for="item in indexData"
              :key="item.advId"
              class="h-24 mb-2"
            >
              <div class="card-left w-full h-full flex items-center text-base" @click="select(item)">
                <van-image
                  width="80"
                  height="80"
                  fit="contain"
                  :src="convertImageSize(item.resImgUrl)"
                  class="mx-2"
                />
                <div class="leading-loose">
                  <div>
                    {{ item.describe }}
                  </div>
                  <div class="text-gray-500 text-sm">
                    {{ item.updateTime ? item.updateTime : item.createTime }}
                  </div>
                </div>
              </div>
              <template #right>
                <van-button square type="primary" text="编辑" class="ml-1 h-full" @click="toEdit(item.advId)" />
                <van-button square type="danger" text="删除" class="h-full" @click="deleteMould(item.advId)" v-actions:deleteMould.click />
              </template>
            </van-swipe-cell>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
  </VueActions>
</template>

<script>
import { Dialog } from 'vant'
import backHeader from '@/components/comps/common/commonBackHeader'
import { getAdvertsShopAll, deleteAdvertsShop } from '@/api/largeScreen'
import { SELECT_TEMPLATE } from '../constant'
import { convertImageSize } from '@/utils/helper'

export default {
  components: {
    backHeader,
  },
  data() {
    return {
      formData: {
        pageSize: 20,
        pageNum: 1,
      },
      indexData: [],
      showEmpty: false,
      finished: false,
      isLoading: false,
      loading: false,
      error: false,
    }
  },
  activated() {
    this.getData()
  },
  methods: {
    convertImageSize,
    getData() {
      getAdvertsShopAll({
        ...this.formData,
      }).then((res) => {
        if (res.head.status !== 0) {
          this.$toast(res.head.msg)
          this.error = true
          return false
        } else {
          if (this.formData.pageNum === 1) {
            this.indexData = res.body.resultList
            this.showEmpty = res.body.resultList.length === 0
            if (res.body.count <= 20) {
              this.finished = true
            } else {
              this.formData.pageNum++
            }
          } else {
            this.indexData = [...this.indexData, ...res.body.resultList]
            if (res.body.count === this.indexData.length) {
              this.finished = true
            } else if (res.body.count > this.indexData.length) this.formData.pageNum++
          }
        }
      }).catch(() => {
        this.showEmpty = true
        this.error = true
        this.finished = true
      }).finally(() => {
        this.loading = false
        this.isLoading = false
      })
    },
    toEdit(id) {
      this.$router.push({
        // @deprecated
        path: '/large-screen/template/config?timestamp=' + Date.now(),
        query: {
          id,
        },
      })
    },
    async deleteMould(id) {
      await Dialog.confirm({
        title: '提示',
        message: '是否确定删除该模板？',
      })

      await deleteAdvertsShop({
        advertsShopId: id,
      })

      this.getData()
    },
    refresh() {
      this.isLoading = true
      this.formData.pageNum = 1
      this.getData()
    },
    select(item) {
      this.$root.$emit(SELECT_TEMPLATE, item.advId)
      this.$router.back()
    },
  },
}
</script>

<style lang='scss' scoped>
.page{
  height: 100%;
  background-color: #f5f5f5;
}
.headBox{
  height: 1.4rem;
}
.content{
  background-color: #f5f5f5;
}
.ub-refresh{
  min-height: calc(100vh - 1.4rem);
}
>>> .van-swipe-cell__wrapper{
  height: 100% !important;
  background-color: #ffffff;
}
>>> .van-button{
  height: 100%;
}
</style>
