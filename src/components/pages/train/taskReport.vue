<template>
  <div id="taskReport">
    <div class="headBox" style="height: 1.4rem;">
      <backHeader title="报告">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right"></span>
      </backHeader>
    </div>
    <Scroll
      class="testReportCon"
      ref="testReportScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      :pullDown="false"
      :pullUp="false">
      <div class="bodys">
        <div class="radial">
          <Radial
            :percentNum='percent'
            speed="3"
            size="120"
            color="#4FD5AC"
            backgroundColor="#e6e5e5"
            content="正确率"
          >
          </Radial>
        </div>
        <div class="bodysTop">
          <div class="lists">
            <div class="listsTop">
              <img src="static/images/icon/ti.png">
            </div>
            <div class="listsBom" >
              <div class="tspan">考核范围</div>
              <div class="bspan">{{dateName}}</div>
            </div>
          </div>
          <div class="listss">
            <div class="listsTop">
              <img src="static/images/icon/shijian.png">
            </div>
            <div class="listsBom">
              <div class="tspan">用时</div>
              <div class="bspan">{{parseInt(tastReportList.useTime/60)}}分{{tastReportList.useTime%60}}秒</div>
            </div>
          </div>
        </div>
        <div class="bodysBom" >
          <div class="bodysBomIn" v-for="(item,index) in tastReportList.list" @click="analysisList(index)" :key="index">
            <span class="bodysBomInIn" :class="item.correct == 1?'active':item.correct == 3 ? 'warning' :''">{{index+1}}</span>
          </div>
        </div>
      </div>
    </Scroll>
    <div class="footer" v-if="tastReportList.usedTimes && tastReportList.usedTimes>tastReportList.timesLimit || tastReportList.timesLimit&&tastReportList.usedTimes<tastReportList.timesLimit" >
      <van-button class="startBtn" round type="info" @click="analysis">题目解析</van-button>
    </div>
    <div class="footer1" v-else >
      <van-button class="startBtn" round type="info" @click="analysis">题目解析</van-button>
    </div>
  </div>
</template>
<script>
import { Dialog } from 'vant';
import { Toast } from 'mint-ui';
import Header from '../../comps/header/header';
import backHeader from '../../comps/common/commonBackHeader';
import noGood from "../../comps/common/noGoods";

