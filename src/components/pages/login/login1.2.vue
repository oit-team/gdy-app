<template>
  <div class="main" @touchmove.prevent>
    <div class="page">
      <div>请登录</div>
      <div>PLEASE LOG IN</div>
      <div class="login_info">
        <!-- <img src="static/images/login/shouji@2x.png"> -->
        <input placeholder="请输入账号：" v-model="username">
      </div>
      <div class="login_info">
        <!-- <img src="static/images/login/lock@2x.png"> -->
        <input placeholder="请输入密码：" type="password" v-model="password">
      </div>
      <div class="login_btn" @click="login">登录</div>
      <!-- <div class="login_message">
        <span>注册</span>
        <span>忘记密码?</span>
      </div> -->
      <!-- <div class="login_dirc">
        登录代表您已经同意<span>《高单易隐私政策》</span>
      </div> -->
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
export default {
  name: "login",
  data() {
    return {
      username:"",
      password:""
    };
  },
  methods:{
      login:function(){
          let _this = this;
          if(_this.username.trim() == ""){
            Toast('用户名不能为空');
            return;
          }
          if(_this.password.trim() == ""){
            Toast('密码不能为空');
            return;
          }
          let data = {
            "loginName":_this.username,
            "password":_this.password
          }
          _this.$axios.post("/api/userInfo/login",data)
          .then(function (res){
              let data = res.data;
              if(data.code=="200"){
                localStorage.userId = data.data.id;
                localStorage.brandId = data.data.brandId;
                localStorage.userId = data.data.id;
                localStorage.brandId = data.data.brandId;
                localStorage.userName = data.data.username;
                localStorage.isLogin = 1;
                Toast("登录成功");
                _this.loginLog();
                _this.$router.replace("/index?stamp="+new Date().getTime());
              }else{
                Toast("用户名或密码错误！");
              }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      checkLogin(){
        let _this = this;
        if(localStorage.isLogin!=null && localStorage.isLogin==1){
          localStorage.userId = localStorage.userId;
          localStorage.brandId = localStorage.brandId;
          _this.loginLog();
          _this.$router.replace("/index?stamp="+new Date().getTime());
        }
      },
      loginLog(){
        let _this = this;
        let param={
          userName:!localStorage.userName?"notName":localStorage.userName,
          menu:"loginin",
          userId:localStorage.userId
        }
        console.log(param);
        _this.$axios.post("/api/userInfo/log",param)
        .then(function(res){
          console.log(res);
        })
        .catch(function(err){
          console.log(err);
        });
      }
  },
  mounted(){
    localStorage.clear();
    let param = this.$route.query;
    if(!param.osType){
      Toast("请更新最新版本（支持扫码）!");
    }else{
      localStorage.osType = param.osType;
    }
    this.checkLogin();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input{
  border: none;
  outline: none;

}
.main{
  width: 100%;
  height: 100%;
  position: relative;
}
.page{
  padding: 0 20px 0 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 18px;
}
.page div{
  width: 100%;
}
.page div:nth-child(1){
  margin-top: 105px;
  font-size:26px;
  font-weight:400;
  padding-left:10px;
}
.page div:nth-child(2){
  margin-top:10.5px;
  margin-bottom: 40px;
  font-size:12px;
  font-weight:600;
  padding-left:10px;
}

.login_info{
  border-bottom: 0.5px #EAEAEA solid;
  height: 45px;
  display: flex;
  justify-content: start;
  align-items: center;
  margin-top: 10px;
  padding-left:10px;
}
.login_info img{
  width: 18.5px;
  margin-right: 10.5px;
}
.login_btn{
  background:rgba(34,150,175,1);
  border-radius:3px;
  height:45px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight:400;
  color: #fff;
  cursor: pointer;
  margin-top: 37px;
}
.login_message{
  font-size:14px;
  color:rgba(51,51,51,1);
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.login_dirc{
  font-size: 14px;
  color: #999999;
  text-align: center;
  position: absolute;
  bottom: 25px;
}
.login_dirc span{
  color: #2296AF;
}
</style>
