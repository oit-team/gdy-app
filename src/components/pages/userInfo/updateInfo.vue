<template>
  <VueActions id="updateUserInfo" data="userInfo">
    <!-- <Header :title="titleLabel"></Header> -->
    <div class='header'>
      <div @click="back"><img src="static/images/dev/back@2x.png" ></div>
      <span v-if="prepage == 'nickName'">修改真实姓名</span>
      <span v-if="prepage == 'job'">修改岗位</span>
      <span v-if="prepage == 'sign'">修改签名</span>
      <span v-if="prepage == 'telePhone'">修改电话</span>
      <span class="right" @click="updateInfo" v-actions:userInfo.click>确定</span>
    </div>

    <div v-if="prepage == 'nickName'" class="update-con">
      <input class="ipt" type="text" placeholder="请输入名字" v-model="nickName" >
      <div class="tip">好名字更容易让朋友记住你哦</div>
    </div>
    <div v-if="prepage == 'telePhone'" class="update-con">
      <input class="ipt" type="text" placeholder="请输入电话" v-model="telePhone" >
      <div class="tip">请注意电话格式哦</div>
    </div>

    <div v-if="prepage == 'job'" class="update-con">
      <input class="ipt" type="text" placeholder="请输入岗位" v-model="job">
    </div>

    <div v-if="prepage == 'sign'" class="update-con">
      <input class="ipt" type="text" placeholder="留下点什么..." v-model="sign" >
      <!-- <textarea class="textarea-box" name="" id=""  placeholder="留下点什么..." v-model="sign" @blur="validSign"></textarea> -->
      <div class="tip">好签名更能彰显你的个人特色哦</div>
    </div>


  </VueActions>
</template>
<script>
import Header from '../../comps/header/header';
import { Toast } from 'mint-ui';
export default {
  name:"updateUserInfo",
  components:{Header},
  data(){
    return{
      titleLabel:"用户名",
      prepage:"nickName",
      nickName:"",
      telePhone:'',
      job:"",
      sign:"",

    }
  },
  methods:{
    initUserInfo(){
      // console.log("更新用户信息时初始化用户信息");
      this.nickName = localStorage.getItem("nickName")!=="null"?localStorage.getItem("nickName"):'';  //昵称
      this.job = localStorage.getItem("job") !== 'null'?localStorage.getItem("job"):'';    // 岗位
      this.sign = localStorage.getItem("autoGraph") !== 'null'?localStorage.getItem("autoGraph"):'';   // 个人签名  // 个人签名
      this.telePhone = localStorage.getItem("telePhone") !== 'null'?localStorage.getItem("telePhone"):'';    // 岗位

    },

    updateInfo(){
      let _this = this;
      if(this.prepage == "nickName" && this.nickName.length>10){
        Toast("最多10个汉字哦");
      }else if(this.prepage == "job" && this.job.length>10){
        Toast("最多10个汉字哦");
      }else if(this.prepage == "sign" && this.sign.length>20){
        Toast("最多20个汉字哦");
      }else if(this.prepage == "telePhone"){
        // 校验电话号码格式
        var reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
        if(this.telePhone == "" ) {
          // Toast("手机号为空!");
          this.updateInfoRequest()
        } else
        if (!reg.test(this.telePhone)) {
          Toast("手机格式不正确！");
        }else{
          this.updateInfoRequest()
        }
      }else{
        this.updateInfoRequest()
      }
    },
    back(){
      this.$router.go(-1);
    },
    updateInfoRequest(){
      // console.log("点击更改信息保存按钮")
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "userId": userid,
        "nickName":this.nickName,
        "job":this.job,
        "autoGraph":this.sign,
        "telePhone":this.telePhone,

      }
      _this.$axios.post("/api/userInfo/upUserInfo",data)
      .then(function (res){
          let data = res.data;
          // console.log(data)
          if(data.code=="200"){
            Toast("保存成功");
            localStorage.nickName = _this.nickName;   // 用户名
            localStorage.job = _this.job;   // 工作
            localStorage.autoGraph = _this.sign;   // 签名
            localStorage.telePhone = _this.telePhone;   // 电话
            _this.$router.go(-1);
          }else{
            Toast("保存失败！");
          }
      })
      .catch(function (error) {
        console.log(error);
      });
    },


  },
  created(){
    this.prepage = this.$route.query.prePage;
    if(this.prepage == "nickName"){
      this.titleLabel = "更改用户名";
    }else if(this.prepage == "job"){
      this.titleLabel = "更改岗位";
    }else if(this.prepage == "telePhone"){
      this.titleLabel = "更改电话";
    }else if(this.prepage == "sign"){
      this.titleLabel = "更改个人签名";
    }
    this.nickName = this.$route.query.nickName;
    this.job = this.$route.query.job;
    this.sign = this.$route.query.sign;
    this.telePhone = this.$route.query.telePhone;
  },
  activated(){
    this.initUserInfo()
  }

}
</script>
<style scoped lang="less">
@import "../../../assets/css/commom.css";
#updateUserInfo{
  width:100%;
  background-color: #f5f5f5;
}
.update-con{
  width:100%;
  padding:12px 12px;
  background-color: #fff;
  box-sizing: border-box;
  // background-color: pink;
}
.update-con .ipt{
  width:100%;
  height:50px;
  line-height: 50px;
  font-size:16px;
  padding-left:4px;
  border:none;
  border-bottom:0.5px solid #ccc;
}
.update-con .tip{
  margin-top:13px;
  padding-left:8px;
  font-size:14px;
  color:#808080;
}
.save-btn{
  width:60px;
  height:35px;
  margin:0 auto;
  line-height: 35px;
  background-color: #00A2EA;
  color:#fff;
  font-size:14px;
  text-align: center;
  margin-top:25px;
  border-radius:5px;
}
.textarea-box{
  width:100%;
  border:none;
  border-bottom:0.5px solid #ccc;
}

</style>
