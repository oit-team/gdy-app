<template>
    <div class="mainApp">
      <div class="body">
        <div v-if="selected=='商品'" class="header">
          <search  type="0"></search>
        </div>

        <div ref="middle" class="middle">
          <mt-tab-container v-model="selected">
            <mt-tab-container-item id="主页">
              <keep-alive>
                <searchIndex ref="searchIndex" v-if="selected === '主页'"></searchIndex>
              </keep-alive>
            </mt-tab-container-item>
            <mt-tab-container-item id="商品">
              <keep-alive>
                <goods ref="goods" v-if="selected === '商品'"></goods>
              </keep-alive>
            </mt-tab-container-item>
            <mt-tab-container-item id="视频">
              <keep-alive>
                <VideoList ref="videoList" v-if="selected === '视频'"></VideoList>
              </keep-alive>
            </mt-tab-container-item>
            <mt-tab-container-item id="工作">
              <keep-alive>
                <workIndex @changeTip="changeTipFlag" v-if="selected === '工作'"></workIndex>
              </keep-alive>
              <!-- <collocation ref="collocation"></collocation> -->
            </mt-tab-container-item>
            <mt-tab-container-item id="我的">
            <!-- <Main ref="main" :noReadNum1="noReadNum" @indexSelect="changeSelected" @changeTip="changeTipFlag"></Main> -->
              <keep-alive>
                <Main ref="main" :noReadNum1="noReadNum" @indexSelect="changeSelected"  v-if="selected === '我的'"></Main>
              </keep-alive>
            </mt-tab-container-item>
          </mt-tab-container>
        </div>
      </div>
      <div class="bottom">
        <mt-tabbar v-model="selected">
          <mt-tab-item id="主页" class="homeTab">
            <img slot="icon" class="search_index_icon" :src="selected=='主页'?'static/images/tabbarIcon/home-active.png':'static/images/tabbarIcon/home-grey.png'">
            <!-- <span>主页</span> -->
          </mt-tab-item>
          <mt-tab-item id="商品">
            <img slot="icon" :src="selected=='商品'?'static/images/tabbarIcon/goods-active.png':'static/images/tabbarIcon/goods-grey.png'">
            <span>商品</span>
          </mt-tab-item>
          <mt-tab-item id="视频">
            <img slot="icon" :src="selected=='视频'?'static/images/tabbarIcon/video-active.png':'static/images/tabbarIcon/video.png'">
            <span>视频</span>
          </mt-tab-item>
          <mt-tab-item id="工作">
            <img slot="icon" :src="selected=='工作'?'static/images/tabbarIcon/operation-active.png':'static/images/tabbarIcon/operation-grey.png'">
            <span>工作</span>
            <span v-if="newsTipFlag" class="news_tip"></span>
          </mt-tab-item>
          <mt-tab-item id="我的">
            <img slot="icon" :src="selected=='我的'?'static/images/tabbarIcon/mine-active1.png':'static/images/tabbarIcon/mine-grey.png'">
            <span>我的</span>
          </mt-tab-item>
        </mt-tabbar>
      </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
import goods from "../../comps/goods/goods1.1"
import collocation from "../../comps/collocation/collocation1.1"
import workIndex from "../../pages/workGroup/workIndex"
import { Dialog } from 'vant';
// workIndex
import search from "../../comps/search/search"
import searchIndex from "../../comps/searchIndex/searchIndex"
import Main from "../main/main.vue"
import VideoList from '../../../views/Video/List.vue';

