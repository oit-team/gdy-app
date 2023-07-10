<template>
  <div class="flex-1 text-xs gap-2 font-bold flex flex-col justify-center items-center overflow-hidden">
    <div class="flex gap-2 items-center">
      <div class="flex flex-col justify-center items-center">
        <div>月度目标</div>
        <div class="text-[#C00000] mt-1">
          <span class="text-xs">￥</span>100,000
        </div>
      </div>
      <div class="dividerBoardItem h-4 border-r border-r-dashed border-[#4C4C4C]"></div>
      <div  class="flex flex-col justify-center items-center">
        <div>实际完成</div>
        <div class="text-[#C00000] mt-1">
          <span class="text-xs">￥</span>100,000
        </div>
      </div>
    </div>
    <div class="flex gap-2 items-center">
      <div class="flex flex-col justify-center items-center">
        <div>销售件</div>
        <div class="text-[#C00000] mt-1">
          136
        </div>
      </div>
      <div class="dividerBoardItem"></div>
      <div  class="flex flex-col justify-center items-center">
        <div>客单数</div>
        <div class="text-[#C00000] mt-1">
          136
        </div>
      </div>
      <div class="dividerBoardItem"></div>
      <div  class="flex flex-col justify-center items-center">
        <div>总折扣</div>
        <div class="text-[#C00000] mt-1">
          9.9
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatisticsData', // 业绩销售 完成度
}
</script>

<style lang='scss' scoped>
  .dividerBoardItem{
    height: 15px;
    margin: 0 5px;
    border-right: 1px dashed #4C4C4C;
  }
</style>
