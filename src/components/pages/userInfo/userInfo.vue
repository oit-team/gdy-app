<template>
  <div class="userinfo-wrap">
    <Header :title="'个人信息'"></Header>

    <div class="userInfoPage" ref="userInfoPage">
      <div>
        <div class="box-li">
          <div class="box-left avatar-name">账号头像</div>
          <div class="box-right avatar-box">
            <img class="photo"  :src="headPortrait" alt="">
            <input type="file" class="avatarFile" accept="image/*" name="image" @change="handleInputChange">
          </div>
        </div>
        <div class="box-li" @click="updateUserInfo">
          <div class="box-left">真实姓名</div>
          <input class="box-right ipt-box" type="text" readonly v-model="nickName" placeholder="请输入真实姓名">
          <img class="more-icon" src="static/images/icon/more-right.png" alt="">
        </div>
        <div class="box-li" @click="updateSex">
          <div class="box-left">性别</div>
          <div class="box-right">
            <span v-if="radio == 0">男</span>
            <span v-if="radio == 1">女</span>
          </div>
          <img class="more-icon" src="static/images/icon/more-right.png" alt="">
        </div>

        <div class="box-li" @click="showDatePicker('birthday')">
          <div class="box-left">生日</div>
          <input class="box-right ipt-box" readonly ref="birthday" type="text" v-model="birthday" placeholder="请选择出生年月">
          <img class="more-icon" src="static/images/icon/more-right.png" alt="">
        </div>
         <div class="box-li" @click="updatePhone">
          <div class="box-left">电话</div>
          <input class="box-right ipt-box" type="text" readonly v-model="telePhone" placeholder="请输入电话">
          <img class="more-icon" src="static/images/icon/more-right.png" alt="">
        </div>
        <div class="box-li" @click="updateWork">
          <div class="box-left">岗位</div>
          <input class="box-right ipt-box" type="text" readonly v-model="job" placeholder="请输入岗位">
          <img class="more-icon" src="static/images/icon/more-right.png" alt="">
        </div>
        <div class="box-li"  @click="showDatePicker('entry')" >
          <div class="box-left">入职时间</div>
          <input class="box-right ipt-box" readonly ref="entry" type="text" v-model="entryTime" placeholder="请选择入职时间">
          <img class="more-icon" src="static/images/icon/more-right.png" alt="">
        </div>
        <div class="box-li"  @click="updateSign">
          <div class="box-left">个性签名</div>
          <input class="box-right ipt-box" type="text" readonly v-model="signLabel" placeholder="留下点什么...">
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
  </div>
</template>

<script>
import Header from '../../comps/header/header.vue';
import { Toast } from 'mint-ui';

