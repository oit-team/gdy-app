<template>
  <div class="main" @touchmove.prevent>
    <van-icon
        v-if="$route.params.type === 'plus'"
        style="position:absolute; left: 10px; top: 10px;"
        name="cross"
        size="20"
        @click="$router.back()"
    />
    <div class="page">
      <div class="place_holder"></div>
      <div class="logo">
        <img src="static/images/login/logo.png" alt="">
      </div>
      <div class="login_info">
        <img src="static/images/login/user_icon.png">
        <input placeholder="账号" v-model="username" @input="getUserName">
        <img v-if="closeName" class="cancelIcon" src="static/images/icon/cancelIcon.png" alt="" @click="cancelName">
      </div>
      <div class="login_info">
        <img src="static/images/login/paws.png">
        <input placeholder="密码" type="password" v-model="password" @input="getPwd">
        <img v-if="closePwd" class="cancelIcon" src="static/images/icon/cancelIcon.png" alt="" @click="cancelPwd">
      </div>
      <div class="login_btn active" v-if="loginFlag && checked" @click="login">登　录</div>
      <div class="login_btn" v-else >登　录</div>
      <!-- <div class="login_message">
        <span>注册</span>
        <span>忘记密码?</span>
      </div> -->
      <div class="login_dirc flex">
        <van-checkbox v-model="checked" class="mr-2" icon-size="16px"></van-checkbox>已同意高单易<span @click="$router.push('/privacyPolicy')">《隐私协议》</span><span @click="$router.push('/serviceAggrement')">《用户协议》</span>
      </div>
    </div>
  </div>
</template>

