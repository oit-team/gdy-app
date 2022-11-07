<template>
  <VueActions class="page bacF" data="collocation">
    <van-sticky>
      <Header>
        <div slot="title">
          <span>选择搭配</span>
        </div>
        <div slot="after">
          <div @click="showDate = true">
            <van-icon name="notes-o" size="24"/>
          </div>
          <van-calendar ref="confirmDate" :min-date="minDate" :max-date="maxDate" v-model="showDate" type="range" @confirm="onConfirmDate" />
        </div>
      </Header>
    </van-sticky>
    <van-empty v-if="styleEmpty" description="暂无数据"></van-empty>
    <van-tabs v-model="selectClass" @click="onClick" v-actions:changeTabs.click v-else>
      <van-tab v-for="item in classList" :key="item.dictitemCode" :title="`${item.styleName}(${item.totalNum})`">
        <!--    列表-->
        <van-empty
          v-if="showEmpty"
          description="暂无数据"
        ></van-empty>
        <div v-else class="w-full pb-10">
          <van-pull-refresh
            v-model="isLoading"
            class="ub-refresh"
            success-text="加载成功"
            @refresh="refresh()"
          >
            <van-list
              v-model="loading"
              :finished="finished"
              :error.sync="error"
              class="bacF"
              error-text="请求失败，点击重新加载"
              finished-text="没有更多了"
              :immediate-check="false"
              @load="getData()"
            >
              <div class="content-box text-sm grid grid-cols-3 gap-3 p-2 box-border">
                <div
                  class="list-item rounded-md relative bg-white"
                  v-for="(item, index) in indexData"
                  :key="index"
                >
                  <div class="addIcon">
                    <img v-if="!checkSelected(item)" src="static/images/icon/add1.png" alt="" @click.stop="addSingle(item, index)" v-actions:addSingle.click>
                    <img v-else src="static/images/icon/a-reduce.png" alt="" @click.stop="delSingle(item, index)" v-actions:delSingle.click>
                  </div>
                  <van-image
                    height="110"
                    fit="contain"
                    class="item-img"
                    :src="convertImageSize(item.collImgUrl)"
                  />
                  <div class="list-info flex flex-col items-center">
                    <p class="van-multi-ellipsis--l2 w-full px-2 text-center h-10 box-border goodsFont">
                      {{item.collName}}
                    </p>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>

      </van-tab>
    </van-tabs>
    <!--    底部确认-->
    <div class="page-btm bgf !fixed bottom-0 text-sm flex justify-end w-full items-center p-2 box-border bg-white">
      <div class="mr-2" @click="onShow" v-actions:onShow.click>
        已选中：{{ total }}/15
      </div>
      <van-button class="py-2" size="mini" type="info" round @click="onsubmit">确认</van-button>
    </div>

    <!--    弹出层-->
    <van-popup v-model="show" round position="bottom" class="overflow-hidden pt-3 box-border max-h-7/10">
      <div class="overflow-y-auto grid grid-cols-3 gap-3 px-3 pb-3 h-full" v-actions:singlePop.duration>
        <div
          v-for="(item, index) of selectImgs"
          :key="item.resId"
          class="box-border relative aspect-9/16 flex bg-gray-100 rounded"
        >
          <van-image
            class="h-full w-full"
            :src="convertImageSize(item.resUrl)"
            fit="contain"
          ></van-image>
          <div class="pop-item__del" @click="delImg(item, index)" v-actions:delImg.click>
            <van-icon name="cross" color="#fff" size="14"></van-icon>
          </div>
        </div>
      </div>
    </van-popup>
  </VueActions>
</template>

<script>
import Header from '@/components/comps/header/header'
import { dictitemInfoAllMethod, getCollocationList } from "@/api/largeScreen"
import {SELECT_COLLOCATION} from './constant'
import { convertImageSize } from '@/utils/helper'
import dayjs from 'dayjs'

