<template>
  <div class="main" @touchmove.prevent>
    <div class="page">
      <ul>
        <li class="flex-b">
          <div class="header">
            <img src="static/images/default/heder_default.png">
            <div>
              <div class="name">轩辕皓月</div><div class="occupation">上海久光 导购</div>
            </div>
          </div>
          <div class="news">
            <img src="static/images/icon/news.png" alt="">
          </div>
        </li>
        <li @click="toSecret">
          <div class="flex-s"><img class="icon_font" src="static/images/icon/library.png" alt="">我的知识库</div>
          <span><img class="right_icon" src="static/images/dev/go@2x.png"></span>
        </li>
        <li @click="toUserinfo">
          <div class="flex-s"><img class="icon_font" src="static/images/icon/setUp.png" alt="">我的设置</div>
          <span><img class="right_icon" src="static/images/dev/go@2x.png"></span>
        </li>
        <!-- <li>
          <span>清除缓存</span><div>3.87M<img src="static/images/dev/go@2x.png"></div>
        </li> -->
        <!-- <li>
          <span>版&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本</span><div>2.3.2</div>
        </li>
        <li @click="exit">
          <span>退出登录</span><span><img src="static/images/dev/go@2x.png" ></span>
        </li> -->
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
    toUserinfo(){
      this.$router.push('/userInfo');
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
  background:#fff;
  display: flex;
  flex-direction: column;
  color: #333333;
  font-family:PingFang-SC-Medium;
  font-size: 15px;
}
.flex-b{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.flex-s{
  display: flex;
  align-items: center;
}
.icon_font{
  width: 20px;
  margin-right: 12.5px;
}
.header{
  display: flex;
  align-items: center;
}
.page ul li .name{
  font-size:15px;
  font-family:FZLanTingHeiS-R-GB;
  font-weight:400;
  color:rgba(26,26,26,1);
}
.page ul li .occupation{
  font-size:9px;
  font-family:FZLanTingHeiS-R-GB;
  font-weight:400;
  color:rgba(191,191,191,1);
  margin-top: 7px;
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
  padding: 15px 0;
}
.page ul li .right_icon{
  height:10.5px;
  width:5.5px;
  margin-left:0.1rem;
}
.page ul li .header img{
  width: 65px;
  height: 65px;
  border-radius: 50%;
  margin-right: 13.5px;
}
.news{
  align-self: flex-start;
}
.page ul li .news img{
  width: 15px;

}
.page ul li div{
  color:#1A1A1A;
  font-size:15px;
}
</style>
