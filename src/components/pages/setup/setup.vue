<template>
  <div class="setupMainPage" @touchmove.prevent>
    <Header :title="'设置'"></Header>

    <div class="page select-none">
      <ul>
        <li @click="toSecret">
          <span class="item-tit">修改密码</span>
          <span><img src="static/images/dev/go@2x.png"></span>
        </li>
        <!-- <li @click="softwareUpdate">
          <span class="item-tit">软件更新</span>
          <span><img src="static/images/dev/go@2x.png" ></span>
        </li> -->
        <!-- <li @click="newsAlert">
          <span class="item-tit">新消息提醒</span>
          <span><img src="static/images/dev/go@2x.png" ></span>
        </li> -->
        <li @click="toAbout">
          <span class="item-tit">关于我们</span>
          <span><img src="static/images/dev/go@2x.png" ></span>
        </li>
        <li @click="toFeedback">
          <span class="item-tit">意见反馈</span>
          <span><img src="static/images/dev/go@2x.png" ></span>
        </li>
        <!-- <li>
          <span class='tit-dot'></span>
          <span  class="item-tit">清除缓存</span>
          <div>3.87M<img src="static/images/dev/go@2x.png"></div>
        </li> -->
        <li>
          <span  class="item-tit">版&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本</span>
          <div>2.0.2</div>
        </li>
        <li class="changeAmount" @click="changeAmount">
          <span>切换账号</span>
        </li>
        <li class="quit" @click="exit">
          <span>退出登录</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import Header from '../../comps/header/header';

export default {
  name: "",
  data() {
    return {

    };
  },
  components:{
    Header
  },
  methods:{
    softwareUpdate(){
      this.$toast("软件更新")
    },
    newsAlert(){
      this.$toast("新消息提示")
    },
    changeAmount(){
      this.$router.push('/switch-user');
    },
    toAbout(){
      this.$router.push('/about');
    },
    toFeedback(){
      this.$router.push('/feedback');
    },
    toSecret(){
      this.$router.push("/secret");
    },
    exit(){
      MessageBox.confirm('确定退出当前账号?').then(action => {
        // 删除保存的用户
        const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || {})
        delete savedUsers[localStorage.getItem('userId')]
        localStorage.setItem('savedUsers', JSON.stringify(savedUsers))

        let osType = localStorage.osType;
        localStorage.clear();
        sessionStorage.clear();

        this.$emit("indexSelect","搜索")
        var path = "/login";
        if(!!osType){
          path = path+"?osType="+osType;
        }
        this.$router.replace(path);
      }).catch(cancel=>{
        this.$toast("取消退出")
      });
    }
  },
  mounted(){}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.setupMainPage{
  width:100%;
  height:100%;
  display: flex;
  flex-direction: column;
  color: #333333;
  font-family:PingFang-SC-Medium;
  font-size: 15px;
  background-color: #f5f5f5;
}
.page ul{
  display: flex;
  flex-direction: column;
  li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height:55px;
    border-bottom:0.5px solid #f3f3f3;
    background-color: #fff;
    padding: 0px 12px;
    .item-tit{
      margin-right:auto;
      margin-left:5px;
    }
    img{
      height:10.5px;
      width:5.5px;
      margin-left:0.1rem;
    }
  }
  li.changeAmount,li.quit{
    margin-top:10px;
    justify-content: center;
  }
}

.select-none{
  user-select: none;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
}
</style>
