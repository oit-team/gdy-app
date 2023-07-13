<template>
  <div class=" bg-[#F9F9F9] flex flex-col overflow-hidden">
    <van-sticky>
      <Header title="店铺销售">
        <div slot="after" class="flex gap-3">
          <span @click="$router.push('/shop-sale/share')">分享</span>
        </div>
      </Header>
    </van-sticky>
    <!-- 月度业绩 -->
    <div class="px-2 flex-1 flex flex-col overflow-hidden">
      <van-collapse v-model="activeNames">
        <van-collapse-item  name="1">
          <template #title>
            <div class="font-bold text-sm">
              月度业绩
              <span class="font-bold text-xs ml-4">{{ monthly }}业绩完成排名第2名</span>
            </div>
          </template>
          <div class="w-full px-2 box-border rounded-md  text-black bg-[#F2F2F2]">
            <div class="flex justify-between items-center">
              <!-- 左侧数据 -->
              <StatisticsData />
              <!-- 右侧图表 -->
              <FinishingRateEcharts />
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>

      <!-- 近七天选择时间 -->
      <div class="selectTime pl-3 bg-white border-b-solid border-gray-200 border-b mt-2 border-box flex items-center">
          <!-- 时间选择 -->
          <div class="h-full flex flex-1 overflow-x-auto">
            <div
              ref="selectedTimeRef"
              @click="changeSelectTime(item, index)"
              :class="nowIndex === index ? 'activeState' : ''"
              class="border-box px-3 flex flex-col justify-center items-center text-xs h-15"
              v-for="(item,index) in newSevenDaysList"
              :key="index"
            >
              <div class="font-bold px-1 text-sm">{{ dayjs(item.date).format('MM/DD') }}</div>
              <p class="truncate font-bold"><span class="pr-1 text-xs">￥</span>{{ numeral(item.salesAmount).format('0,0[.][0000]') }}</p>
            </div>

          </div>
          <!-- 日历选择 -->
          <div class="selectCalendar w-15 h-15" @click="showDate = true">
            <van-icon name="notes-o" size="30" color="#3789FE" />
          </div>

          <van-calendar ref="confirmDate"  :min-date="minDate" :max-date="maxDate" v-model="showDate" color="#1989fa" @confirm="onConfirmDate" />

      </div>
      <!-- 近七天下方销售额 -->
      <nearlySevenDay />

      <!-- 今日销售、退货tab -->
      <van-tabs color="#1978FE" v-model="activeTab">
        <van-tab title="今日销售"></van-tab>
        <van-tab title="今日退货"></van-tab>
      </van-tabs>

      <!-- 最下方操作栏 -->
      <!-- 今日销售 -->
      <div v-if="activeTab === 0" class="flex-1 flex overflow-hidden my-2">
        <div class="w-16% flex flex-col items-center overflow-y-auto bg-white rounded">
          <div class="w-full text-sm py-2 box-border flex justify-center items-center"
            :class="nowIndexSale === index ? 'bg-[#1978FE] text-white' : ''"
            v-for="(item, index) of salesVolumeList"
            :key="index"
            @click="changesalesVolume(item, index)"
          >
            第{{ item }}单
          </div>
          <div class="mt-2 p-2 box-border border border-solid border-[#7F7F7F] rounded flex justify-center items-center"
            @click="addsalesVolume"
          >
          <van-icon name="plus" size="22" color="#7F7F7F" />
          </div>
        </div>
        <div class="flex-1 pl-1 flex flex-col">
          <NowadaysSaleData />
          <!-- 商品页表区域 -->
          <div class="flex-1 overflow-y-auto mb-2 pt-3">
              <div class="h-full grid grid-cols-2 px-3 gap-3 pb-3 text-xs">
                <div v-for="(item,index) in 3" :key="index"  @click="$router.push(`/goodsDetail2?styleId=${item.styleId}`)">
                  <div class="relative box-border rounded-md bg-white">
                    <div class="addIcon">
                      <img src="static/images/icon/a-reduce.png" alt="" @click.stop="deleteProduct(item, index)">
                    </div>
                    <van-image
                      style="width: 100%"
                      height="110px"
                      fit="contain"
                      src="http://192.168.9.68:9107/download/0/2023/5/b54c84a0d50a4a3d814d6a40d68c222b.jpeg"
                    />
                    <p class="w-full min-h-4 text-center truncate">{{ item }}</p>
                  </div>
                  <div class="box-border py-1 bg-white flex justify-between items-center mt-1">
                    <p class="w-full text-center truncate">卖<span>{{ item }}</span>件</p>
                    <p class="w-full text-center text-red-500 font-bold truncate"><span>￥</span>{{ item }} </p>
                  </div>
                </div>
                <div @click="goToSelectGoods" class="flex min-h-35 justify-center items-center box-border rounded-md bg-white">
                  <van-icon name="plus" size="40" color="#7F7F7F" />
                </div>
              </div>
          </div>
        </div>
      </div>
      <!-- 今日退货 -->
      <div v-if="activeTab === 1" class="flex-1 flex items-center overflow-y-auto pt-3 my-2">
        <div class="w-full h-full grid grid-cols-3 px-3 gap-3 pb-3 text-xs">
            <div v-for="(item,index) in 4" :key="index"  @click="$router.push(`/goodsDetail2?styleId=${item.styleId}`)">
              <div class="relative box-border rounded-md bg-white">
                <div class="addIcon">
                  <img src="static/images/icon/a-reduce.png" alt="" @click.stop="deleteProduct(item, index)">
                </div>
                <van-image
                  style="width: 100%"
                  height="110px"
                  fit="contain"
                  src="http://192.168.9.68:9107/download/0/2023/5/b54c84a0d50a4a3d814d6a40d68c222b.jpeg"
                />
                <p class="w-full min-h-4 text-center truncate">{{ item }}</p>
              </div>
              <div class="box-border py-1 bg-white flex justify-between items-center mt-1">
                <p class="w-full text-center truncate">卖<span>{{ item }}</span>件</p>
                <p class="w-full text-center text-[#c00000] font-bold truncate"><span>￥</span>{{ item }} </p>
              </div>
            </div>
            <div @click="goToSelectGoods" class="flex min-h-35 justify-center items-center box-border rounded-md bg-white">
              <van-icon name="plus" size="40" color="#7F7F7F" />
            </div>
          </div>
      </div>
    </div>
    <van-dialog
      v-model="isIncludeShow"
      title="请确认商品是库内还是库外?"
      confirmButtonText="库内"
      confirmButtonColor="#4FC08D"
      cancelButtonText="库外"
      show-cancel-button
      @confirm="confirmIsIncluded"
      @cancel="cancelIsIncluded"
    >
    </van-dialog>
  </div>
