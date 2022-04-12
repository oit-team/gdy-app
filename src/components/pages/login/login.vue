<template>
    <div class="body" @touchmove.prevent>
        <div class="welcome"><img src="./images/welcome.png" @click="login()"></div>
        <div class="login-form">
            <form>
              <div class="login-inp"><label>登录</label><input id="username" type="text" placeholder="" v-model="username"></div>
              <div class="login-inp"><label>密码</label><input id="password" type="password" placeholder="" v-model="password"></div>
              <div class="login-inp"><a href="#" id="loginBtn" @click="login()">立即登录</a></div>
            </form>
        </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
export default {
  name: "",
  data() {
    return {
      username:"admin2",
      password:"123456"
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
                Toast("登录成功");
                _this.$router.replace("/index");
              }else{
                Toast("用户名或密码错误！");
              }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
  },
  mounted(){

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-image: url("images/login-bg.png");
  position: fixed;
  /* z-index: -10; */
}
.login_container {
  width: 70%;
  margin-left: 15%;
}
.welcome {
  width: 100%;
  margin: 25% 0;
}
.welcome img {
  width: 100%;
}
.login-inp {
  margin: 0 15px 7.5px 15px;
  border: 0.5px solid #fff;
  border-radius: 12.5px;
  font-size:0.35rem;
}
.login-inp label {
  width: 4em;
  text-align: center;
  display: inline-block;
  color: #fff;
}
.login-inp input {
  line-height: 1.5rem;
  color: #fff;
  background-color: transparent;
  border: none;
  outline: none;
}
.login-inp a {
  display: block;
  width: 100%;
  text-align: center;
  line-height: 1.5rem;
  color: #fff;
  font-size: 0.45rem;
  letter-spacing: 2.5px;
}
.login-txt {
  text-align: center;
  color: #fff;
}
.login-txt a {
  color: #fff;
  padding: 0 2.5px;
}
</style>
