<template>
  <div class="main" @touchmove.prevent>
    <div class="page">
      <ul>
        <li @click="toSecret">
          <span>修改密码</span><span><img src="static/images/dev/go@2x.png"></span>
        </li>
        <li @click="toAbout">
          <span>关于我们</span><span><img src="static/images/dev/go@2x.png" ></span>
        </li>
        <!-- <li>
          <span>清除缓存</span><div>3.87M<img src="static/images/dev/go@2x.png"></div>
        </li> -->
        <li>
          <span>版&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本</span><div>2.3.2</div>
        </li>
        <li @click="exit">
          <span>退出登录</span><span><img src="static/images/dev/go@2x.png" ></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
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
    },
    exit(){
      MessageBox.confirm('确定退出当前账号?').then(action => {
        let osType = localStorage.osType;
        localStorage.clear();
        localStorage.clear();
        this.$emit("indexSelect","搜索")
        this.$router.replace("/login?osType="+osType);
      });
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
.page ul{
  /* margin-top: 0.2rem; */
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