import Radial from './radial.vue';
export default {
  name:'taskReport',
  components:{ Header , backHeader ,noGood ,Radial},
  data(){
    return {
      query:[],
      tastReportList:{},
      percent:"",//百分比
      dateName:'',
      // 批次页数据↓
      page:1,
      pageSize:100,
      staffHaveListId:"",
      BACHID:"",
      curBachId:null,
      model:"2"//1是答案/*没有用过1*/。2是考题
    }
  },
  created(){},
  mounted(){},
  activated(){
    this.curBachId = this.$route.query.bachId;
    // console.log('this.curBachId:',this.curBachId)
    localStorage.analy = 1;
    this.kaoti();
    // console.log('dateName:',localStorage.dateName)
    this.dateName = localStorage.dateName;
    this.query = this.$route.query.item;
    //获取测试报告接口
    this.testReportShow(this.curBachId)
  },
  watch:{
  },
  methods:{
    kaoti(){
      //获取考题
      let _this = this;
      let params = {
        taskId: localStorage.taskId,
        issuanceNumber: localStorage.issuanceNumber,
        model: this.model,
      };
      let jsonParam = this.GLOBAL.g_paramJson(params);
      _this.$axios
        .post("/task/task/getInstance", jsonParam)
        .then(function (res) {
          // console.log("考题的数量、考核的时间、以及该任务的最好成绩", res);
          if (res.data.head.status == 0) {
            _this.goodsTestDetailList = res.data.body;
          } else {
            _this.$toast(res.data.head.msg);
          }
        })
        .catch(function (error) {
          console.log(error);
          // _this.$toast("接口调用失败");
        });
    },
    // 题目解析
    analysis(){
      localStorage.testFlag = true;
      // console.log("设置缓存",localStorage.testFlag)
      setTimeout(()=>{
        localStorage.removeItem("testFlag");
        // console.log("一秒后清除缓存",localStorage.testFlag)
      },3000)
      localStorage.curTestNum = 0
      // localStorage.goodslist = JSON.stringify(this.goodsTestDetailList);
      localStorage.analysisList = JSON.stringify(this.tastReportList);
      // 获取考题成功过以后跳转至刷题页面
      this.$router.push({
        path:"./taskTestTopic",
        query:{
          jiexi:1,
          // analysis:this.tastReportList,
          BACHID:this.curBachId,
          kaotiList:this.goodsTestDetailList,
        }
      })
    },

    // 退出 如果是从测试报告页面返回上一层，绝对是返回测试记录列表页面
    back(){
      localStorage.removeItem('analy');
      localStorage.removeItem('ceyice');

      if(localStorage.bsType == 1){
        this.$router.push({
          path:'/checkRecord',
        })
        return;
      }

      if(localStorage.bsType == 2){
        this.$router.push({
          path:'/checkRecord',
        })
        return;
      }
      if(localStorage.bsType==3){
        if(localStorage.atts){
          localStorage.removeItem('atts');
          this.$router.push({
            path:'/taskBatch',
            query:{
              atts:1
            }
          })
        }else{
          this.$router.push({
            path:'/taskBatch'
          })
        }

        return;
      }
    },
    //提交完成需要 == 辅助测试报告
    staffHaveShow(){
      let _this = this;
      let params = {
        taskId: localStorage.taskId,
        userId: localStorage.userId,
        issuanceNumber:localStorage.issuanceNumber,
        page:this.page,
        pageSize:this.pageSize
      };
      let jsonParam = this.GLOBAL.g_paramJson(params);
      _this.$axios.post("/task/task/getTaskBatch", jsonParam).then((res)=> {
          // console.log("获取任务列表批次",res.data.body);
          if (res.data.head.status == 0) {
            _this.staffHaveListId = res.data.body.bachList[res.data.body.bachList.length-1].bachId;
            _this.testReportShow()
          } else {
            // _this.$toast(res.data.head.msg);
          }
        })
        .catch(function (error) {
          console.log(error);
          // _this.$toast("接口调用失败");
        });
    },
    //获取测试报告
    testReportShow(curBachId){
      // this.BACHID = this.$route.query.to == 2 ?this.query.bachId:this.$route.query.to == 1 ?this.staffHaveListId:this.query.bachId;
      let _this = this;
      let params = {
        // bachId: this.BACHID,
        bachId: localStorage.curBachId,
        taskId: localStorage.taskId,
        userId: localStorage.userId,
        issuanceNumber: localStorage.issuanceNumber
      };
      let jsonParam = this.GLOBAL.g_paramJson(params);
      _this.$axios
        .post("/task/task/getTaskResult", jsonParam)
        .then(function (res) {
          // console.log("获取测试报告接口",res);
          if (res.data.head.status == 0) {
            _this.tastReportList = res.data.body
            // 获取做对的题
            let num = 0
            for(let i=0;i<_this.tastReportList.list.length;i++){
              if(_this.tastReportList.list[i].correct == 1){
                num = num+1
              }
            }
            // 对除以总题
            _this.percent = Number((num/_this.tastReportList.list.length)*100)
            // console.log(_this.percent)
          } else {
            _this.$toast(res.data.head.msg);
          }
        })
        .catch(function (error) {
          console.log(error);
          // _this.$toast("接口调用失败");
        });
    },
    //题数
    analysisList(index){

      localStorage.testFlag = true;
      // console.log("设置缓存",localStorage.testFlag)
      setTimeout(()=>{
        localStorage.removeItem("testFlag");
        // console.log("一秒后清除缓存",localStorage.testFlag)
      },3000)

      localStorage.curTestNum = index;
      // localStorage.goodslist = JSON.stringify(this.goodsTestDetailList);
      localStorage.analysisList = JSON.stringify(this.tastReportList);
      this.$router.push({
        path:"./taskTestTopic",
        query:{
          jiexi:1,
          num1:index,
          // analysis:this.tastReportList,
          BACHID:this.curBachId,
          kaotiList:this.goodsTestDetailList,
        }
      })
    },

  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/taskReport";
</style>
