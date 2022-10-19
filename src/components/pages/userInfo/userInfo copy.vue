<template>
  <VueActions class="userinfo-wrap" data="updateUser">
    <Header :title="'个人资料'"></Header>

    <div class="userInfoPage" ref="userInfoPage">
      <div>
        <div class="box-li">
          <div class="box-left">
            <div class="dot"></div>我的头像
          </div>
          <div class="box-right">
            <van-uploader :max-count="1" :preview-full-image="false" :deletable="true" :before-read="beforeRead" :after-read="onRead">
              <img class="photo" ref="headerImg" :src="headPortrait" alt="">
            </van-uploader>
          </div>
        </div>
        <div class="box-li" @click="updateUserInfo" v-actions:updateName.click>
          <div class="box-left">
            <div class="dot"></div>昵称
          </div>
          <div class="box-right nick-name-box">
            {{nickName}}
          </div>
          <img class="more-icon" src="static/images/icon/more-right.png" alt="">
        </div>
        <div class="box-li" @click="updateSex" v-actions:updateSex.click>
          <div class="box-left">
            <div class="dot"></div>性别
          </div>
          <div class="box-right">
            <span v-if="radio == 0">男</span>
            <span v-if="radio == 1">女</span>
          </div>
          <img class="more-icon" src="static/images/icon/more-right.png" alt="">
        </div>

        <div class="box-li">
          <div class="box-left">
            <div class="dot"></div>生日
          </div>
          <div class="box-right" @click="showDatePicker('birthday')" v-actions:updateBirth.click ref="birthday">
            {{birthday}}
          </div>
          <img class="more-icon" src="static/images/icon/more-right.png" alt="">
        </div>
        <div class="box-li" @click="updateWork" v-actions:updateWork.click>
          <div class="box-left">
            <div class="dot"></div>岗位
          </div>
          <div class="box-right job-box">
            {{job}}
          </div>
          <img class="more-icon" src="static/images/icon/more-right.png" alt="">
        </div>
        <div class="box-li">
          <div class="box-left">
            <div class="dot"></div>入职时间
          </div>
          <div class="box-right" @click="showDatePicker('entry')" ref="entry" v-actions:updateJoinWork.click>
          {{entryTime}}
          </div>
          <img class="more-icon" src="static/images/icon/more-right.png" alt="">
        </div>
        <div class="box-li"  @click="updateSign" v-actions:sign.click>
          <div class="box-left">
            <div class="dot"></div>个性签名
          </div>
          <div class="box-right sign-box">
            {{signLabel}}
          </div>
          <img class="more-icon" src="static/images/icon/more-right.png" alt="">
        </div>
      </div>
    </div>

    <van-dialog v-model="sexShow" @confirm="comfirmSex">
      <el-radio v-model="radio" label="0">男</el-radio>
      <el-radio v-model="radio" label="1">女</el-radio>
    </van-dialog>
    <van-popup v-model="isPopShow" label="" position="bottom" :overlay="true">
        <van-datetime-picker
          v-if="datePicker==='birthday'"
          v-model="currentDate"
          type="date"
          :min-date="birMiniData"
          :max-date="birMaxDate"
          @cancel="cancelPicker"
          @confirm="confirmBirthPicker"
          :formatter="formatter"
        />
        <van-datetime-picker
          v-if="datePicker==='entry'"
          v-model="currentDate"
          type="date"
          :min-date="workMiniData"
          :max-date="workMaxDate"
          @cancel="cancelPicker"
          @confirm="confirmEntryPicker"
          :formatter="formatter"
        />
    </van-popup>
  </VueActions>
</template>

<script>
import Header from '../../comps/header/header.vue';
import { Toast } from 'mint-ui';

