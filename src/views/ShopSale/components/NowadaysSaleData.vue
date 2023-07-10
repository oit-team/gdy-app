<template>
   <div class="flex mb-2 items-center rounded grid grid-col-5 gap-.5 bg-white font-bold mt-2 overflow-hidden">
      <div class="saleNumItem">
        <div>吊牌额</div>
        <div class="text-[#c00000]"><span>￥</span>15,000</div>
      </div>
      <div class="dividerItem"></div>
      <div class="saleNumItem">
        <div>销售额</div>
        <div class="text-[#c00000]"><span>￥</span>15,000</div>
      </div>
      <div class="dividerItem"></div>
      <div class="saleNumItem">
        <div>总折扣</div>
        <div class="text-[#c00000]">0.80</div>
      </div>
      <div class="dividerItem"></div>
      <div class="saleNumItem">
        <div>销售件</div>
        <div class="text-[#c00000]">8</div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'NowadaysSaleData', // 当天切换单数时的销售额数据预览
}
</script>

<style lang='scss' scoped>
  .saleNumItem{
    flex:1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: bold;
    padding: 5px 5px;
  }
  .dividerItem{
    height: 25px;
    border-right: 1px dashed #ccc;
  }
</style>
