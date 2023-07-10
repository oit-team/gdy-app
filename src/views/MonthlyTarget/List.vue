<template>
  <div class="monthly-target">
    <van-sticky>
      <Header title="月度目标">
        <div slot="after">
          <span @click="showPopup()">添加</span>
        </div>
      </Header>
    </van-sticky>
    <van-cell-group>
      <van-cell v-for="(item, index) in list" :key="index" @click="showPopup(item)">
        <div slot="title">{{ dayjs(item.date).format('YYYY年MM月') }}</div>
        <div slot="default" class="text-left text-black">月度目标：<span class="text-xs">￥</span>{{ item.target }}</div>
      </van-cell>
    </van-cell-group>

    <van-popup v-model="popupVisible" position="bottom" round>
      <div class="py-2 pb-6">
        <van-cell title="日期" @click="popupDateVisible = true" :value="popupData.date" />
        <van-field v-model="popupData.target" label="目标" type="number" input-align="right" />
      </div>
      <van-button type="primary" @click="savePopupData" block>保存</van-button>
    </van-popup>
    <van-popup v-model="popupDateVisible" position="bottom" round>
      <van-datetime-picker
        :value="dayjs(popupData.date).toDate()"
        @confirm="popupDateVisible = false, popupData.date = dayjs($event).format('YYYYMM')"
        type="year-month"
        title="选择日期"
      />
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data() {
    return {
      list: [],
      popupVisible: false,
      popupData: {},
      popupDateVisible: false,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    dayjs,
    showPopup(item) {
      this.popupData = item ? { ...item } : { date: dayjs().format('YYYYMM'), target: 0 };
      this.popupVisible = true;
    },
    async savePopupData() {
      this.popupVisible = false;
      const date = dayjs(this.popupData.date)
      await this.$post('/data/sales/monthly/save', {
        year: date.year(),
        month: date.month() + 1,
        targetSalesAmount: this.popupData.target,
      })
      this.loadData()
    },
    async loadData() {
      const res = await this.$post('/data/sales/monthly/targetList')
      this.list = res.body.datas.map(item => ({
        date: String(item.recordDate),
        target: item.targetSalesAmount,
      }))
    },
  },
};
</script>

<style lang="scss">
.monthly-target {
  .van-cell {
    .van-cell__value, .van-cell__title {
      color: black;
    }
    &::after {
      border-bottom: solid 1px #c5c5c5;
    }
  }
}
</style>
