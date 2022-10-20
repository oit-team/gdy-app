<template>
  <VueActions class="page bacF" data="collocation">
    <van-sticky>
      <Header title="选择搭配"></Header>
      <van-tabs v-model="selectClass" @click="onClick" v-actions:changeTabs.click>
        <van-tab v-for="(item, index) in classList" :key="item.dictitemCode" :title="`${item.styleName}(${item.totalNum})`">
        </van-tab>
      </van-tabs>
    </van-sticky>
<!--    列表-->
    <van-empty
      v-if="showEmpty"
      description="暂无数据"
    ></van-empty>
    <div v-else class="w-full pb-10 bacF">
      <van-pull-refresh
        v-model="isLoading"
        class="ub-refresh"
        success-text="加载成功"
        @refresh="isLoading = true, formData.pageNum = 1, getData()"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          finished-text="没有更多了"
          :immediate-check="false"
          @load="getData()"
        >
          <div class="content-box text-sm grid grid-cols-3 gap-3 p-2 box-border">
            <div
              class="list-item rounded-md relative bg-white"
              v-for="(item, index) in indexData"
              :key="item.id"
            >
              <div class="addIcon">
                <img v-if="!item._chose" src="static/images/icon/add1.png" alt="" @click.stop="addSingle(item, index)" v-actions:addSingle.click>
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

    <!--    底部确认-->
    <div class="page-btm bgf !fixed bottom-0 text-sm flex justify-end w-full items-center p-2 box-border" @click.stop="onShow" v-actions:onShow.click>
      <div class="mr-2" @click="onShow">
        已选中：{{ selectImg.length }}/15
      </div>
      <van-button class="py-2" size="mini" type="info" round @click="onsubmit">确认</van-button>
    </div>

    <!--    弹出层-->
    <van-popup v-model="show" round position="bottom" class="overflow-hidden pt-3 box-border max-h-7/10 flex">
      <div class="overflow-y-auto flex flex-wrap items-center grid grid-cols-3 gap-3 px-3 pb-3" v-actions:singlePop.duration>
        <div
          v-for="(item, index) in selectImg"
          :key="item.resId"
          class="box-border relative aspect-9/16 flex bg-gray-100 rounded"
        >
          <van-image
            class="h-full w-full"
            :src="item.resUrl"
            fit="contain"
          ></van-image>
          <div class="pop-item__del" @click.stop="delImg(item, index)" v-actions:delImg.click>
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
    finished: false,
    isLoading: false,
    loading: false,
    error: false,
    formData: {
      pageNum: 1,
      pageSize: 18,
      brandId: localStorage.getItem('brandId'),
      styleCategory: '',
    },
    selectImg: [],
    show: false,
  }),
  activated() {
    this.getClass()
  },
  methods: {
    convertImageSize,
    // 获取商品列表数据
    getData() {
      this.formData.styleCategory = this.classList[this.selectClass].styleName
      getCollocationList({
        ...this.formData,
      }).then((res) => {
        if (res.head.status !== 0) {
          this.$toast(res.head.msg)
          this.error = true
          return false
        } else {
          if (this.formData.pageNum === 1) {
            this.indexData = res.body.collocationList
            if (res.body.collocationList.length === 0) this.showEmpty = true
            if (res.body.totalCount <= 20) {
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
          this.indexData.forEach(e => {
            e._chose = false
            e.imgResInfo.forEach(n => {
              const obj = this.selectImg.find(item => item.resId === n.resId)
              e._chose = obj ? true : false
            })
          })
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
    //获取分类列表tab
    getClass() {
      dictitemInfoAllMethod({
        brandId: localStorage.getItem('brandId'),
        type: 'styleCategory',
        userId: localStorage.getItem('userId'),
      }, {
        cmd: 100009
      }).then((res) => {
        if (res.head.status === 0) {
          this.classList = res.body.resultList
          this.getData()
        }
      })
    },
    // 切换tab
    onClick(name, title) {
      this.indexData = []
      this.showEmpty = false
      this.finished = false
      this.error = false
      this.selectClass = name
    },
    // 添加照片到数组
    addSingle(item, index) {
      const num = this.selectImg.length + item.imgResInfo.length
      if (num > 15) {
        this.$toast('最多只能选择15张图片')
        return false
      } else {
        item._chose = true
        this.$set(this.indexData, index, item)
        this.selectImg.push(...item.imgResInfo)
      }
    },
    // 删除照片
    delSingle(item, index) {
      item._chose = false
      this.$set(this.indexData, index, item)
      item.imgResInfo.forEach(e => {
        this.selectImg.forEach((i, index) => {
          if (e.resId === i.resId) {
            this.selectImg.splice(index, 1)
          }
        })
      })
    },
    // 单独删除图片
    delImg(item, index) {
      this.selectImg.splice(index, 1)
      this.indexData.forEach(e => {
        e.imgResInfo.forEach(n => {
          const obj = this.selectImg.find(item => item.resId === n.resId)
          e._chose = !!obj
        })
      })
      if (this.selectImg.length === 0) {
        this.show = false
      }
    },
    onShow() {
      if (this.selectImg.length === 0) {
        this.$toast('您还未选择搭配单品')
      } else {
        this.show = true
      }
    },
    // 点击确认按钮
    onsubmit() {
      this.$root.$emit(SELECT_COLLOCATION, this.selectImg)
      this.selectImg = []
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
.pop-scroll{
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
  max-height: 70%;
}
</style>
