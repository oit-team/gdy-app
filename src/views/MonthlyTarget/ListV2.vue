<template>
  <div class="monthly-target">
    <van-sticky>
      <Header title="月度目标">
        <div slot="after">
          <!-- <span @click="showPopup()">添加</span> -->
        </div>
      </Header>
    </van-sticky>
    <div>
      <van-dropdown-menu >
        <van-dropdown-item v-model="selectedYear" :options="yearOptions" @change="refreshItems"/>
      </van-dropdown-menu>
      <div v-for="(item,index) in items" :key="index" class="flex flex-1 justify-around items-center rounded grid grid-col-4 gap-.5 font-bold overflow-hidden my-2">
        <div v-for="it in item" :key="it.month" class="flex flex-col justify-around text-center w-20 h-15 rounded bg-[#F2F2F2]" @click="showPopup(it)">
          <div>{{it.month}}月</div>
          <div class="text-xs"><span class="text-xs">￥</span>{{!!it.target?it.target:0}}</div>
        </div>
      </div>
    </div>
    <van-popup v-model="popupVisible" position="bottom" round>
      <div class="py-2 pb-6">
        <van-cell title="日期" :value="popupData.displayDate" />
        <van-field v-model="popupData.target" label="目标" type="number" input-align="right" />
      </div>
      <van-button type="primary" @click="savePopupData" block>保存</van-button>
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
      yearOptions:[],
      selectedYear:0,
      items:{}
    };
  },
  created(){
    this.initYearOptions();
  },
  mounted() {
    this.init();
    this.loadData();
  },
  methods: {
    dayjs,
    showPopup(item) {
      this.popupData = {
        ...item,
        displayDate:this.selectedYear+"年"+item.month+"月",
        target:item.target?item.target:0,
        date:this.selectedYear*100+item.month
      };
      this.popupVisible = true;
    },
    async savePopupData() {
      this.popupVisible = false;
      const date = this.popupData.date
      await this.$post('/data/sales/monthly/save', {
        year: Math.floor(date/100),
        month: date%100,
        targetSalesAmount: this.popupData.target,
      })
      this.loadData()
    },
    async loadData() {
      const res = await this.$post('/data/sales/monthly/targetList')
      this.list = res.body.datas.map(item => ({
        date: item.recordDate,
        target: item.targetSalesAmount,
      }))
      this.refreshItems();
    },
    init(){
      let items = new Array();
      for(let i=0;i<4;i++){
        let itemRow = new Array();
        for(let j=0;j<3;j++){
          itemRow.push({
            month:i*3+j+1
          });
        }
        items.push(itemRow);
      }
      this.items=items;
    },
    refreshItems(year){
      this.init();
      for(let data of this.list){
        if(Math.floor(data.date/100) === this.selectedYear){
          let month = (data.date%100-1);
          let i = Math.floor(month/3);
          let j = month%3;
          this.items[i][j] = {
            ...this.items[i][j],
            target:data.target
          }
        }
      }
    },
    initYearOptions(){
      let yearOptions = new Array();
      for(let i=0;i<3;i++){
        let year = dayjs().subtract(i-1, 'year').year();
        console.log(year);
        yearOptions.push({
          text:year+"年",
          value:year
        });
      }
      this.yearOptions=yearOptions;
      this.selectedYear = dayjs().year();
    }
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