export default {
  name: "Collocation",
  components: {
    Header,
  },
  data: () => ({
    classList: [],
    selectClass: 0,
    indexData: [],
    showEmpty: false,
    styleEmpty: false,
    clickConfirm: false,
    finished: false, // 如果加载完毕， 则为 true
    isLoading: false, // 异步加载完成， 为 false
    loading: false, // 滚动到底部 loading = true 加载完毕 为false
    error: false,
    minDate: dayjs().subtract(6, 'month').toDate(),
    maxDate: dayjs().add(6, 'month').toDate(),
    formData: {
      pageNum: 1,
      pageSize: 18,
      brandId: localStorage.getItem('brandId'),
      styleCategory: '',
    },
    selectImgs: {},
    show: false,
    showDate: false,
    startcreateTime:'',
    endcreateTime:''
  }),
  computed: {
    total() {
      return Object.keys(this.selectImgs).length
    },
    pastTime(){
      return dayjs().subtract(6, 'month').toDate()
    }
  },
  activated() {
    this.onConfirmDate([this.pastTime, new Date()])
    this.$refs.confirmDate.reset()
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format('YYYY/MM/DD')
    },
    onConfirmDate(date) {
      const [start, end] = date
      this.startcreateTime =  this.formatDate(start)
      this.endcreateTime =  this.formatDate(end)
      this.showDate = false
      this.clickConfirm = true
      this.getClass()

    },
    convertImageSize,
    // 获取商品列表数据
    async getData() {
      this.isLoading = false
      this.showEmpty = false
      this.finished = false
      this.formData.styleCategory = this.classList[this.selectClass].styleName

      setTimeout(() => {
        getCollocationList({
          ...this.formData,
          startcreateTime: this.startcreateTime || this.pastTime,
          endcreateTime: this.endcreateTime || this.formatDate(new Date())
        }).then((res) => {
          if (res.head.status !== 0) {
            this.$toast(res.head.msg)
            this.error = true
            return false
          } else {
            if (this.formData.pageNum === 1) {
              this.indexData = res.body.collocationList
              this.showEmpty = res.body.collocationList.length === 0
              if (res.body.totalCount <= 18) {
                this.finished = true
              } else {
                this.formData.pageNum++
              }
            } else {
              this.indexData = [...this.indexData, ...res.body.collocationList]
              if (res.body.totalCount === this.indexData.length) {
                this.finished = true
              } else if (res.body.totalCount > this.indexData.length) this.formData.pageNum++
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
      }, 1000)
    },
    //  下拉加载
    refresh() {
      this.finished = false
      this.isLoading = false
      this.loading = true
      this.formData.pageNum = 1
      this.getData()
    },
    // 重置数据
    reset() {
      this.showEmpty = false
      this.error = false // 如果列表加载失败 则设置true
    },
    //获取分类列表tab
    getClass() {
      dictitemInfoAllMethod({
        brandId: localStorage.getItem('brandId'),
        type: 'styleCategory',
        userId: localStorage.getItem('userId'),
        startcreateTime: this.startcreateTime || this.pastTime,
        endcreateTime: this.endcreateTime || this.formatDate(new Date())
      }, {
        cmd: 100009
      }).then((res) => {
        if (res.head.status === 0) {
          this.classList = res.body.resultList
          const isEmpty = !this.classList.length
          this.styleEmpty = isEmpty
          !isEmpty && this.getData()
        }
      })
    },
    // 切换tab
    onClick(name, title) {
      this.indexData = []
      this.formData.pageNum = 1
      this.showEmpty = false
      this.loading = true
      this.finished = false
      this.error = false
      this.selectClass = name
      this.getData()
    },
    // 添加照片到数组
    addSingle(item) {
      const length = this.total + item.imgResInfo.length
      if (length > 15) return this.$toast('最多只能选择15张图片')

      item.imgResInfo.forEach(img => {
        this.$set(this.selectImgs, img.resId, {
          goods: item.commoditys,
          ...img,
        })
      })
    },
    // 删除照片
    delSingle(item) {
      item.imgResInfo.forEach(({ resId }) => this.$delete(this.selectImgs, resId))
    },
    checkSelected(item) {
      return item.imgResInfo.some(({ resId }) => this.selectImgs[resId])
    },
    // 单独删除图片
    delImg(item) {
      this.$delete(this.selectImgs, item.resId)
      if (this.total === 0) {
        this.show = false
      }
    },
    onShow() {
      if (this.total === 0) {
        this.$toast('您还未选择搭配单品')
      } else {
        this.show = true
      }
    },
    // 点击确认按钮
    onsubmit() {
      this.$root.$emit(SELECT_COLLOCATION, this.selectImgs)
      this.selectImgs = {}
      this.$router.back()
    },
  },
}
</script>

<style scoped>
.bacF{
  background-color: rgb(245, 245, 245);
}
.item-img{
  width: 100%;
}
.page{
  width: 100%;
  height: 100%;
}
.item-img >>> .van-image__img{
  border-radius: 5px 5px 0 0;
}
div::marker{
  content: '' !important;
}
.tipBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%
}
.tipBox > img{
  width:14px;
}
.goodsFont{
  font-size: 12px;
}
.addIcon {
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  color: #fff;
  font-size: 26px;
  line-height: 30px;
  text-align: center;
  z-index: 1;
}
.addIcon > img{
  width:25px;
  height: 25px;
  margin-top:2.5px;
}
.page-btm > .van-button{
  padding: 0 10px !important;
}
::v-deep .van-tabs__content{
  height: 80vh;
  overflow-x: hidden;
  overflow-y: auto;
}
.pop-item__del{
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-popup{
  bottom: 0;
  height: 70%;
}
</style>
