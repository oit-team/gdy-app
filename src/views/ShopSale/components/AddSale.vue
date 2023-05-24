<template>
  <div class="bg-[#F9F9F9] mb-2 overflow-y-auto">
    <div class="text-sm grid grid-cols-1 gap-2 box-border">
      <div v-for="(item,index) in detailList" :key="index" class="px-1">
        <van-swipe-cell>
          <div class="flex bg-white p-3 rounded">
            <div class="flex-1 flex">
              <van-image
                width="30%"
                height="110px"
                rounded
                fit="contain"
                :src="convertImageSize(item.resUrl)"
                class="flex-shrink-0"
              />
              <div class="leading-relaxed text-sm mx-4 my-2 flex flex-col justify-center">
                <div class="mb-4">{{ item.styleName }}</div>
                <div class="text-xs">{{ item.styleNo }}</div>
              </div>
            </div>
            <div class="flex flex-col justify-center">
              <van-stepper
                v-model="item.salesNum"
                min="1"
                integer
                input-width="28px"
                button-size="20px"
                />
                <div class="flex items-center mt-4">
                  <span>￥</span>
                  <van-field class="flex p-2" style="width: 60px" v-model="item.salesAmount" placeholder="价格" />
                </div>
            </div>
         </div>
          <template #right>
            <van-button square text="删除" type="danger" class="h-full" @click="rightSlideDelete(item)" />
          </template>
        </van-swipe-cell>
      </div>
    </div>
    <van-button class="!fixed bottom-0 w-full z-10" size="small" type="info" round @click="handleConfirm">确认</van-button>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import Header from '@/components/comps/header/header'
import { Toast } from 'vant';
import { convertImageSize } from '@/utils/helper'
import { addReportFromsSales } from "@/api/shopSale"
export default {
  name: 'AddSale',
  components: {
    Header,
  },
  props:{
    selectedList: Array,
  },
  data:() => ({
    detailList:[],
    salesNum: '',
    salesAmount: 0,
    addSuccess: false,
  }),
  watch: {
    selectedList(val){
    this.detailList = [...val]
    }
  },
  mounted() {
    this.detailList = [...this.selectedList]
  },
  methods:{
    convertImageSize,

    async rightSlideDelete(item){
      await this.$dialog.confirm({
        title: '提示',
        message: '确定要删除吗？',
      })
      this.$emit('del',item)

    },
    // 新增接口
    async addReportFromsSales(){
      const idObj = this.$route.query.id ? {id: this.$route.query.id} : {}
      await addReportFromsSales({
        ...idObj,
        shopId: localStorage.shopId,
        recordDate: this.$route.query.currentTime.split('/').join(''),
        detailList: this.detailList,
      })
      await Toast.success('添加成功！')
    },

    async handleConfirm(){
      await this.addReportFromsSales()
      this.$emit('addSuccess',true)
      this.$router.back()
    },
  }
}
</script>

<style lang='scss'>
</style>
