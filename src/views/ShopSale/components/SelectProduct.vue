<template>
  <div class="bg-[#F9F9F9] overflow-hidden">
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

<!--
    <van-tabs title-active-color="#1978FE" color="#1978FE" v-model="normalActiveTab" @change="changeSelect(item)" class="my-2">
      <van-tab v-for="(item, index) in normalDataList" :key="item.id" :title="item.fitOccasionName" />
    </van-tabs>

    <van-tabs v-if="seriesList.length > 0" title-active-color="#1978FE" color="#fff" v-model="seriesActiveTab" class="my-2">
      <van-tab v-for="(item, index) in seriesList" :key="item.id">
        <template #title>
          <div :class="index === seriesActiveTab ? 'bg-[#E8F1FE] border-[#1978FE]' : 'border-[#F5F5F5] bg-[#F5F5F5]'"
            class="px-2 py-1 border border-solid border-[#F5F5F5] bg-[#F5F5F5] rounded-lg"
          >
            {{ item.seriesName }}</div>
        </template>
      </van-tab>
    </van-tabs> -->

    <Scroll
      ref="kindTitScroll"
      class="kindTitBox"
      :probeType='3'
      :scrollX='true'
      :scrollY='false'
      :autoUpdate="true"
      :pullDown="false"
      :pullUp="false">
      <ul class="kindTitUl">
        <li
          v-for="(item,index) in normalDataList"
          :key="index"
          class="kindTitItem"
          :class="[item.id == normalActiveTab ?'active':'']"
          @click="clickKindItem(kindItem)">
          <span class="styleName">{{item.fitOccasionName}}</span>
        </li>
      </ul>
    </Scroll>

    <Scroll
      ref="kindTopScroll"
      class="kindTopBox"
      :listenScroll='true'
      :probeType='3'
      :scrollX='true'
      :scrollY='false'
      :autoUpdate="true"
      :pullDown="false"
      :pullUp="false">
      <!-- 滚动的内容 -->
      <ul class="scrollUl" >
        <li
          v-for="(item,index) in seriesList"
          :key="index"
          class="kindItem"
          :class="[item.id == seriesActiveTab ?'active':'']"
          @click="clickItem(item)">
          <span class="styleName">{{item.seriesName}}</span>
        </li>
      </ul>
    </Scroll>

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
              class="list-item rounded-md relative bg-white list-none"
              v-for="(item, index) in listData"
              :key="index"
            >
              <div class="addIcon">
                <img src="static/images/icon/add1.png" alt="" @click.stop="addSingle(item, index)">
                <!-- <img v-if="checkSelected(item)" src="static/images/icon/a-reduce.png" alt="" @click.stop="delSingle(item, index)"> -->
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
              <div class="flex flex-col items-center text-xs px-2">
                <p class="truncate w-full text-center box-border">
                  {{item.styleName}}
                </p>
                <div class="w-full truncate text-center font-bold text-red-500">￥<span class="text-sm">{{ item.stylePrice }}</span></div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <!--底部确认-->
    <div class="page-btm !fixed bottom-0 text-sm flex justify-end w-full items-center p-2 box-border bg-white z-10">
      <div class="mr-2" @click="onShow">
        查看已选：{{ total }}/15
      </div>
      <!-- <van-button class="py-2" size="mini" type="info" round @click="onsubmit">确认</van-button> -->
    </div>

    <!--    弹出层-->
    <van-popup v-model="selectedShow" round position="bottom" class="overflow-hidden py-2 box-border h-65%">
      <AddSale :selectedList = selectedList @addSuccess = addSuccess @del="delSingle" />
    </van-popup>
  </div>
</template>

