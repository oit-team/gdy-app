<template>
  <div class="h-full bg-white rounded mt-2 px-2 py-4 text-sm">
    <div class="flex items-center">
      <div style="width: 4px; height: 18px" class="bg-[#2F5AD5] mr-1"></div>
      <div>试衣人数</div>
      <span class="text-xs">(近七日)</span>
    </div>
    <div class="min-h-30 w-full">
      <div ref="fittingRef" v-if="Object.keys(fittingRecordsInfo)" style="height: 160px" class="p-1"></div>
      <div class="h-20 flex justify-center items-center text-[#666]" style="font-size: 16px;" v-else>暂无数据</div>
    </div>
  </div>
</template>

<script>
import { getFittingNum } from "@/api/shopSale"
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
  name: 'FittingRecords',
  data(){
    return {
      fittingRecordsInfo: {},
    }
  },
  mounted(){
  },
  computed:{
    option(){
      return  {
        xAxis: {
          type: 'category',
          axisLabel: { interval: 0, rotate: 30 },
          data: this.fittingRecordsInfo.xList.reverse().map(item => item.slice(5)),
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.fittingRecordsInfo.yList,
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
    this.getFittingNum()
  },
  methods: {
    initChartData(){
      const chartDom = this.$refs.fittingRef
      const myChart = echarts.init(chartDom)
      this.option && myChart.setOption(this.option)
    },

    async getFittingNum(){
      const res = await getFittingNum({
        shopId: localStorage.shopId,
      })
      this.fittingRecordsInfo = res.body
      this.initChartData()
    },
  },

}
</script>

<style lang='scss' scoped>
</style>