export default {
  name: "",
  components:{Header:Header},
  data() {
    return {
      title:'个人信息',
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
      telePhone:'',
      birthday:'',  // 生日
      job:'',    // 岗位
      entryTime:'',   // 入职时间
      signLabel:'',   // 个人签名

      isIosFlag:false,
      //fileList: [],
      imgStr:'',

      entry_day :'',
      birth_day : '',

    };
  },
  activated(){
    this.initUserInfo()
  },
  created(){

  },
  mounted(){
    this.initUserInfoScroll();
    this.isIos();
  },
  updated(){

  },
  methods:{
    // 更新头像和性别
    updateInfos(){
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "userId": userid,
        "headPortrait": _this.imgStr,     // 头像
        "sex":_this.radio,                 // 性别
        "hireDate":_this.entry_day,
        "birthDate":_this.birth_day,
      }
      _this.$axios.post("/api/userInfo/upUserInfo",data)
      .then(function (res){
          let data = res.data;
          if(data.code=="200"){
            Toast("修改成功");
            // 上传成功需要重置头像的src
            localStorage.headPortrait = data.data.headPortrait;
            localStorage.sex = _this.radio;   // 生日
            _this.headPortrait = data.data.headPortrait;
            _this.radio = _this.radio;
          }else{
            Toast("修改失败！");
          }
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    // 处理头像上传
    handleInputChange(e){
      // console.log(e)
      var file = e.target.files[0]
      // console.log(file)
      // 获取图片的大小，做大小限制有用
      let imgSize = file.size
      // console.log("上传头像大小",imgSize)
      var _this = this // this指向问题，所以在外面先定义
      var isFlag = (file.type == 'image/jpeg' || file.type == 'image/png')? true : false;
      if(!isFlag){
        Toast("上传图片只能是 JPG、PNG 格式!");
        return false
      }
      // 图片大于800kb时进行压缩，这里获取的大小单位是b
      if (imgSize >= 800 * 1024) {  //   1M = 1024*1024
        // 合格
        // console.log('大小合适')
        // 开始渲染选择的图片
        // 本地路径方法 1
        // this.imgStr = window.URL.createObjectURL(e.target.files[0])
        // console.log(window.URL.createObjectURL(e.target.files[0])) // 获取当前文件的信息

        // base64方法 2
        var reader = new FileReader()
        reader.readAsDataURL(file) // 读出 base64
        reader.onloadend = function () {

          // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
          var dataURL = reader.result
          _this.imageCompress(dataURL).then(res=>{
            // console.log(res);
            _this.imgStr = res;    // res 压缩图片后的base64地址
            // 下面逻辑处理
            _this.updateInfos();
          })
        }
      }else{
        var reader = new FileReader()
        reader.readAsDataURL(file) // 读出 base64
        reader.onloadend = function () {
          // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
          var dataURL = reader.result
          // console.log(dataURL)
          _this.imgStr = dataURL;
          _this.updateInfos();
        }
      }
    },
    // 压缩图片
    imageCompress(base64) {
      let Img = new Image(),
          dataURL = '';
          Img.src = base64;
      let p = new Promise(function (resolve, reject) {
        Img.onload = function () { //要先确保图片完整获取到，这是个异步事件
          let canvas = document.createElement("canvas"), //创建canvas元素
            width = Img.width, //确保canvas的尺寸和图片一样
            height = Img.height;
          // 默认将长宽设置为图片的原始长宽，这样在长宽不超过最大长度时就不需要再处理
          let ratio = width / height,
            maxLength = 1000,
            newHeight = height,
            newWidth = width;
          // 在长宽超过最大长度时，按图片长宽比例等比缩小
          if (width > maxLength || height > maxLength) {
            if (width > height) {
              newWidth = maxLength;
              newHeight = maxLength / ratio;
            } else {
              newWidth = maxLength * ratio;
              newHeight = maxLength;
            }
          };
          canvas.width = newWidth;
          canvas.height = newHeight;
          canvas.getContext("2d").drawImage(Img, 0, 0, newWidth, newHeight); //将图片绘制到canvas中
          dataURL = canvas.toDataURL('image/jpeg', 0.3); //转换图片为dataURL
          resolve(dataURL);
        };
      });
      // console.log("============p",p,)
      p.then(res=>{
        // console.log(res)
      })
      return p
    },
    // 判断是否是ios机型
    isIos(){
      var ua = navigator.userAgent.toLowerCase();//获取浏览器的userAgent,并转化为小写——注：userAgent是用户可以修改的
      var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);//判断是否是苹果手机，是则是true
      if (isIos) {
        this.isIosFlag = true;
      }
    },
    // 初始化Bscroll
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
            useTransition:false,
          });
          // console.log(_this.userInfoPage)
        }else{
          _this.userInfoPage.refresh();
        }
      })
    },
    // 上传图片前仅限校验
    beforeRead(file) {
       //console.log(file.type)
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        Toast('请上传 jpg或png 格式图片');
        return false;
      }

      return true;
    },
    //上传图片后触发
    onRead(file){
      let _this = this;
      _this.$refs.headerImg.src = file.content;
      _this.imgStr = _this.$refs.headerImg.src;
      _this.updateInfos();
    },
    // 初始化用户信息
    initUserInfo(){
      // console.log("初始化获取用户信息");
      let userid = localStorage.getItem("userId");
      if(localStorage.getItem("headPortrait") !== "null"){
        this.headPortrait = localStorage.getItem("headPortrait");  //头像
      }else{
        this.headPortrait = '/static/images/default/heder_default.png'
      }
      this.nickName = (localStorage.getItem("nickName") !== 'null' && (localStorage.getItem("nickName")!=''))?localStorage.getItem("nickName"):'';  //姓名
      this.birthday = (localStorage.getItem("birth") !== 'null')?localStorage.getItem("birth"):'';  // 生日
      this.telePhone = (localStorage.getItem("telePhone") !== 'null' && (localStorage.getItem("telePhone")!=''))?localStorage.getItem("telePhone"):'';  //姓名
      this.job = (localStorage.getItem("job") !== 'null' && (localStorage.getItem("job")!=''))?localStorage.getItem("job"):'';    // 岗位
      this.entryTime = localStorage.getItem("hireDate") !== 'null'?localStorage.getItem("hireDate"):'';   // 入职时间
      this.signLabel = (localStorage.getItem("autoGraph") !== 'null' && (localStorage.getItem("autoGraph")!=''))?localStorage.getItem("autoGraph"):'';   // 个人签名
      if(localStorage.getItem("sex")!== 'null'){
        this.radio = localStorage.getItem("sex")
      }else{
        this.radio = '0'
      }
    },
    // 确认性别
    comfirmSex(){
      let _this = this;
      let userid = localStorage.getItem("userId");
      _this.updateInfos();
    },
    // 跳转到用户名、职位、个人签名
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
    updatePhone(){
      this.$router.push({
        path:'/updateInfo',
        query:{
          prePage:"telePhone",
          nickName:this.telePhone,
        }
      });
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
    // 显示时间组件
    showDatePicker(picker) { //弹出层并显示时间选择器
        this.isPopShow = true;
        this.datePicker = picker;
    },
    cancelPicker() { // 选择器取消按钮点击事件
        this.isPopShow = false;
        this.datePicker = "";
    },
    // 更新生日
    confirmBirthPicker(value){
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
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "userId": userid,
        "birthDate":timer,
      }
      _this.$axios.post("/api/userInfo/upUserInfo",data)
      .then(function (res){
          let data = res.data;
          if(data.code=="200"){
            Toast("保存成功");
            localStorage.birth = timer;   // 生日
            _this.birthday = timer;
            _this.isPopShow = false;
          }else{
            Toast("保存失败！");
            _this.isPopShow = false;
          }
      })
      .catch(function (error) {
        console.log(error);
      });
      // this.$refs[this.datePicker].innerHTML = timer;
      // this.isPopShow = false;
      this.datePicker = "";
    },
    // 更新入职时间
    confirmEntryPicker(value){
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
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "userId": userid,
        "hireDate":timer,
      }
      _this.$axios.post("/api/userInfo/upUserInfo",data)
      .then(function (res){
          let data = res.data;
          if(data.code=="200"){
            Toast("保存成功");
            localStorage.hireDate = timer;   // 生日
            _this.entryTime = timer;
            _this.isPopShow = false;
          }else{
            Toast("保存失败！");
            _this.isPopShow = false;
          }
      })
      .catch(function (error) {
        console.log(error);
      });
      // this.$refs[this.datePicker].innerHTML = timer;
      // this.isPopShow = false;
      this.datePicker = "";
    },

    // 时间组件内容格式化
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
@import "../../.../../../assets/pageCss/userinfo1";

</style>