<script>
import Header from '@/components/comps/header/header'
import AddSale from './AddSale.vue'
import dayjs from 'dayjs'
import { getStyleList, getReportFromsSales, normalList, getSeriesListById, seriesAllMethod } from "@/api/shopSale"
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
    normalActiveTab: 0,
    seriesActiveTab: 0,
    searchCondition:'',
    normalDataList: [],
    seriesList: [],
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
    // this.getReportFromsSales()
    this.getNormalList()
  },
  methods: {
    changeSelect(item){
      console.log(item,'hhhhhhhhhhhhhhhhhh')
    },
    clickKindItem(item){
      if(this.normalActiveTab != item.id){
        this.normalActiveTab = item.id;
        this.getSeriesListById();
      }
    },
    clickItem(item){
      this.seriesActiveTab = item.id
    },
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
      const dList = Array.from({length: 7}).map((item, index) => dayjs(this.$route.query.currentTime).subtract(index, 'day').format('YYYYMMDD')).reverse()
      const res = await getReportFromsSales({
        shopId: localStorage.shopId,
        recordDate: this.$route.query.currentTime,
        recordDateList: dList,
      })
      this.selectedInfo = res.body
      res.body.detailList.forEach(item=> {
        this.selectedList.push(item)
        this.$set(this.selectImgs, item.styleId, item)
      })
      this.onSearch()
    },

    async getNormalList(){
      const res = await normalList({
        "brandId": localStorage.getItem('brandId'),
        "typeId": 1,
      })
      this.normalDataList = res.data
      this.normalActiveTab = res.data.length === 0 ? 0 : res.data[0].id
      await this.getSeriesListById()
      await this.getData()
    },

    async getSeriesListById(){
      const id = this.normalActiveTab
      const res = await getSeriesListById({
        "brandId": localStorage.getItem('brandId'),
        "sId": id,
      })
      this.seriesList = res.data
      this.seriesActiveTab = res.data.length=== 0 ? 0 : res.data[0].id
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
        sId: this.normalActiveTab || this.normalDataList[0].id,
        seriesId: this.seriesActiveTab || this.seriesList[0].id,
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
          this.listData = resultList
          // this.listData = resultList.map(item=> {
          //   const index = this.selectedList.findIndex(el => el.styleId === item.styleId)
          //   item.salesNum = index > -1 ? this.selectedList[index].salesNum : 0
          //   return item
          // })
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
      item = JSON.parse(JSON.stringify(item))
      const index = this.selectedList.findIndex(el =>  el.styleId == item.styleId)
      if(index > -1){
        this.selectedList[index].salesNum++
      }else{
        item.salesNum++
        item.salesAmount = item.stylePrice
        this.$set(this.selectedList, this.selectedList.length, item)
        this.$set(this.selectImgs, item.styleId, item)
      }
      if (this.total > 15) return this.$toast('最多只能选择15张图片')

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

.kindTitBox {
    width:100%;
    height: 1.1rem;
    line-height: 1.1rem;
    display: flex;
    background-color: #fff;
    .kindTitUl{
      flex:1;
      overflow: hidden;
      display: flex;
      height: 1.1rem;
      .kindTitItem{

        padding:0px 15px;
        white-space: nowrap;
        height: 1.1rem;
        color:#999;
        box-sizing: border-box;
        .styleName{
          display: inline-block;
          height:  0.94rem;
          font-size: 14px;
          border-bottom:2px solid transparent;
          box-sizing: border-box;
        }

      }
      .kindTitItem:last-child{
        margin-right:0px;
      }
      .active{
        .styleName{
          color:#1978FE;
          font-size: 16px;
          border-bottom:2px solid #1978FE;
        }
      }
    }
  }

  .kindTopBox {
    width:100%;
    height: 1.4rem;
    line-height: 1.4rem;
    display: flex;
    margin:6px 0px;
    background-color: #fff;
    .scrollUl{
      flex:1;
      overflow: hidden;
      display: flex;
      height: 1.4rem;
      .kindItem{
        padding:0px 15px;
        white-space: nowrap;
        height: 1.4rem;
        color:#999;
        box-sizing: border-box;
        .styleName{
          padding:4px 10px;
          background-color: #f5f5f5;
          font-size: 14px;
          box-sizing: border-box;
          border-radius: 12px;
          border:0.5px solid #fff;
        }
      }
      .kindItem:last-child{
        margin-right:0px;
      }
      .active{
        .styleName{
          background-color: #E8F1FE;
          color:#1978FE;
          border:0.5px solid #1978FE;
        }
      }
    }
  }
</style>
