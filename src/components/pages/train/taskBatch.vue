<template>
  <VueActions id="taskBatch" data="taskBatch">
    <div style="height: 1.4rem;">
      <backHeader :title="dateName">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right"></span>
      </backHeader>
    </div>

    <div v-if="staffLoading == true" key="1">
      <van-loading color="#00a2ea"  />
    </div>
    <Scroll
      v-else
      key="2"
      :update-data="[staffHaveList]"
      :refresh-data="[]"
      class="staffHaveCon"
      ref="staffHaveScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      @pullingDown="staffRefresh"
      @pullingUp="staffLoadMore"
      >
      <div class="content" v-if="staffHaveList.length > 0">
        <div class="content_list" v-for="(item,index) in staffHaveList" :key="index" >
          <div class="lists" :class="item.fraction == numScore?'bth':''" @click="toStaffHaveShow(item)" v-actios:showTask.click>
            <div class="listsLeft">
              <div class="second" :class="item.fraction == numScore?'secondBth':''">{{item.rowId}}</div>
              <div class="listsLeftLeft">{{item.createDate}}</div>
            </div>
            <div class="listsRight">
              <div class="hours" >{{parseInt(item.useTime/60)}}分{{item.useTime%60}}秒</div>
              <div >{{item.fraction}}分</div>
              <span><img src="static/images/dev/go@2x.png"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="noData" style="padding-top:0.5px;" v-else>
        <noGood></noGood>
      </div>
    </Scroll>
    <!-- <div class="delBox" v-if="usedTimes && usedTimes>timesLimit && new Date().getTime() < new Date(endTime).getTime(new Date(endTime)) && new Date().getTime() > new Date(startTime).getTime(new Date(startTime))|| timesLimit&&usedTimes<timesLimit && new Date().getTime() < new Date(endTime).getTime(new Date(endTime)) && new Date().getTime() > new Date(startTime).getTime(new Date(startTime))"> 加一个判断new Date().getTime() -->
    <div class="delBox" v-if="showTestFlag">
      <van-button type="info" class="checkBtn" @click="toStaffHave()" v-actions:checkBtn.click>测一测</van-button>
    </div>
  </VueActions>
</template>
<script>
import { Dialog } from 'vant';
import { Toast } from 'mint-ui';
import Header from '../../comps/header/header';
import backHeader from '../../comps/common/commonBackHeader';
import noGood from "../../comps/common/noGoods";
export default {
  name:'taskBatch',
  components:{ Header , backHeader ,noGood},
  data(){
    return {
      numScore:"",
      staffLoading:true,
      dateName:'',
      page:1,
      pageSize:16,
      query:"",
      staffHaveList:[],
      staffHaveListCount:0,
      usedTimes:"",//使用多少次
      timesLimit:"",//限制多少次  0是无限次
      endTime:'',
      startTime:'',
      showTestFlag:true,
    }
  },
  created(){

  },
  mounted(){
  },
  activated(){
    this.numScore = localStorage.numScore;
    this.dateName = localStorage.dateName;
    this.timesLimit = localStorage.timesLimit; //限考n次
    if(this.$route.query.atts){  // 如果是从测试页回来的，则已测试次数+1，要依据次数来判断测一测按钮是否显示
      this.usedTimes = Number(localStorage.usedTimes)+1;
      localStorage.usedTimes = this.usedTimes;
    }else{
      this.usedTimes = localStorage.usedTimes; //考核n次
    }
    if(this.$route.query.item){
      this.query = this.$route.query.item
    }

    if(localStorage.endTime){
      this.endTime = localStorage.endTime;
      this.startTime = localStorage.startTime;
    }

    let curTime = new Date().getTime();
    let lastTime = new Date(this.endTime).getTime(new Date(this.endTime));
    let firstTime = new Date(this.startTime).getTime(new Date(this.startTime));

    if(Number(this.usedTimes)<Number(this.timesLimit) && firstTime<curTime<lastTime){
      this.showTestFlag = true;
    }else{
      this.showTestFlag = false;
    }

    // console.log("测试按钮是否显示",this.showTestFlag)

    this.staffHaveList = [];
    this.staffHaveListCount = 0;
    this.page = 1;
    this.staffHaveShow();
  },
  watch:{},
  methods:{
    //  返回
    back(){
      // 到任务页面
      localStorage.removeItem('endTime')
      localStorage.removeItem('startTime')
      this.$router.push({
        path:'/taskCheckTask',
      })
    },
    // 上拉刷新
    staffRefresh(){
      this.page = 1;
      this.staffHaveShow();
    },
    // 下拉加载
    staffLoadMore(){
      if(this.staffHaveList.length<this.staffHaveListCount){
        this.page = this.page+1;
        this.staffHaveShow();
      }else{
        this.$refs.staffHaveScroll.update(true)
      }
    },
    // 获取任务批次
    staffHaveShow(){
      let _this = this;
      let params = {
        taskId: localStorage.taskId,
        userId: localStorage.userId,
        issuanceNumber: localStorage.issuanceNumber,
        page:this.page,
        pageSize:this.pageSize
      };
      let jsonParam = this.GLOBAL.g_paramJson(params);
      _this.$axios.post("/task/task/getTaskBatch", jsonParam).then(function (res) {
        // console.log("获取任务列表批次",res);
        if (res.data.head.status == 0) {
          _this.staffLoading = false;
          if(_this.page == 1){
            _this.staffHaveList = res.data.body.bachList
            _this.staffHaveListCount = res.data.body.count
          }else{
            _this.staffHaveListCount = res.data.body.count
            _this.staffHaveList = _this.staffHaveList.concat(res.data.body.bachList);
          }
          // _this.$toast(res.data.head.msg);
        } else {
          _this.$toast(res.data.head.msg);
        }
      }).catch(function (error) {
        console.log(error);
        // _this.$toast("接口调用失败");
      });
    },
    //测一测跳转方法
    toStaffHave(item){
      localStorage.toTestPath = 'taskBatch';
      this.$router.push({
        path:"./taskTest",
        query:{
          item:item,
          params:this.query
        }
      })
    },
    //获取测试报告页面
    toStaffHaveShow(item){
      localStorage.curBachId = item.bachId
      this.$router.push({
        path:"./taskReport",
        query:{
          panams:this.query,
          item:item,
          bachId:item.bachId,
        }
      })
    },

  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/taskBatch";
</style>
