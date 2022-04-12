<template>
  <div class="main" @touchmove.prevent>
    <img class="bg" src="static/images/icon/bg@2x.png">
    <ul>
      <li>
        <input placeholder="请输入账号" v-model="username">
      </li>
      <li>
        <input placeholder="请输入密码" type="password" v-model="password">
      </li>
    </ul>
    <div class="login_btn" @click="login">
      <span>快速</span><span>登录</span>
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
                localStorage.isLogin = 1;
                Toast("登录成功");
                _this.$router.replace("/index");
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
          _this.$router.replace("/index");
        }
      }
  },
  mounted(){
    localStorage.clear();
    this.checkLogin();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.bg{
  margin-top:197.5px;
  height: 101.5px;
  width: 154px;
}
ul{
  width:187px;
  margin-top:36px;
}
li:first-child{
  margin-bottom:30px;
}
li{
  width: 100%;
  padding-bottom:9.5px;
  border-bottom: 1px #CDCDCD solid;
  display: flex;
  align-items: center;
}
input{
  border: none;
  outline: none;
  font-size: 14px;
  width: 83px;
}
li::after{
  width: 4.5px;
  height: 8px;
  content: "";
  background-image: url("/static/images/icon/right@2x.png");
  background-size: cover;
  display: block;
}
.login_btn{
  width: 68.5px;
  height: 68.5px;
  border-radius: 50%;
  background-color: #0EA0B7;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #FEFEFE;
  margin-top: 36.5px;
}
</style>
