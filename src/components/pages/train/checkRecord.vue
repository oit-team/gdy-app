<template>
  <VueActions id="checkRecord" data="checkRecord">
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
    <!-- <div style="height: 1.4rem;">
      <Header :title="'考核记录'"></Header>
    </div> -->

    <Scroll
      :update-data="[checkRecordList]"
      :refresh-data="[]"
      class="recordScrollCon"
      ref="recordScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      @pullingDown="recordRefresh"
      @pullingUp="recordLoadMore"
      >
      <div v-if="checkRecordList.length > 0" style="padding-top:0.5px;">
        <div class="checkTaskContent">
          <div class="lists" :class="item.maxFraction == score?'list':''" @click="toCheckTask(item)" v-actions:toCheck.click v-for="(item,index) in checkRecordList" :key="index">
            <div class="checkedSelect" @click.stop="checkedSelect(item,index)" v-actions:checkSelect.click>
              <img v-if='item.checked' src="static/images/icon/choosed.png" alt="" />
              <img v-else src="static/images/icon/no-choose.png" alt=""/>
            </div>
            <div class="listsLeft">
              <div class="con_t">{{item.finshTime}}</div>
            </div>
            <div class="listsRight">
              <div class="right_box">
                <div class="ospan">
                  <span class="ospan">{{item.maxFraction}}</span><span > 分</span>
                </div>
              </div>
              <span><img src="static/images/dev/go@2x.png"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="noData" style="padding-top:0.5px;" v-else>
        <noGood></noGood>
      </div>
    </Scroll>
    <div class="delBox flex justify-center items-center">
      <div class="selectCircle flex justify-center items-center text-sm" @click="clickSelectAll()" v-actions:selectCircle.click>
        <img v-if='selectAll' src="static/images/icon/choosed.png" alt="" />
        <img v-else src="static/images/icon/no-choose.png" alt="" />
        <span style="margin-left:5px;">全选</span>
      </div>
      <div class="countBox text-sm">共计{{selectedList.length}}/{{recordTotal}}</div>
      <van-button type="info" class="delBtn"  @click="delBtn()" v-actions:delBtn.click>删除</van-button>
      <van-button type="info" class="startBtn" @click="toCheck()" v-action:toCheck.click>测一测</van-button>
    </div>

  </VueActions>
</template>
<script>

