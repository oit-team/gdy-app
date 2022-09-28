<template>
  <div id="taskTest">
    <div class="headBox" style="height: 1.4rem;">
      <backHeader :title="dateName">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right"></span>
      </backHeader>
    </div>

    <Scroll
      class="goodsTestDetailCon"
      ref="goodsTestDetailScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      :pullDown="false"
      :pullUp="false">
      <div class="bodys">
        <div class="bodysTop">
          <div class="lists">
            <div class="listsTop">
              <img src="static/images/icon/ti.png">
            </div>
            <div class="listsBom">
              <span class="tspan">考题数量</span>
              <span class="bspan">{{goodsTestDetailList.questionCount}}道</span>
            </div>
          </div>
          <div class="lists">
            <div class="listsTop">
              <img src="static/images/icon/shijian.png">
            </div>
            <div class="listsBom">
              <span class="tspan">考核时间</span>
              <span class="bspan">{{goodsTestDetailList.checkingTime/60}}分钟</span>
            </div>
          </div>
          <div class="lists">
            <div class="listsTop">
              <img src="static/images/icon/mingci.png">
            </div>
            <div class="listsBom">
              <span class="tspan">最好成绩</span>
              <span class="bspan">{{goodsTestDetailList.bestScore?goodsTestDetailList.bestScore:0}}分</span>
            </div>
          </div>
        </div>
      </div>
    </Scroll>
    <div class="footer" >
      <van-button class="startBtn" round type="info" @click="startTesting">开始测试</van-button>
    </div>
  </div>
