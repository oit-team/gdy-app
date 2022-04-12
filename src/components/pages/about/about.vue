<template>
  <div class="main" @touchmove.prevent>
    <div class=header>
      <img src="static/images/dev/back@2x.png" @click="back">
      <span>关于我们</span>
      <img>
    </div>
    <div class="page">
      <div class="top">
        <span></span><div>关于小美优品</div><span></span>
      </div>
      <div class="sub">About small beauty products</div>
      <div class="content">
        <div class="content_main">
          拥抱科技，开启智慧零售商品学习新时代；<br>
          快速成长，用业绩展示时尚新力量。
        </div>
        <div class="content_sub">
          ·商品知识、组合搭配，随时学习，迅速掌握<br>
          ·哪款不会搜哪款，卖点解析、搭配解读轻松掌握<br>
          ·主推搭配？小美优品给你灵感<br>
          ·介绍商品？小美优品轻松解决<br>
          ·满足顾客不同场合的需求？小美优品提供方案<br>
          ·……<br>
          更多功能，期待您的使用。<br>
        </div>
      </div>
      <div class="bg"><img src="static/images/dev/aboutusBg@2x.png"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {

    };
  },
  methods:{
    back(){
      this.$router.go(-1);
    }
  },
  mounted(){

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{
  background:#EFEFF1;
  display: flex;
  flex-direction: column;
  color: #333333;
  font-family:PingFang-SC-Medium;
  font-size: 14px;
  overflow: hidden;
}
.header{
  height:1rem;
  padding:0 0.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  flex-shrink: 0;
  /* flex:0; */
}
.header img{
  height: 0.4rem;
}
.page{
  flex: 1;
  /* height: 30rem; */
  background-color: #fff;
  /* overflow: hidden; */
}
.page .top{
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00A8C5;
  font-size: 18px;
  margin-top: 25px;
}
.page .top span{
  width: 23.5px;
  height:1.5px;
  background-color: #00A8C5;
}
.page .top div{
  padding: 0 0.2rem;
}
.page .sub{
  text-align: center;
  font-size: 9px;
  color: #00A8C5;
}
.page .content{
  padding-left: 74px;
  margin-top:19px;
  line-height: 22px;
  color:rgba(51,51,51,1);
  font-weight:400;
}
.content .content_main{
  font-size: 12px;
  line-height:20px;
}
.content .content_sub{
  margin-top: 35px;
  font-size: 9px;
  line-height:18px;
}
.page .bg{
  height: 283px;
  text-align: center;
  margin-top: 12.5px;
}

.page .bg img{
  height: 100%;
}
</style>