import backHeader from '../../comps/common/commonBackHeader';
import Header from '../../comps/header/header';
import noGood from "../../comps/common/noGoods";
import { Dialog } from 'vant';
export default {
  name:'checkRecord',
  components:{ backHeader,Header,noGood },
  data(){
    return {
      page:1,
      pageSize:12,
      checkRecordList:[],
      recordTotal:0,
      selectAll:false,
      selectedList:[],
      score :null,
      dateName:'',

      info:null,
    }
  },
  created(){},
  mounted(){},
  activated(){
    // console.log("this.$route.query",this.$route.query)
    // 有localStorage.classInfo则从微课列表进入,没有则从商品自测进入
    if(localStorage.classInfo){
      this.info = JSON.parse(localStorage.classInfo);
    }

    this.dateName = localStorage.dateName;
    this.score = localStorage.score;
    this.courseId = localStorage.courseId;

    this.checkRecordList = [];
    this.selectedList = [];
    this.page = 1;
    this.getRecordList();

  },
  methods:{
    back(){
      // 判断来到这个页面的路径从而确认返回到那里去
      if(localStorage.bsType=='1'){
        this.$router.push({
          path:'/classList'
        });
      }else if(localStorage.bsType=='2'){
        this.$router.push({
          path:'/taskGoodsTask'
        });
      }

    },
    // 获取测试记录列表
    getRecordList(){
      // console.log("获取测试记录列表");
      let _this = this;
      let params = null;

      if(localStorage.bsType=='1'){  // 微课堂
        params = {
          userId: localStorage.userId,
          bsCode: localStorage.brandIdGDY,
          scopId: this.courseId,
          page: this.page,
          pageSize: this.pageSize,
          bsType: 1,  // 1 微课程 2 商品自测  3 任务考核
          taskType: 2,   //  1 智能出题  2 人工出题
          // bsType为2时 taskType传1  bsType为1或3时 taskType传2
          bsTypeSec: null,
        };
      }
      if(localStorage.bsType=='2'){  // 商品自测
        params = {
          userId: localStorage.userId,
          taskType: 1,//1：自动任务（系统自动生成任务，计算引擎自动生成任务实例）2：人工任务（字定义任务，例如：员工必学等）
          bsCode: localStorage.brandIdGDY,
          bsType: localStorage.bsType,
          scopId: localStorage.dateId,
          bsTypeSec:"",
          page: this.page,
          pageSize: this.pageSize,
        };
      }

      let jsonParam = this.GLOBAL.g_paramJson(params);
      _this.$axios.post("/task/task/getTaskList", jsonParam).then((res) => {
        // console.log("获取测试记录列表", res.data);
        if (res.data.head.status == "0") {
          _this.recordTotal = res.data.body.count;
          _this.score = res.data.body.maxFraction;

          if(_this.page == 1){
            _this.selectedList = [];
            _this.selectAll = false;
            _this.checkRecordList = res.data.body.vResult;
          }else{
            _this.checkRecordList = _this.checkRecordList.concat(res.data.body.vResult);
          }
        } else {
          _this.$toast(res.data.head.msg);
        }
      }).catch(function (error) {
        console.log(error);
        // _this.$toast("接口调用失败");
      });
    },
    // 去测试记录详情页
    toCheckTask(item){
      // console.log('checkRecord：item',item);
      localStorage.taskId = item.taskId;
      localStorage.issuanceNumber = item.issuanceNumber;

      localStorage.curBachId = item.bachId;
      this.$router.push({
        path:"./taskReport",
        query:{
          item:item,
          bachId:item.bachId,
          stamp:new Date().getTime()
        }
      })
    },
    // 选择一项记录
    checkedSelect(item){
      if(item.checked){
        this.$set(item,'checked',false)
        for(let i=0;i<this.selectedList.length;i++){
          if(this.selectedList[i].taskId == item.taskId){
            this.selectedList.splice(i,1)
            // console.log(this.selectedList)
          }
        }
      }else{
        let obj={
          taskId:'',
          issuanceNumber:''
        }
        obj.taskId = item.taskId;
        obj.issuanceNumber = item.issuanceNumber
        obj.bachId = ''
        this.selectedList.push(obj)
        // console.log(this.selectedList)
        this.$set(item,'checked',true)
      }
      for(let i=0;i<this.checkRecordList.length;i++){
        if(this.checkRecordList[i].checked){
          this.selectAll = true
        }else{
          this.selectAll = false
          break
        }
      }
    },
    // 点击全选
    clickSelectAll(){
      if(this.selectAll){
        this.selectAll = false
        for(let i=0;i<this.checkRecordList.length;i++){
          this.selectedList = []
          this.$set(this.checkRecordList[i],'checked',false)
        }
        // console.log(this.selectedList)
      }else{
        this.selectAll = true
        for(let i=0;i<this.checkRecordList.length;i++){
          let obj={
            taskId:'',
            issuanceNumber:'',
            bachId:'',
          }
          obj.taskId = this.checkRecordList[i].taskId;
          obj.issuanceNumber = this.checkRecordList[i].issuanceNumber;
          obj.bachId = '';
          this.selectedList.push(obj)
          this.$set(this.checkRecordList[i],'checked',true)
        }
        let object = {};

        let peon = this.selectedList.reduce((cur,next) => {
            object[next.taskId] ? "" : object[next.taskId] = true && cur.push(next);
            return cur;
        },[])
        this.selectedList = peon
        // console.log(this.selectedList)
      }
    },
    // 下拉刷新
    recordRefresh(){
      this.page = 1;
      // this.selectedList = [];
      this.getRecordList();
    },
    // 上拉加载更多
    recordLoadMore(){
      if(this.checkRecordList.length < this.recordTotal){
        // console.log(this.collocationList.length , this.collTotal)
        this.page++;
        this.getRecordList();
      }else{
        // console.log(this.collocationList.length , this.collTotal)
        this.$refs.recordScroll.update(true)
      }
    },

    // 删除记录
    delBtn(){
      let _this = this;
      if(this.selectedList.length>0){
        Dialog.confirm({
          message: '确认删除该任务信息吗?',
        }).then(() => {
          let params = {
            taskList:this.selectedList,
            type:1,   //  type 为1 删除
          }
          let jsonParam = this.GLOBAL.g_paramJson(params);
          _this.$axios.post("/task/task/delTaskOrBach", jsonParam).then(function (res) {
            // _this.checkLoading = false;
            // console.log("删除任务列表信息", res.data);
            if (res.data.head.status == 0) {
              //删除List中的数据，
              _this.selectAll = false;
              _this.selectedList = [];
              _this.page = 1;
              _this.getRecordList();
              _this.$toast(res.data.head.msg);
            } else {
              _this.$toast(res.data.head.msg);
            }
          }).catch(function (error) {
            console.log(error);
          });
        }).catch(()=>{
          _this.$toast("已取消");
        })
      }else{
        _this.$toast('请先选择要删除的项');
      }
    },
    // 由记录列表去测一测
    toCheck(){
      // console.log("bsType:",localStorage.bsType)
      localStorage.removeItem('usedTimes')
      localStorage.removeItem('timesLimit')
      if(localStorage.bsType=='1'){  // 微课堂
        // console.log('this.info:332',this.info)
        localStorage.toTestPath = 'checkRecord';
        localStorage.classTest = '1';
        if(localStorage.topicCount>=10){
          this.$router.push({
            path:"/taskTest",
            query:{
              classTest:1,
              courseInfo:this.info
            }
          });
          return;
        }else{
          this.$toast('测试题目未准备完毕，不能自测');
        }
      }
      if(localStorage.bsType=='2'){   // 商品自测
        localStorage.toTestPath = 'checkRecord';
        localStorage.goodsTest = '1';
        this.$router.push({
          path:"/taskTest",
          query:{
            ceyice:1
          }
        });
        return;
      }

    },
  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/pageCss/ckeckRecord";
</style>
