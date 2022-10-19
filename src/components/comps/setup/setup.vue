<template>
  <VueActions class="main" data="setUp" @touchmove.prevent>
    <div class="page">
      <ul>
        <li @click="toSecret" v-actions:setSecret.click>
          <span>修改密码</span><span><img src="static/images/dev/go@2x.png"></span>
        </li>
        <li @click="toAbout" v-actions:setAbout.click>
          <span>关于我们</span><span><img src="static/images/dev/go@2x.png" ></span>
        </li>
        <li>
          <span>清除缓存</span><div>3.87M<img src="static/images/dev/go@2x.png"></div>
        </li>
        <li>
          <span>版&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本</span><div>1.0.0<img src=""></div>
        </li>
      </ul>
    </div>
  </VueActions>
</template>

<script>
export default {
  name: "",
  data() {
    return {
    };
  },
  methods:{
    toAbout(){
      this.$router.push('/about');
    },
    toSecret(){
      this.$router.push("/secret");
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
  font-size: 15px;
}
.header{
  height:1rem;
  padding:0 0.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}
.header img{
  height: 0.4rem;
}
.page ul{
  margin-top: 0.2rem;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  padding:0 15px;
}
.page ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height:45px;
}
.page ul li img{
  height:10.5px;
  width:5.5px;
  margin-left:0.1rem;
}
.page ul li div{
  color:#999999
}
</style>
