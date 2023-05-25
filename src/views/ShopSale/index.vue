<template>
  <div class=" bg-[#F9F9F9]">
    <van-sticky>
      <Header title="店铺销售">
        <div slot="after">
          <van-icon name="plus" color="#000" @click="goToSelectGoods" />
      </div>
      </Header>
    </van-sticky>

    <div class="content">
      <div
        class="selectTime pl-3 bg-white border-b-solid border-gray-200 border-b border-box flex items-center"
      >
          <!-- 时间选择 -->
          <div class="h-full flex flex-1 overflow-x-auto">
            <div
              ref="selectedTimeRef"
              @click="changeSelectTime(item, index)"
              :class="nowIndex === index ? 'activeState' : ''"
              class="border-box px-3 flex flex-col justify-center items-center text-xs h-17"
              v-for="(item,index) in newSevenDaysList"
              :key="index"
            >
              <div class="font-bold px-1 text-base">{{ dayjs(item.date).format('MM/DD') }}</div>
              <p class="truncate font-bold"><span class="pr-1 text-xs">￥</span>{{ numeral(item.salesAmount).format('0,0') }}</p>
            </div>

          </div>
          <!-- 日历选择 -->
          <div class="selectCalendar w-17 h-17" @click="showDate = true">
            <van-icon name="notes-o" size="24" />
            <van-icon name="arrow-down" size="6" color="#bbb" />
          </div>

          <van-calendar ref="confirmDate"  :min-date="minDate" :max-date="maxDate" v-model="showDate" color="#1989fa" @confirm="onConfirmDate" />

      </div>
      <div class="statistics grid grid-cols-4 px-3 gap-3 flex justify-around items-center">
        <div class="flex flex-col justify-center items-center max-w-1/5 shrink-0 p-4 bg-[#F2F2F2] text-xs">
          <div class="text-sm mb-1">销售额</div>
          <p class="w-full text-center font-bold truncate text-[#2897DC] text-sm"><span class="pr-1 text-xs">￥</span>{{ numeral(shopSaleInfo.salesAmount).format('0,0') }}</p>
        </div>
        <div class="flex flex-col justify-center items-center shrink-0 p-4 bg-[#F2F2F2] text-xs">
          <div class="text-sm mb-1">销件数</div>
          <div class="font-bold text-[#2897DC] text-sm">{{ shopSaleInfo.salesNum }}<span class="pl-1 text-xs">件</span></div>
        </div>
        <div @click="changeStatistics" class="flex flex-col justify-center items-center shrink-0 p-4 bg-[#F2F2F2] text-xs">
          <div class="text-sm mb-1">客单数</div>
          <div class="font-bold text-[#2897DC] text-sm">{{ shopSaleInfo.guestNumber }}<span class="pl-1 text-xs">件</span></div>
        </div>
        <div class="flex flex-col justify-center items-center shrink-0 p-4 bg-[#F2F2F2] text-xs">
          <div class="text-sm mb-1">总折扣</div>
          <div class="font-bold text-[#2897DC] text-sm">{{ shopSaleInfo.grossDiscount }}</div>
        </div>
        <van-popup position="bottom" round v-model="updateStatisticsShow" :style="{ height: '30%',backgroundColor:'#F7F8FA' }" >
          <div class="h-full">
            <div class="perNum flex justify-center items-center p-3">客单数</div>
            <div class="flex flex-col justify-between items-center mt-4">
              <van-form>
                <van-field
                  name="guestNumber"
                  placeholder="填写客单数"
                  v-model="shopSaleInfo.guestNumber"
                />
                <div style="margin: 16px;">
                  <van-button round block type="info" native-type="submit" @click="handleSubmit()">保存</van-button>
                </div>
              </van-form>
            </div>
          </div>
        </van-popup>
      </div>
      <!-- 列表数据 -->
      <div class="flex-1" v-if="!shopSaleList.length">
        <van-empty description="暂无数据" />
      </div>
      <div style="width: 100%" v-else>
        <div v-if="editLoading" class="w-full h-full flex justify-center items-center">
          <van-loading size="24px" vertical>加载中...</van-loading>
        </div>
        <div v-else class="h-full grid grid-cols-3 px-3 gap-3 pb-3">
          <div class="relative box-border relative rounded-md bg-white" v-for="(item,index) in shopSaleList" :key="index"  @click="$router.push(`/goodsDetail2?styleId=${item.styleId}`)">
            <div class="addIcon">
              <img src="static/images/icon/a-reduce.png" alt="" @click.stop="deleteProduct(item, index)">
            </div>
            <van-image
              style="width: 100%"
              height="110px"
              fit="contain"
              :src="convertImageSize(item.resUrl)"
            />
            <div class="w-full flex flex-col items-center text-xs mb-2">
              <p class="w-full min-h-4 text-center truncate">{{ item.styleName }}</p>
              <p class="w-full text-center truncate">销售<span class="px-1 text-red-500">{{ item.salesNum }} </span>件</p>
              <p class="w-full text-center text-red-500 font-bold text-sm truncate"><span class="text-xs">￥</span>{{ item.salesAmount }} </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import numeral from 'numeral'
