<template>
  <div class="h-full">
    <div v-if="todayResultList.length > 0" ref="todayRef" class="max-h-110 flex pt-2 overflow-x-auto sellBox">
      <div  class="sellItem bg-[#F9F9F9] relative p-1" v-for="(item,index) in todayResultList"  :key="index">
        <div>
          <img class="w-13 h-13 absolute -right-3.5 -top-5 z-10" v-show="index === 0" src="@/assets/img/shop-sale/top1.png" alt="">
          <img class="w-13 h-13 absolute -right-3.5 -top-5 z-10" v-show="index === 1" src="@/assets/img/shop-sale/top2.png" alt="">
          <img class="w-13 h-13 absolute -right-3.5 -top-5 z-10" v-show="index === 2" src="@/assets/img/shop-sale/top3.png" alt="">
        </div>
        <div class="bg-white flex flex-col justify-around items-center rounded p-1 pb-0 border-box"  @click="goToDetail(item)">
          <van-image
            v-if="item.resUrl"
            width="100%"
            height="110px"
            fit="contain"
            class="bg-white rounded overflow-hidden mb-2"
            :src="convertImageSize(item.resUrl)"
          >
            <template v-slot:error>加载失败</template>
          </van-image>
            <van-image
              v-else
              width="100%"
              height="110px"
              fit="contain"
              class="bg-white rounded overflow-hidden mb-2"
            >
              <template v-slot:error>暂无图片</template>
            </van-image>
          <div class="w-full flex flex-col justify-center items-center text-xs pb-2">
            <p class=" w-full min-h-4 truncate text-xs text-center">{{ item.styleName }}</p>
            <div>x<span class="numColor">{{ item.salesNum }}</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="h-20 flex justify-center items-center text-[#666]" style="font-size: 16px;" v-else>暂无数据</div>
  </div>
</template>

<script>
import { convertImageSize } from '@/utils/helper'
export default {
  name: 'todayTab',
  props:{
    todayResultList: {
      type: Array,
    }
  },
  data(){
    return {
      isClickToDetail: false,
    }
  },
  activated() {
    if(this.isClickToDetail){
      this.$refs.todayRef.scrollIntoView({behavior:'smooth', block: "center"})
    }
  },
  methods: {
    convertImageSize,
    goToDetail(item){
      this.isClickToDetail = true
      this.$router.push(`/goodsDetail2?styleId=${item.styleId}`)
    },
  },
}
</script>

<style lang='scss' scoped>
.sellItem{
  flex-shrink: 0;
  width: 32%;
  box-sizing: border-box;
  .numColor{
    padding-left: 2px;
    color: red;
  }
}
</style>