</template>
<script>
import { Dialog } from 'vant';
import { Toast } from 'mint-ui';
import Header from '../../comps/header/header';
import backHeader from '../../comps/common/commonBackHeader';
import noGood from "../../comps/common/noGoods";
export default {
  name:'taskTest',
  components:{ Header , backHeader ,noGood},
  data(){
    return {
      goodsTestDetailLoading: true,
      goodsTestDetailList:{
        vResult:[
          {
            subTitle:''
          },
        ]
      },
      goodsClassify:[],
      activeId:3,
      displayName:"2020冬",
      title:"Z9",
      query: "",
      model:"2",
      params:"",
      bsType:'',
      goodsTestList:{},
      dateName:'',
      // scope接口传参时要求这样传，所以在data里直接这样定义了，之后动态修改cValue即可
      scopeList:[
        {
          cKey: "BAND",     // 按波段查询，传“BAND”
          cValue: 657       // 对应的波段id
        }
      ],
      subList:[
        {
          subNum: 10,    // 题目数量
          subType: "1"   // 题目类型  1 单选  其它 未知
        }
      ],

      ceyice:'',
      // 是否由商品自测（测一测）进入的标志，存在即由自测进入
      // 之前有商品自测和考核任务两项入口，新开发的微课堂也有，所以要重新进行逻辑判断
      fromPath:'',
      courseId:null,

    }
  },
  created(){

  },
  mounted(){

  },
  activated(){

    // 商品自测进入开始测试页面,根据不同的来源请求不同的接口
    if(localStorage.toTestPath == 'taskGoodsTask' || (localStorage.toTestPath == 'checkRecord'&&localStorage.goodsTest=='1')){
      this.fromPath = localStorage.toTestPath;
      this.dateName = localStorage.dateName;
      this.getTestTopicList();
    }

    if(localStorage.toTestPath == 'classList' || (localStorage.toTestPath == 'checkRecord'&&localStorage.classTest=='1')){   // 从微课堂过来
      this.fromPath = localStorage.toTestPath;
      this.dateName = localStorage.dateName;
      this.courseId = localStorage.courseId;
      this.getCourseTestBaseInfo();
      this.getCourseTopicList();
    }

    if(localStorage.toTestPath == 'taskCheckTask' || localStorage.toTestPath == 'taskBatch'){   // 从考核任务过来
      this.fromPath = localStorage.toTestPath;
      this.dateName = localStorage.dateName;
      this.getTaskTopicList();
    }

    this.bsType = localStorage.bsType;
    localStorage.ceyice = this.$route.query.ceyice?this.$route.query.ceyice:'';
    this.ceyice = localStorage.ceyice;

  },
  watch:{
  },
  methods:{
    // 从微课堂进入该页面
    // 获取微课堂测一测基础此信息
    getCourseTestBaseInfo(){
      let _this = this;
      this.scopeList[0].cValue = localStorage.dateId;
      let params = {
        bsCode: localStorage.brandIdGDY,
        userId: localStorage.userId,
        courseId: this.courseId,
        scopeList: [{
          cKey: "COURSE",   // 按课程查询，同自测接口类似
          cValue: this.courseId   // 课程id
        }],
        subList: [{
          subNum: 10,   // 题目数量,后端限制最少五个
          subType: "1"  // 题目类型 1 单选 其它 未知
        }]
      };
      let jsonParam = this.GLOBAL.g_paramJson(params);
      _this.$axios.post("/task/task/addTaskByUser", jsonParam).then(function (res) {
        // console.log("获取微课堂测一测基础信息:数量，时间，成绩等====", res.data.body);
        if (res.data.head.status == 0) {
          _this.goodsTestDetailList = res.data.body;
        } else {
          _this.$toast(res.data.head.msg);
        }
      }).catch(function (error) {
        // console.log(error);
      });
    },

    // 获取微课堂测一测考题列表
    getCourseTopicList(){
      let _this = this;
      let con = {
        bsCode: localStorage.brandIdGDY,
        userId: localStorage.userId,
        courseId: this.courseId,
        scopeList: [{
          cKey: "COURSE",   // 按课程查询，同自测接口类似
          cValue: this.courseId   // 课程id
        }],
        subList: [{
          subNum: 10,   // 题目数量,后端限制最少五个
          subType: "1"  // 题目类型 1 单选 其它 未知
        }]
      };
      let jsonParam = this.GLOBAL.g_paramJson(con);
      _this.$axios.post("/task/task/addCourseTask", jsonParam).then(function(res) {
        _this.classLoading = false;
        if (res.data.head.status == "0") {
          // console.log("微课堂测一测出题相应数据：",res.data.body);

          _this.goodsTestList = _this.goodsTestDetailList;
          _this.goodsTestDetailList = res.data.body;
          _this.$set(_this.goodsTestDetailList,'questionCount',_this.goodsTestList.questionCount);
          _this.$set(_this.goodsTestDetailList,'checkingTime',_this.goodsTestList.checkingTime);
          _this.$set(_this.goodsTestDetailList,'bestScore',_this.goodsTestList.bestScore);
        } else {
          _this.$toast(res.data.head.msg);
        }
      }).catch(function(error) {
        console.log(error);
      });
    },

    // 由测一测进入该页面
    getTestTopicList(){
      let _this = this;
      this.scopeList[0].cValue = localStorage.dateId;
      let params = {
        bsCode: localStorage.brandIdGDY,
        userId: localStorage.userId,
        scopeList: this.scopeList,
        subList: this.subList
      };
      let jsonParam = this.GLOBAL.g_paramJson(params);
      _this.$axios.post("/task/task/addTaskByUser", jsonParam).then(function (res) {
        // console.log("获取题库基础信息:数量，时间，成绩等====", res.data.body);
        if (res.data.head.status == 0) {
          _this.goodsTestDetailList = res.data.body;
        } else {
          _this.$toast(res.data.head.msg);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },

    // 由考核任务进入该页面
    getTaskTopicList(){
      let _this = this;
      let params = {
        taskId: localStorage.taskId,
        issuanceNumber: localStorage.issuanceNumber,
        model: this.model,
      };
      let jsonParam = this.GLOBAL.g_paramJson(params);
      _this.$axios.post("/task/task/getInstance", jsonParam).then(function (res) {
        // console.log("考题的数量、考核的时间、最好成绩及题目列表：", res);
        if (res.data.head.status == 0) {
          _this.goodsTestDetailList = res.data.body;
        } else {
          _this.$toast(res.data.head.msg);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },

    //  返回 开始测试页面但还未测试，点击返回按钮，当然从哪来回哪去
    back(){
      localStorage.removeItem('ceyice');
      this.$router.go(-1);
    },

    // 开始测试按钮(跳转至刷题页面)
    startTesting(){
      let _this = this;
      if(localStorage.analy){
        localStorage.removeItem("analy");
      }
      localStorage.curTestNum = 0;
      if(this.ceyice){
        this.scopeList[0].cValue = localStorage.dateId;
        let params = {
          bsCode: localStorage.brandIdGDY,
          userId: localStorage.userId,
          scopeList: this.scopeList,
          subList: this.subList
        };
        let jsonParam = this.GLOBAL.g_paramJson(params);
        _this.$axios.post("/task/task/addTaskWithInstance", jsonParam).then(function (res) {
          // console.log("=======", res.data.body);
          if (res.data.head.status == 0) {
            _this.goodsTestList = _this.goodsTestDetailList;
            _this.goodsTestDetailList = res.data.body;
            _this.$set(_this.goodsTestDetailList,'questionCount',_this.goodsTestList.questionCount);
            _this.$set(_this.goodsTestDetailList,'checkingTime',_this.goodsTestList.checkingTime);
            _this.$set(_this.goodsTestDetailList,'bestScore',_this.goodsTestList.bestScore);
            localStorage.taskId = res.data.body.taskId;
            localStorage.issuanceNumber = res.data.body.issuanceNumber;

            if(_this.goodsTestDetailList.vResult && _this.goodsTestDetailList.vResult.length>0){
              localStorage.testFlag = 'true';
              setTimeout(()=>{
                localStorage.removeItem("testFlag");
              },3000)
              _this.$router.push({
                path:"./taskTestTopic",
                query:{
                  kaotiList:_this.goodsTestDetailList,
                  of:1,
                  stamp:new Date().getTime()
                }
              })
            }else{
              _this.$toast("小易绞尽脑汁也未能发现题目,请稍后再试");
            }
          } else {
            _this.$toast(res.data.head.msg);
          }
        })
      }else{
        // console.log("非测一测进入222222")
        // console.log("传递到下一页面的考题信息:",this.goodsTestDetailList)
        localStorage.testFlag = 'true';
        setTimeout(()=>{
          localStorage.removeItem("testFlag");
        },3000)
        if(this.goodsTestDetailList.taskId){
          localStorage.taskId = this.goodsTestDetailList.taskId;
        }
        localStorage.issuanceNumber = this.goodsTestDetailList.issuanceNumber;

        if(_this.goodsTestDetailList.vResult && _this.goodsTestDetailList.vResult.length>0){
          this.$router.push({
            path:"./taskTestTopic",
            query:{
              kaotiList:this.goodsTestDetailList,
              of:1,
              stamp:new Date().getTime()
            }
          })
        }else{
          _this.$toast("小易绞尽脑汁也未能发现题目,请稍后再试");
        }

      }
    },

  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/taskTest";
</style>
