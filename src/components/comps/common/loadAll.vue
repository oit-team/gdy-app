<template>
  <div id="loadAll">
    <span class="hr_block"></span>
    <span class="no-desc">我是有底线的</span>
    <span class="hr_block"></span>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="">
  #loadAll{
    width:100%;
    text-align: center;
    font-size:14px;
    color:#999;
    display: flex;
    height:1rem;
    align-items: center;
  }
  .no-desc{
    margin:0px 5px;
  }
  .hr_block{
    width:18px;
    height:0.5px;
    border-top:0.5px solid #ccc;
  }
  .hr_block:first-child{
    margin-left:auto;
  }
  .hr_block:last-child{
    margin-right:auto;
  }

</style>