</template>

<script>
import numeral from 'numeral'
import Header from '@/components/comps/header/header'
import dayjs from 'dayjs'
import FinishingRateEcharts from './components/FinishingRateEcharts.vue'
import StatisticsData from './components/statisticsData.vue'
import NearlySevenDay from './components/nearlySevenDay.vue'
import NowadaysSaleData from './components/NowadaysSaleData.vue'
import {getReportFromsSales, getDaysSaleAccount, getDailyReport } from "@/api/shopSale"
export default {
  name: 'index-new',
  components: {
    Header,
    FinishingRateEcharts,
    StatisticsData,
    NearlySevenDay,
    NowadaysSaleData
  },
  data: ()=>({
    isIncludeShow: false,
    showDate: false, // 日历弹窗
    activeTab: 0, // 今日销售 今日退货tab
    nowIndexSale: 0, // 第几单
    activeNames: ['1'],
    monthly: '2023-07',
    nowIndex: 6,
    nearlySevenDaysList: [], // 近七天数据
    newSevenDaysList: [],
    currentTime: dayjs(new Date()).format('YYYYMMDD'),
    minDate: dayjs().subtract(1, 'year').toDate(),
    maxDate: dayjs().add(0, 'day').toDate(),
    salesVolumeList: [1,2,3], // 第几单列表
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
  methods:{
    dayjs,
    numeral,
    // 切换日期
    changeSelectTime(item, index){
      this.nowIndex = index
      this.currentTime = item.date
      // this.getReportFromsSales()
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

    formatDate(date) {
      return dayjs(date).format('YYYYMMDD')
    },

    // 选择日历点击确认
    onConfirmDate(date) {
      this.showDate = false
      this.currentTime = this.formatDate(date)
      this.nearlySevenDaysList = this.getNearlySevenDaysList(this.currentTime)
      // console.log(this.currentTime,'当前时间')
      // this.getReportFromsSales()
    },

    // 切换第几单
    changesalesVolume(item, index){
      this.nowIndexSale = index
      // console.log(item, index,'111111111')
    },

    // 左侧第几单点击添加
    addsalesVolume(){
      this.salesVolumeList.push(this.salesVolumeList.length + 1)
      this.nowIndexSale = this.salesVolumeList.length -1
    },

    confirmIsIncluded(){
      // console.log('点击了库内')
      this.$router.push({
        path: '/shop-sale/selectProduct',
        // query: {
        //   id: this.shopSaleInfo.id,
        //   currentTime: this.currentTime,
        // }
      })
      this.isIncludeShow = false
    },
    cancelIsIncluded(){
      // console.log('点击在库外')
      this.$router.push('/shop-sale/selectNotInProduct')
      this.isIncludeShow = false
    },

    goToSelectGoods(){
      this.isIncludeShow = true
    },

    async getDailyReport(){
      const res = getDailyReport({
        shopId: localStorage.shopId,
        recordDate: this.currentTime,
      })
      // console.log(res, '11111111111')
      this.shopSaleInfo = res.body // 日销售看板销售额 折扣等
    },

    // 查询近七天日历的对应销售列表
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

    async getDaysSaleAccount(){
      const dList = this.nearlySevenDaysList
      const res = await getDaysSaleAccount({
        shopId: localStorage.shopId,
        dateList: dList,
      })
      this.newSevenDaysList = res.body.resultList // dateStr value
      await this.$nextTick()
      await this.getTimeScroll()
    },
  },
}
</script>

<style lang='scss' scoped>
>>> {
  .van-collapse-item__title{
    display: flex;
    align-items: center;
  }
  .van-collapse-item__content{
    padding: 0px 5px !important;
  }
}
  .selectTime{
    min-height: 56px;
    .activeState{
      color: white;
      background-color: #3B84EB;
      border-radius: 5%;
    }
    .selectCalendar{
      min-width: 56px;
      min-height: 56px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #eee;
      box-shadow: 1px 0.4px 1px #ddd;
      z-index: 10;
    }
  }
  .addIcon {
      position: absolute;
      top: -12px;
      right: -8px;
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