export default {
  name: "",
  data() {
    return {
      selected: "主页",
      active:0,
      tabIcons:[],

      noReadNum:0,   // 未读消息个数
      newsTipFlag:false,

      oldCode:null,

    };
  },
  components:{
    collocation,
    goods,
    search,
    Main,
    searchIndex,
    workIndex,
    VideoList,
  },
  created(){
    this.clickMine()
  },
  mounted() {
    let _this = this;
    if(!localStorage.indexSelected){
    }else{
      // _this.selected = localStorage.indexSelected;
    }
    window.callCodeJsFunction = this.getCode;


  },
  activated(){
    if (this.$route.params.selected) {
      this.selected = this.$route.params.selected
    }
  },
  watch:{
    selected:function(newV,oldV){
      let _this = this;
      // console.log('index==监听底部tabbar的变化值==',newV,oldV);
      localStorage.indexSelected = newV;
      // 测试获取设备code调取原生方法
      if(localStorage.osType=="IOS"){
        window.webkit.messageHandlers.JsCallObjectC.postMessage('{"methodName":"getDeviceCode"}');
      }else if(localStorage.osType=="ANDROID"){
        window.JsCallObjectC.postMessage('{"methodName":"getDeviceCode"}')
      }

      // setTimeout(()=>{
      //   if(!this.oldCode){
      //     Dialog.confirm({
      //       title: '新版本提示',
      //       showConfirmButton:false,
      //       showCancelButton:false,
      //       message: '当前应用非最新版本,为不影响使用,请前往应用商店下载最新版本',
      //     })
      //   }
      // },10000)

    },
  },
  deactivated(){
    // console.log("退出index页面时调用")
  },
  destroyed() {
    // console.log("销毁----destory===========")
  },
  methods: {
    getCode(code){
      // console.log("调用原生方法获取到的code=============",code);
      if(code){
        this.oldCode = code;
      }
      if(this.oldCode){
        let _this = this;
        let param={
          userId:localStorage.userId,
          deviceCode:_this.oldCode,
          deviceType:localStorage.osType
        }
        _this.$axios.post("/api/userInfo/checkUserDevice",param).then(function(res){
          // console.log("原生code调后台接口====",res);
          if(res.data.code == '200'){
            // 该咋咋
          }else{
            // 当前账号被顶掉了
            Dialog.confirm({
              title: '温馨提示',
              showCancelButton:false,
              message: `${res.data.message}`,
            }).then(() => {
              let osType = localStorage.osType;
              localStorage.clear();
              localStorage.clear();
              _this.$emit("indexSelect","搜索");
              _this.$router.replace("/login?osType="+osType);
            })
          }
        }).catch(function(err){
          console.log(err);
        });
      }else{
        // // 这个else永远不会执行
        // Dialog.confirm({
        //   title: '新版本提示',
        //   showConfirmButton:false,
        //   showCancelButton:false,
        //   message: '当前应用非最新版本,为不影响使用,请前往应用商店下载最新版本',
        // })
      }
    },
    searchTab(id){
      this.active = id;
      // console.log(this.active)
    },
    toSearch(){
      let _this = this;
      _this.$router.push("/search");
    },
    changeSelected(val){
      this.selected = val;
    },
    changeTipFlag(data){
      // console.log(data,">>>>>>>>>>>>>>>>>>>>>>>")
      this.newsTipFlag = data;
    },
    // 获取未读消息数量
    clickMine(){
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "userId": userid
      }
      // debugger
      // console.log(data)
      _this.$axios.post("/api/noticeInfo/notReadNum",data)
      .then(function (res){
        // console.log("未读消息为:",res.data)
        if(res.data.code == 200){
          // _this.noReadNum = 5;
          // _this.newsTipFlag = true;
          // console.log(_this.noReadNum)

          // console.log(res.data.data);
          if(res.data.data){
            _this.newsTipFlag = true;
            if(  0 < res.data.data <= 99 ){
              _this.noReadNum = res.data.data;
            }else if(res.data.data > 99 ){
              _this.noReadNum = "99+";
            }
          }else{
            _this.newsTipFlag = false;
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        Toast(error);
      });
    },
  },


};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@deep:~">>>";
@{deep} .van-dialog__header {
  line-height: 50px;
}
@import "../../../assets/pageCss/index";
.mainApp{
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  margin: 0;
}
.body{
  flex: 1;
  display: flex;
  flex-direction: column;
}

.my-tit{
  text-align: left;
  color:#00A2EA;
  font-size:15px;
}

.middle{
  flex: 1;
  position: relative;
  /* border:2.5px red solid; */
  /* border: 0.5px #000 solid; */
}
.bottom{
  height:1.6rem;
  border-top: 0.5px solid #ddd;
}
.dev-box{
  width:100vw;
  /* height:100vh; */
  text-align: center;
  display: table-cell;
  vertical-align: middle;

}

.mint-tabbar{
  height:1.3rem;
}
.mint-tab-item:nth-child(4n+3){
  position: relative;
  // background-color: pink;
  // border:1px solid #000;
}
.mint-tab-item-icon img{
  width:100%;
  height:100%;

}
// .mint-tab-item-icon .search_index_icon{
//   width: 37.5px!important;
//   height: 37.5px!important;
// }
.news_tip{
  width:6px;
  height: 6px;
  border-radius: 50%;
  background-color: red;
  position: absolute;
  top:3px;
  right:30px;
}


</style>
