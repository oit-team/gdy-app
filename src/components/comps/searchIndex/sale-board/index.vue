<template>
  <div class="h-full bg-white rounded-md mt-2 p-2 text-sm">
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <div class="text-base font-bold">销售看板</div>
        <div class="ml-4 text-xs">昨日店铺排名NO.<span class="px-1 text-sm font-bold text-[#28B3EB]">{{ ranking }}</span></div>
      </div>
      <div class="flex items-center">
        <span class="text-xs text-[#aab]" @click="$router.push('/shop-sale/saleList')">去报销售</span>
        <van-icon color="#AAAABB" name="arrow" size="12" />
      </div>
    </div>
    <div v-if="Object.keys(saleBoardInfo)" class="grid grid-cols-2 grid-rows-2 gap-2 mt-2">
      <div class="flex flex-col justify-center items-center py-2 bg-[#F2F2F2]">
        <div>今日店铺销售额</div>
        <div class="flex mt-2">
          <img v-show="saleBoardInfo.todayTrend > 0" class="w-5 h-5" src="@/assets/img/shop-sale/top.png" alt="">
          <img v-show="saleBoardInfo.todayTrend < 0" class="w-4 h-5" src="@/assets/img/shop-sale/down.png" alt="">
          <div class="ml-1 text-base font-bold text-[#28B3EB]"><span class="text-xs">￥</span>{{ numeral(saleBoardInfo.todaySaleAmount).format('0,0') }}</div>
        </div>
      </div>
      <div class="flex flex-col justify-center items-center py-2 bg-[#F2F2F2]">
        <div>今日冠军店铺销售额</div>
        <div class="flex mt-2">
          <div class="ml-1 text-base font-bold text-[#28B3EB]"><span class="text-xs">￥</span>{{ numeral(saleBoardInfo.maxTodaySaleAmount).format('0,0') || 0 }}</div>
        </div>
      </div>
      <div class="flex flex-col justify-center items-center py-2 bg-[#F2F2F2]">
        <div>昨日店铺销售额</div>
        <div class="flex mt-2 items-center">
          <img v-show="saleBoardInfo.yesterdayTrend > 0" class="w-5 h-5" src="@/assets/img/shop-sale/top.png" alt="">
          <img v-show="saleBoardInfo.yesterdayTrend < 0" class="w-4 h-5" src="@/assets/img/shop-sale/down.png" alt="">
          <div class="ml-1 text-base font-bold text-[#28B3EB]"><span class="text-xs">￥</span>{{ numeral(saleBoardInfo.yesterdaySaleAmount).format('0,0') }}</div>
        </div>
      </div>
      <div class="flex flex-col justify-center items-center py-2 bg-[#F2F2F2]">
        <div>本月店铺销售额</div>
        <div class="flex mt-2">
          <img v-show="saleBoardInfo.nowMonthTrend > 0" class="w-5 h-5" src="@/assets/img/shop-sale/top.png" alt="">
          <img v-show="saleBoardInfo.nowMonthTrend < 0" class="w-4 h-5" src="@/assets/img/shop-sale/down.png" alt="">
          <div class="ml-1 text-base font-bold text-[#28B3EB]"><span class="text-xs">￥</span>{{ numeral(saleBoardInfo.nowTotalSaleAmount).format('0,0')}}</div>
        </div>
      </div>
    </div>
    <div class="h-20 flex justify-center items-center text-[#666]" style="font-size: 16px;" v-else>暂无数据</div>
  </div>
</template>

<script>
import numeral from 'numeral'
import {getReportFromsSalesForHome, getShopRank, getFittingNum } from "@/api/shopSale"
export default {
  name: 'SaleBoard',
  data(){
    return {
      saleBoardInfo: {}, // 看板列表
      ranking: '', // 排名
    }
  },
  mounted(){
    this.getShopRank()
    this.getReportFromsSalesForHome()
  },
  activated() {
    this.getShopRank()
    this.getReportFromsSalesForHome()
  },
  methods: {
    numeral,
    async getShopRank(){
      const res = await getShopRank({
        shopId: localStorage.shopId,
      })
      this.ranking = res.body.top
    },
    async getReportFromsSalesForHome(){
      const res = await getReportFromsSalesForHome({
        shopId: localStorage.shopId,
      })
      this.saleBoardInfo = res.body
    },
  },

}
</script>

<style lang='scss' scoped>
</style>
