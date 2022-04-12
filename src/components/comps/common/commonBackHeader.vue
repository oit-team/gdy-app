
<template>
  <div class="back-head">
    <slot name="left"></slot>
    <span class="head-tit">
      <span class="head-title ellipsis">{{title}}</span>
    </span>
    <!-- <slot name="share"></slot> -->
    <slot name="right"></slot>
  </div>
</template>
<script>
export default {
  name:"backCommonHeader",
  components:{},
  props:{
    title:String
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
.back-head{
  width:100%;
  height:1.2rem;
  // background-color: #13a7e3 ;
  background-color: #f6f6f6 ;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  .head-tit{
    color:#333;
    .head-title{
      // font-weight: bold;
      font-size:16px;
    }
  }
}

.head-class {
  font-size:18px;
  color:#333;
  width:33px;
  height:1.2rem;
  line-height:1.2rem;
  // background-color: pink;
  text-align: center;
}

.back-icon{
  // width:13px;
  // height:17px;
  width:8px;
  height: 13px;
}
.add-icon{
  // width:17px;
  // height:17px;
  width:13px;
  height:13px;
}


.add-box{
  img{
    width:20px;
  }
}
</style>
