<template>
  <div class="bg-[#F9F9F9]">
    <van-search
      v-model="formData.searchCondition"
      show-action
      :clearable = "false"
      shape="round"
      placeholder="输入商品款号或名称"
      @search="onSearch"
    >
      <template #left>
        <van-icon name="arrow-left" class="px-1" @click="goBack()" />
      </template>
      <template #action>
        <div class="px-1" @click="onSearch">搜索</div>
      </template>
    </van-search>
    <van-empty
      v-if="showEmpty"
      description="暂无数据"
    />
    <div v-else class="w-full pb-10 content">
      <van-pull-refresh
       v-model="isPullRefreshLoading"
       @refresh="refresh()"
       success-text="加载成功"
       >
       <van-list
        class="bg-[#F9F9F9]"
        v-model="listloading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :immediate-check="false"
        @load="getData()"
        >
          <div class="content-box text-sm grid grid-cols-3 gap-3 p-2 box-border">
            <div
              class="list-item rounded-md relative bg-white"
              v-for="(item, index) in listData"
              :key="item.styleId"
            >
              <div class="addIcon">
                <img v-if="!checkSelected(item)" src="static/images/icon/add1.png" alt="" @click.stop="addSingle(item, index)">
                <img v-else src="static/images/icon/a-reduce.png" alt="" @click.stop="delSingle(item, index)">
              </div>
              <van-image
                v-if="item.resUrl"
                height="110"
                fit="contain"
                class="w-full rounded"
                :src="convertImageSize(item.resUrl)"
              >
                <template v-slot:error>加载失败</template>
              </van-image>
              <van-image
                v-else
                height="110"
                fit="contain"
                class="w-full rounded"
              >
                <template v-slot:error>暂无图片</template>
              </van-image>
              <div class="flex flex-col items-center">
                <p class="van-multi-ellipsis--l2 w-full px-2 text-center box-border text-xs">
                  {{item.styleName}}
                </p>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <!--底部确认-->
    <div class="page-btm !fixed bottom-0 text-sm flex justify-end w-full items-center p-2 box-border bg-white z-10">
      <div class="mr-2" @click="onShow">
        查看已选：{{ total }}/25
      </div>
      <!-- <van-button class="py-2" size="mini" type="info" round @click="onsubmit">确认</van-button> -->
    </div>

    <!--    弹出层-->
    <van-popup v-model="selectedShow" round position="bottom" :style="{ height: '65%' }" class="overflow-hidden py-3 box-border">
      <AddSale :selectedList = selectedList @addSuccess = addSuccess @del="delSingle" />
    </van-popup>
  </div>
</template>

<script>
import Header from '@/components/comps/header/header'
import AddSale from './AddSale.vue'
import dayjs from 'dayjs'
import { getStyleList,getReportFromsSales } from "@/api/shopSale"
import { convertImageSize } from '@/utils/helper'

