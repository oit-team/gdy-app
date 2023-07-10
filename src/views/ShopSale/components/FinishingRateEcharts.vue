<template>
  <div ref="finishRate" class="w-32 h-32"></div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);
export default {
  name: 'FinishingRateEcharts', // 完成率图表
  computed: {
    option() {
      return {
        series: [
          {
            type: 'pie',
            radius: ['38%', '62%'],
            detail: {
              formatter: "{value}%"
            },
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'center',
              formatter: '{b}\n{d}%',
              fontSize: 12,
            },
            color: ['#c00000', '#d9d9d9'],
            emphasis: {
              label: {
                show: false,
                fontSize: 10,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: '完成率' },
              { value: 735, name: '未完成率' }
            ]
          }
        ]
      }
    },
  },
  watch: {
    option: {
      deep: true,
      handler() {
        this.initChartData()
      },
    },
  },
  mounted() {
    const chartDom = this.$refs.finishRate
    this.myChart = echarts.init(chartDom)
    this.initChartData()
  },
  methods: {
    initChartData() {
      this.option && this.myChart.setOption(this.option)
    },
  },
}
</script>

<style lang='scss' scoped>

</style>