export default {
  name: "",
  components:{Header:Header},
  data() {
    return {
      title:'个人资料',
      currentDate: new Date(),
      isPopShow:false,// 弹出层隐藏与显示
      datePicker: '',// 用于判断哪个选择器的显示与隐藏
      birMiniData: new Date(1960,1,1),
      birMaxDate: new Date(),

      workMiniData:new Date(1990,1,1),
      workMaxDate: new Date(),

      // fileList: [{url:'/static/images/default/heder_default.png'}],  //头像
      headPortrait:'',
      nickName:"",  //姓名
      sexShow:false,
      radio:'0',   // 性别
      birthday:'',  // 生日
      job:'',    // 岗位
      entryTime:'',   // 入职时间
      signLabel:'',   // 个人签名

    };
  },
  activated(){
    this.initUserInfo()
  },
  created(){

  },
  mounted(){
    this.initUserInfoScroll();
  },
  updated(){

  },
  methods:{
    initUserInfoScroll(){
      let _this = this;
      _this.$nextTick(()=>{
        //整体搭配列表滚动
        if(!_this.userInfoPage){
          // debugger
          _this.userInfoPage = new _this.$BScroll(_this.$refs.userInfoPage,{
            scrollX:false,
            click:true,
            scrollY:true,
          });
          // console.log(_this.userInfoPage)
        }else{
          _this.userInfoPage.refresh();
        }
      })
    },
    // 上传图片前仅限校验
    beforeRead(file) {
      // console.log(file.type)
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        Toast('请上传 jpg或png 格式图片');
        return false;
      }

      return true;
    },
    onRead(file){//上传图片后触发
      let _this = this;
      // console.log(file)
      _this.$refs.headerImg.src = file.content;
      let userid = localStorage.getItem("userId");
      let data = {
        "userId": userid,
        "headPortrait": _this.$refs.headerImg.src
      }
      // console.log(data)
      _this.$axios.post("/api/userInfo/upUserInfo",data)
      .then(function (res){
          let data = res.data;
          if(data.code=="200"){
            Toast("上传成功");
            // 上传成功需要重置头像的src
            localStorage.headPortrait = data.data.headPortrait;

          }else{
            Toast("上传失败！");
          }
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    initUserInfo(){
      // console.log("初始化获取用户信息");
      let userid = localStorage.getItem("userId");

      if(localStorage.getItem("headPortrait") !== "null"){
        this.headPortrait = localStorage.getItem("headPortrait");  //头像
      }else{
        this.headPortrait = '/static/images/default/heder_default.png'
      }
      this.nickName = (localStorage.getItem("nickName") !== 'null' && (localStorage.getItem("nickName")!=''))?localStorage.getItem("nickName"):'请输入昵称';  //姓名
      this.birthday = (localStorage.getItem("birth") !== 'null')?localStorage.getItem("birth"):'请选择出生年月';  // 生日
      this.job = (localStorage.getItem("job") !== 'null' && (localStorage.getItem("job")!=''))?localStorage.getItem("job"):'请输入岗位';    // 岗位
      this.entryTime = localStorage.getItem("hireDate") !== 'null'?localStorage.getItem("hireDate"):'请选择入职时间';   // 入职时间
      this.signLabel = (localStorage.getItem("autoGraph") !== 'null' && (localStorage.getItem("autoGraph")!=''))?localStorage.getItem("autoGraph"):'留下点什么...';   // 个人签名
      if(localStorage.getItem("sex")!== 'null'){
        this.radio = localStorage.getItem("sex")
      }else{
        this.radio = '0'
      }
    },
    comfirmSex(){
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "userId": userid,
        "sex":this.radio
      }
      _this.$axios.post("/api/userInfo/upUserInfo",data)
      .then(function (res){
          let data = res.data;
          if(data.code=="200"){
            // console.log(data)
            Toast("保存成功");
            localStorage.sex = _this.radio;   // 生日
          }else{
            Toast("保存失败！");
          }
      })
      .catch(function (error) {
        console.log(error);
      });

    },
    updateUserInfo(){
      this.$router.push({
        path:'/updateInfo',
        query:{
          prePage:"nickName",
          nickName:this.nickName,
        }
      });
    },
    updateSex(){
      this.sexShow = true
    },
    updateWork(){
      this.$router.push({
        path:'/updateInfo',
        query:{
          prePage:"job",
          job:this.job,
        }
      });
    },
    updateSign(){
      this.$router.push({
        path:'/updateInfo',
        query:{
          prePage:"sign",
          sign:this.signLabel
        }
      });
    },
    showDatePicker(picker) { //弹出层并显示时间选择器
        this.isPopShow = true;
        this.datePicker = picker;
    },
    cancelPicker() { // 选择器取消按钮点击事件
        this.isPopShow = false;
        this.datePicker = "";
    },
    confirmBirthPicker(value){
      // console.log("birth===============")
      var date = value;
      var m = date.getMonth() + 1;
      var d = date.getDate();
      if (m >= 1 && m <= 9) {
          m = "0" + m;
      }
      if (d >= 0 && d <= 9) {
          d = "0" + d;
      }
      var timer = `${date.getFullYear()}-${m}-${d}`
      // console.log(timer)
      let _this = this;
      // console.log("点击确认生日按钮");
      let userid = localStorage.getItem("userId");
      let data = {
        "userId": userid,
        "birthDate":timer,
      }
      // console.log(data)
      _this.$axios.post("/api/userInfo/upUserInfo",data)
      .then(function (res){
          let data = res.data;
          // console.log(data)
          if(data.code=="200"){
            Toast("保存成功");
            localStorage.birth = timer;   // 生日
            // console.log(localStorage.birth)

          }else{
            Toast("保存失败！");
          }
      })
      .catch(function (error) {
        console.log(error);
      });

      this.$refs[this.datePicker].innerHTML = timer;
      this.isPopShow = false;
      this.datePicker = "";
    },
    confirmEntryPicker(value){
      // console.log("Entry===============")
      var date = value;
      var m = date.getMonth() + 1;
      var d = date.getDate();
      if (m >= 1 && m <= 9) {
          m = "0" + m;
      }
      if (d >= 0 && d <= 9) {
          d = "0" + d;
      }
      var timer = `${date.getFullYear()}-${m}-${d}`
      // console.log(timer)
      let _this = this;
      // console.log("点击确认生日按钮");
      let userid = localStorage.getItem("userId");
      let data = {
        "userId": userid,
        "hireDate":timer,
      }
      // console.log(data)
      _this.$axios.post("/api/userInfo/upUserInfo",data)
      .then(function (res){
          let data = res.data;
          // console.log(data)
          if(data.code=="200"){
            Toast("保存成功");
            localStorage.hireDate = timer;   // 生日
            // console.log(localStorage.hireDate)
          }else{
            Toast("保存失败！");
          }
      })
      .catch(function (error) {
        console.log(error);
      });
      this.$refs[this.datePicker].innerHTML = timer;
      this.isPopShow = false;
      this.datePicker = "";
    },
    // confirmPicker(value) {// 确定按钮，时间格式化并显示在页面上
    //     var date = value;
    //     var m = date.getMonth() + 1;
    //     var d = date.getDate();
    //     if (m >= 1 && m <= 9) {
    //         m = "0" + m;
    //     }
    //     if (d >= 0 && d <= 9) {
    //         d = "0" + d;
    //     }
    //     var timer = `${date.getFullYear()}年${m}月${d}日`
    //     // console.log(timer)
    //     this.$refs[this.datePicker].innerHTML = timer;
    //     this.isPopShow = false;console.log()
    //     this.datePicker = "";
    // },

    formatter(type, value) {// 格式化选择器日期
      // console.log(type,value)
        if (type === "year") {
            return `${value}年`;
        } else if (type === "month") {
            return `${value}月`;
        }else if (type === "day") {
            return `${value}日`;
        }
        return value;
    },


  },

};
</script>
<style scoped lang="less">
@import "../../.../../../assets/pageCss/userinfo";

</style>
