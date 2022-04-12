
<template>
  <div class="no_cart">
    <img src="static/images/icon/search_icon_empty.png" alt="">
    <!-- <div class="desc">没有更多的数据</div> -->
    <div class="empty_desc">{{msg}}</div>
  </div>
</template>
<script>
export default {
  name:"noGood",
  components:{},
  props:{
    msg:String
  },
  data() {
    return {
    }
  },
  methods:{
  }
}
</script>
<style lang="less">
.no_cart{
  width:100%;
  height:100%;
  margin-top:100px;
  box-sizing: border-box;
  img{
    width:80px;
    display: block;
    margin:0 auto;
  }
  .desc{
    font-size:14px;
    text-align: center;
    margin-top:20px;
    color:#666;
  }
  .empty_desc{
    font-size:14px;
    text-align: center;
    margin-top:20px;
  }
}
</style>