export default {
  name: "SelectProduct",
  components: {
    Header,
    AddSale,
  },
  props:{
    fromShopSale: Boolean,
  },
  data: () => ({
    title:'选择商品',
    searchCondition:'',
    classList: [],
    selectClass: 0,
    listData: [], // 列表数据
    showEmpty: false,
    styleEmpty: false,
    clickConfirm: false,
    finished: false, // 如果加载完毕， 则为 true
    isPullRefreshLoading: false, // 异步加载完成， 为 false
    listloading: false, // 滚动到底部 listloading = true 加载完毕 为false
    error: false,
    formData: {
      pageNum: 1,
      pageSize: 18,
      brandId: localStorage.getItem('brandId'),
      searchCondition: '',
    },
    selectImgs: {},
    selectedShow: false,
    showDate: false,
    startcreateTime:'',
    endcreateTime:'',
    selectedList: [],
    selectedInfo: {},
  }),
  computed: {
    total(){
      return this.selectedList.length
    }
  },
  activated() {
    this.selectedList = []
    this.selectImgs = {}
    this.getReportFromsSales()
  },
  methods: {
    convertImageSize,
    // 模糊查询列表
    onSearch(val) {
      this.formData.pageNum = 1
      this.formData.pageSize = 18
      this.listData = []
      this.finished = false
      this.getData()
    },
    goBack(){
      this.$router.back()
    },

    // 进入挑选页面
    async getReportFromsSales(){
      const res = await getReportFromsSales({
        shopId: localStorage.shopId,
        recordDate: this.$route.query.currentTime.split('/').join(''),
      })
      this.selectedInfo = res.body
      res.body.detailList.forEach(item=> {
        this.selectedList.push(item)
        this.$set(this.selectImgs, item.styleId, item)
      })
      this.onSearch()
    },
    //  下拉加载
    refresh() {
      this.formData.searchCondition = ''
      this.finished = false
      this.isPullRefreshLoading = true
      this.listloading = true
      this.showEmpty = false
      this.formData.pageNum = 1
      this.getData()
    },
    getData(){
      getStyleList({
        ...this.formData,
      }).then((res) => {
        if (res.head.status !== 0) {
          this.$toast(res.head.msg)
          this.error = true
          return false
        } else {
          let resultList = [...this.listData]
          if (this.formData.pageNum === 1) {
            resultList = res.body.resultList
            this.showEmpty = res.body.resultList.length === 0
            if (res.body.count <= 18) {
              this.finished = true
            } else {
              this.formData.pageNum++
            }
          } else {
            resultList = [...resultList, ...res.body.resultList]
            if (res.body.count === resultList.length) {
              this.finished = true
            } else if (res.body.count > resultList.length) this.formData.pageNum++
          }
          this.listData = resultList.map(item=> {
            const index = this.selectedList.findIndex(el => el.styleId === item.styleId)
            item.salesNum = index > -1 ? this.selectedList[index].salesNum : 0
            item.salesAmount = index > -1 ?  this.selectedList[index].salesAmount : 0
            return item
          })
        }
      }).catch(() => {
        this.showEmpty = true
        this.error = true
        this.finished = true
      }).finally(() => {
        this.listloading = false
        this.isPullRefreshLoading = false
      })
    },
    // 添加照片到数组
    addSingle(item) {
      const index = this.selectedList.findIndex(el =>  el.styleId == item.styleId)
      if(index > -1){
        this.selectedList[index].salesNum++
      }else{
        item.salesNum++
        this.selectedList.push(item)
        this.$set(this.selectImgs, item.styleId, item)
      }
      if (this.total > 25) return this.$toast('最多只能选择25张图片')

    },

    // 是否选中
    checkSelected(item) {
      return this.selectImgs[item.styleId]
    },

    // 删除单项
    delSingle(item) {
      this.$delete(this.selectImgs, item.styleId)
      this.selectedList = this.selectedList.filter(el=> el.styleId !== item.styleId)
      const index = this.listData.findIndex(el=> el.styleId === item.styleId)
      if(index > -1){
        this.listData[index].salesNum = 0
        this.listData[index].salesAmount = 0
      }
    },

    onShow() {
      if (this.total === 0) {
        this.$toast('您还未选择任何商品')
      } else {
        this.selectedShow = true
      }
    },
    addSuccess(val){
      if(val){
        this.selectImgs = {}
        this.selectedList = []
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.content{
  height: calc(100% - 45px);
  overflow-y: auto;
  box-sizing: border-box;
}
div::marker{
  content: '' !important;
}
.addIcon {
  position: absolute;
  top: -11px;
  right: -2px;
  width: 25px;
  height: 25px;
  color: #fff;
  font-size: 25px;
  line-height: 30px;
  text-align: center;
  z-index: 1;
}
.addIcon > img{
  width:20px;
  height: 20px;
  margin-top:2.5px;
}
.page-btm > .van-button{
  padding: 0 10px !important;
}
</style>