import { Dialog } from 'vant'
import Header from '@/components/comps/header/header'
import dayjs from 'dayjs'
import { Toast } from 'vant';
import { convertImageSize } from '@/utils/helper'
import {addReportFromsSales, getReportFromsSales } from "@/api/shopSale"
export default {
  name: 'SaleList',
  components: {
    Header,
  },
  data: ()=>({
    editLoading: false,
    updateStatisticsShow: false, // 客单量修改弹窗
    showDate: false, // 日历弹窗
    selectTime: '', // 选中的日期
    currentTime: dayjs(new Date()).format('YYYYMMDD'),
    nowIndex: 6,
    num: '', // 客单量修改的值
    nearlySevenDaysList: [], // 近七天数据
    newSevenDaysList: [],
    shopSaleInfo: {},
    shopSaleList: [],
    guestNumber: '', // 客单量
    minDate: dayjs().subtract(1, 'year').toDate(),
    maxDate: dayjs().add(0, 'day').toDate(),
    templateList: [],

  }),
  created(){
    this.nearlySevenDaysList = Array.from({length: 7}).map((item, index) => dayjs(new Date()).subtract(index, 'day').format('YYYYMMDD')).reverse()
  },
  mounted(){
    this.getReportFromsSales()
  },
  activated() {
    this.getReportFromsSales()
  },
  methods: {
    numeral,
    dayjs,
    convertImageSize,
    goToSelectGoods(){
      if(this.shopSaleInfo.id){
        this.$router.push({
          path: '/shop-sale/selectProduct',
          query: {
            id: this.shopSaleInfo.id,
            currentTime: this.currentTime,
          }
        })
      }else{
        this.$router.push({
          path: '/shop-sale/selectProduct',
          query: {
            currentTime: this.currentTime,
          }
        })
      }
    },

    // 获取近七天的时间
    getNearlySevenDaysList(time){
      return Array.from({length: 7})
      .map((item, index) => dayjs(time).subtract(index, 'day').format('YYYYMMDD')).reverse()
    },

    // 时间滚动事件
    getTimeScroll(){
      this.$refs.selectedTimeRef[this.nowIndex].scrollIntoView({behavior:'smooth', inline: 'center'})
    },
    // 查询列表
    async getReportFromsSales(){
      const dList = this.nearlySevenDaysList
      const res = await getReportFromsSales({
        shopId: localStorage.shopId,
        recordDate: this.currentTime,
        recordDateList: dList,
      })
      this.shopSaleInfo = res.body
      this.newSevenDaysList = res.body.recordDateResultList
      this.shopSaleList= res.body.detailList
      await this.$nextTick()
      await this.getTimeScroll()
    },

    // 切换日期
    changeSelectTime(item, index){
      this.nowIndex = index
      this.currentTime = item.date
      this.getReportFromsSales()
    },

    formatDate(date) {
      return dayjs(date).format('YYYYMMDD')
    },
    // 选择日历点击确认
    onConfirmDate(date) {
      this.showDate = false
      this.currentTime = this.formatDate(date)
      this.nearlySevenDaysList = this.getNearlySevenDaysList(this.currentTime)
      this.getReportFromsSales()
    },

    // 点击客单数修改
    changeStatistics(){
      this.updateStatisticsShow = true
    },

    // 新增、编辑、删除接口
    async editReportFromsSalesList(){
      this.editLoading = true
      const idObj = !this.shopSaleList.length ? {} : { id: this.shopSaleInfo.id }
      await addReportFromsSales({
        shopId: localStorage.shopId,
        ...idObj,
        guestNumber: this.shopSaleInfo.guestNumber,
        recordDate: this.currentTime,
        detailList: !this.templateList.length ? this.shopSaleList : this.templateList,
      }).finally(()=> this.editLoading = false)

      await Toast.success('添加成功！')
    },

    // 保存客单数
    async handleSubmit(){
      await Dialog.confirm({ message: '确认保存吗？'})
      await this.editReportFromsSalesList()
      await this.getReportFromsSales()
      this.updateStatisticsShow = false
    },

    // 删除列表单项
    async deleteProduct(item,index){
      await Dialog.confirm({message: '确认删除该项吗？'})

      if(this.shopSaleList.length === 1){
        await Toast('至少保留一项！')
        return
      }
      this.templateList = JSON.parse(JSON.stringify(this.shopSaleList))
      this.templateList.splice(index,1)
      await this.editReportFromsSalesList()
      await this.getReportFromsSales()
      this.templateList = []
    },
  },
}
</script>

<style lang='scss' scoped>
  .content{
    height: calc(100% - 45px);
    overflow-y: auto;
    box-sizing: border-box;
  }
  .selectTime{
    min-height: 74px;
    .activeState{
      color: white;
      background-color: #3B84EB;
      border-radius: 5%;
    }
    .timeColor{
      padding: 2px 0;
      font-weight: bold;
      font-size: 18px;
    }
    .timeMoneyColor{
      font-size: 12px;
      font-weight: bold;
    }
    .selectCalendar{
      min-width: 74px;
      min-height: 74px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #eee;
      box-shadow: -1px -2px 8px #ddd;
      z-index: 10;
    }
  }
  .statistics{
    margin: 10px 0;
    .statisticsItem{
      font-size: 12px;
      padding: 10px;
      background-color: #F2F2F2;
    }
  }
  .perNum{
    border-bottom: 1px solid #ccc;
  }
  .addIcon {
    position: absolute;
    top: -12px;
    right: -10px;
    width: 25px;
    height: 25px;
    color: #fff;
    font-size: 26px;
    line-height: 30px;
    text-align: center;
    z-index: 1;

    img{
      width:20px;
      height: 20px;
      margin-top:2.5px;
    }
  }
</style>