<script>
// import { Toast } from 'mint-ui';
import { Toast } from 'vant';
import CryptoJS from '../../../assets/js/CryptoJS';
export default {
  name: "login",
  data() {
    return {
      username:"",
      password:"",
      closeName:false,
      closePwd:false,
      loginFlag:false,
      checked: false,
    };
  },
  created(){

  },
  mounted(){
    let param = this.$route.query;

    if (this.$route.params.type === 'plus') {
      return
    }

    if(this.username)
    // 只有苹果机型传了参数osType,devttoast
    localStorage.clear();

    if(!param.osType){
      Toast("请更新最新版本（支持扫码）!");
    }else{
      localStorage.osType = param.osType;
      localStorage.devt = param.devt;
    }

    this.checkLogin()
  },
  methods:{
    getUserName(){
      this.username = this.username.replace(/\s*/g,"");
      if(this.username){
        this.closeName = true;
      }else{
        this.closeName = false;
      }
      if(this.username && this.password){
        this.loginFlag = true
      }else{
        this.loginFlag = false
      }
    },
    cancelName(){
      this.username = '';
      this.closeName = false;
      this.loginFlag = false;
    },
    getPwd(){
      this.password = this.password.replace(/\s*/g,"");
      if(this.password){
        this.closePwd = true;
      }else{
        this.closePwd = false;
      }
      if(this.username && this.password){
        this.loginFlag = true
      }else{
        this.loginFlag = false
      }
    },
    cancelPwd(){
      this.password = '';
      this.closePwd = false;
      this.loginFlag = false;
    },

    // 解决微信扫描，软键盘弹出后底部有留白问题
    fixScroll() {
      // 移动端关闭虚拟键盘
      document.activeElement.blur();

      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      // console.log(u,isiOS)
      if (isiOS) {
        window.scrollTo(0, 0);
      }

    },
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
      let encryPwd = CryptoJS.encrypt(this.password);

      let data = {
        head: {
          "aid" : localStorage.userId,
          "ver" : "1.0",
          "ln" : "cn",
          "mod" : "app",
          "de" : "2019-10-16",
          "sync" : 1,
          "uuid" : localStorage.brandId,
          "chcode" : "ef19843298ae8f2134f"
        },
        con:{
          userName:_this.username,
          passWord:encryPwd,
        }
      }

      _this.$axios.post("/system/user/login",data)
      .then(function (res){
          let data = res.data;
          console.log("登陆成功返回数据======",data.data)
          if(res.data.head.status==0){
            let result = res.data.body.resultList;
            localStorage.userId = result.id;
            localStorage.brandId = result.brandId;
            localStorage.userId = result.id;
            localStorage.brandId = result.brandId;
            localStorage.isLogin = 1;
            localStorage.headPortrait = result.headPortrait;   // 头像
            localStorage.nickName = result.nickName;   // 用户名（昵称）

            localStorage.userName = result.username;   // （登录时的名称）
            localStorage.sex = result.sex;    // 性别
            localStorage.birth = result.strBirthDate;   // 生日
            localStorage.telePhone = result.telePhone;   // 电话

            localStorage.job = result.job;   // 岗位
            localStorage.hireDate = result.strHireDate;   // 入职时间
            localStorage.autoGraph = result.autoGraph;    // 个性签名
            localStorage.brandIdGDY = "GDY-"+result.brandId;//  考核模块用
            localStorage.accessToken = res.data.body.accessToken;
            localStorage.shopId = result.shopId;  // 报销售 店铺用
            localStorage.orgId = 10000;    //  暂时写死

            // Toast("登录成功");
            Toast.success('登录成功');

            try {
              // 添加用户
              if (_this.$route.params.type === 'plus') {
                const storage = { ...localStorage }
                const savedUsers = JSON.parse(storage.savedUsers) || {}
                delete storage.savedUsers
                savedUsers[storage.userId] = storage
                localStorage.setItem('savedUsers', JSON.stringify(savedUsers))
              }
            } catch(err) {
              localStorage.removeItem('savedUsers')
            }

            _this.$router.replace("/index?stamp="+new Date().getTime());
          }else{
            Toast.fail("用户名或密码错误！");
          }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    // 手机端每次重新进入app时路由path为'/',即为登陆页面
    // 进入后先验证是否有缓存的用户信息,如果有,验证用户信息的有效性
    // 如果没有,页面停留在登录页,可重新进行登陆
    checkLogin(){
      let _this = this;
      // console.log("登录页检查登陆状态");
       console.log('localStorage.isLogin',localStorage.isLogin)
      if(localStorage.isLogin && localStorage.isLogin==1){
        localStorage.userId = localStorage.userId;
        localStorage.brandId = localStorage.brandId;
        _this.validateLoginEffect();
        // _this.$router.replace("/index?stamp="+new Date().getTime());
      }
    },
    // 如果有缓存的用户信息,验证用户信息的有效性的方法
    validateLoginEffect(){
      let _this = this;
      let userId = localStorage.userId;
      let param = {


        "id": userId
      }
      _this.$axios.post("/api/userInfo/checkUserByID",param).then(res=>{
        // console.log("验证用户有效性");
        // console.log(res)
        if(res.data.code == '200'){
          if(res.data.data.static == 0){    //  0  用户存在   1  用户不存在  之后可能会有2,3,4..的情况
            // console.log("static为0,用户存在");
            _this.$router.replace("/index?stamp="+new Date().getTime());
          }else if(res.data.data.static == 1){
            Toast.fail("用户不存在");
          }
        }else{
          Toast.fail("请求失败,请稍后重试!");
        }
      }).catch(err=>{
        Toast.fail("服务超时,请稍后再试!");
      })
    },
  },

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
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border:0.5px solid #fff;
  /* padding: 0 20px 0 20px; */
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 18px;
}
.place_holder{
  height:20%;
}
.logo{
  margin: 0 auto;
  width: 46%;
  text-align: center;
  margin-bottom:10%;
  /* border:0.5px solid #000; */
}
.logo img{
  width: 100%;
}
.login_info{
  width:76%;
  border-bottom: 0.5px #eaeaea solid;
  height: 45px;
  display: flex;
  justify-content: start;
  align-items: center;
  margin-top: 10px;
  padding-left:5px;
  color: #333;
  box-sizing:border-box;
  position: relative;
  /* background-color: pink; */
}
.login_info img{
  width: 18.5px;
  margin-right: 10.5px;
}
.login_info input{
  font-size:16px;
}
input::placeholder{
  color:#999;
}
.login_info .cancelIcon{
  width:16px;
  height:16px;
  position: absolute;
  right:10px;
}
.login_btn{
  width:76%;
  background:#E8F1FE;
  border-radius:24px;
  height:40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight:400;
  color: #fff;
  cursor: pointer;
  margin-top: 37px;
  font-size: 20px;
}
.active{
  background-color: #1978FE;
  color:#fff;
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
