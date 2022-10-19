<template>
  <VueActions id="minePage" @touchmove.prevent data="minePage">
    <div class="mineTopBox" @click="toUserinfo" v-actions:mineBox.click>
      <img class="avatar" :src="headPortrait">
      <div>
        <!-- <div class="occupation">{{nickName}}</div> -->
        <div class="nickName">{{nickName}}</div>
        <div class="userName">用户名：{{amount}}</div>
        <div class="work" v-if="job">职位：{{job}}</div>
      </div>
      <img class="right_icon" src="static/images/icon/rightArrowGrey.png">

    </div>

    <div class="mineList">
      <div class="mineItem" @click="toSetup" v-actions:toSetUp.click>
        <img class="icon_font" src="static/images/icon/setUp1.png" alt="">
        <span class="tit">设置</span>
        <img class="right_icon" src="static/images/icon/rightArrowGrey.png">
      </div>
      <!-- <div class="mineItem" @click="toMyCircle">
        <img class="icon_font" src="static/images/icon/library.png" alt="">
        <span class="tit">工作圈</span>
        <div v-if="noReadNums == 0" ></div>
        <p v-else class="no-read-num" ref="noRead">{{noReadNums}}</p>
        <img class="right_icon" src="static/images/icon/rightArrowGrey.png">
      </div> -->
      <!-- <div class="mineItem">
        <img class="icon_font" src="static/images/icon/libMarket.png" alt="">
        <span class="tit">知识超市</span>
        <img class="right_icon" src="static/images/icon/rightArrowGrey.png">
      </div> -->
    </div>

    <!-- ========分享测试按钮========== -->
    <!-- <div @click="toShare" style="font-size:15px;font-weight:bold;">点击跳转到分享测试页面--hellWord</div> -->
    <!-- ================ -->

  </VueActions>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Toast } from 'mint-ui';

// import wx from 'weixin-js-sdk';

export default {
  name: "mine",
  data() {
    return {
      amount:'',
      headPortrait:'',
      nickName:'',
      job:'',
      noReadNums:this.noReadNum,
      // noReadNums:0,
    };
  },
  props:['noReadNum1'],
  watch: {
    noReadNum1(val) { // 接收父组件传来的参数名
      this.noReadNums = val;
      console.log(val)
      if(val=="99+"){
        this.$refs.noRead.style.fontSize = "5px"
      }
    }
  },
  methods:{
    toShare(){
      this.$router.push({
        path:'/HelloWorld'
      })
    },

    initUserInfo(){
      this.amount = localStorage.userName;
      if(localStorage.getItem("headPortrait") !== "null"){
        this.headPortrait = localStorage.getItem("headPortrait");  //头像
      }else{
        this.headPortrait = '/static/images/default/heder_default.png'
      }

      this.nickName = (localStorage.getItem("nickName") !== 'null' && localStorage.getItem("nickName") != '')?localStorage.getItem("nickName"):'请设置姓名';  //姓名
      this.job = (localStorage.getItem("job") !== 'null' && localStorage.getItem("job") != '')?localStorage.getItem("job"):'';    // 岗位
    },
    toUserinfo(){
      this.$router.push('/userInfo');
    },
    toMyCircle(){
      // this.$emit("changeTip",false)
      // console.log("我的工作圈");
      this.$router.push("/myCircle");
    },
    toSetup(){
      this.$router.push("/setup");
    },
    exit(){
      MessageBox.confirm('确定退出当前账号?').then(action => {
        let osType = localStorage.osType;
        localStorage.clear();
        localStorage.clear();
        this.$emit("indexSelect","搜索")
        this.$router.replace("/login?osType="+osType);
      });
    },
    // 获取未读消息数量
    getnoReadNums(){
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "userId": userid
      }
      // console.log(data)
      _this.$axios.post("/api/noticeInfo/notReadNum",data)
      .then(function (res){
        // console.log("未读消息为:",res.data)
        if(res.data.code == 200){
          // _this.noReadNums = 5;
          _this.noReadNums = res.data.data;
          // console.log(_this.noReadNums);
          if(_this.noReadNums == 0){
            _this.$emit("changeTip",false)
            // console.log("?????????????changeTip",false)
          }
          if(_this.noReadNums > 99 ){
            // console.log("ououoiuoiuoi")
            _this.noReadNums = "99+";
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        Toast("请求失败！");
      });
    }
  },

  created(){},
  mounted(){},
  activated(){
    this.initUserInfo();
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../../assets/pageCss/mine";



</style>
