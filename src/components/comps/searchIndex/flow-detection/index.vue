<template>
  <div class="h-full bg-white rounded-md mt-2 px-2 py-4 text-sm">
    <div class="flex items-center relative">
      <div class="text-base font-bold mr-1">流量监测</div>
      <span class="text-xs">(近七日)</span>
      <van-icon class="absolute right-8" name="replay" @click="getPeopleTraffic()" />
    </div>
    <div class="min-h-30 w-full">
      <div ref="flowRef" v-if="Object.keys(FlowDetectionInfo)" style="height: 160px" class="p-1"></div>
      <div class="h-20 flex justify-center items-center text-[#666]" style="font-size: 16px;" v-else>暂无数据</div>
    </div>
  </div>
</template>

<script>
import { getPeopleTraffic } from "@/api/shopSale"
import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])

export default {
  name: 'FlowDetection',
  data(){
    return {
      FlowDetectionInfo: {},
    }
  },
  computed:{
    option(){
      return  {
        xAxis: {
          type: 'category',
          axisLabel: { interval: 0, rotate: 30 },
          data: this.FlowDetectionInfo.xList.reverse().map(item => item.slice(5)),
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.FlowDetectionInfo.yList.reverse(),
            type: 'line',
            label: {
              show: true,
              position: 'top'
            },
          }
        ],
        grid: {
          top: '30px',
          left: '30px',
          right: '30px',
          bottom: '30px'
        }
      }
    }
  },
  mounted(){
    this.getPeopleTraffic()
  },
  activated() {
    this.getPeopleTraffic()
  },
  methods: {
    initChartData(){
      const chartDom = this.$refs.flowRef
      const myChart = echarts.init(chartDom)
      this.option && myChart.setOption(this.option)
    },

    async getPeopleTraffic(){
      const res = await getPeopleTraffic({
        shopId: localStorage.shopId,
      })
      this.FlowDetectionInfo = res.body
      this.initChartData()
    },
  },

}
</script>

<style lang='scss' scoped>
</style>
