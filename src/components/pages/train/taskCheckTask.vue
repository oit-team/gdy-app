<template>
  <VueActions id="taskCheckTask" data="check">
    <div style="height: 1.4rem;">
      <backHeader title="考核任务">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right"></span>
      </backHeader>
    </div>

    <Scroll
      class="check-box"
      ref="checkTopScroll"
      :probeType='3'
      :scrollX='true'
      :scrollY='false'
      :autoUpdate="false"
      :pullDown="false"
      :pullUp="false">
      <div class="check-ul">
        <div
          class="check-item"
          v-for="(item, index) in titleList"
          :key="index"
          :id="item.dictitemCode"
          :class="{active: item.dictitemCode == selecteds}"
          @click="set_tab_index(item.dictitemCode,index)"
          v-actions:checkTab.click>
          {{item.dictitemDisplayName}}
        </div>
      </div>
    </Scroll>

    <div v-if="checkLoading == true">
      <van-loading color="#00a2ea"  />
    </div>
    <Scroll
      v-else
      :update-data="[checkTaskList]"
      :refresh-data="[]"
      class="checkTaskCon"
      ref="checkScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      @pullingDown="checkRefresh"
      @pullingUp="checkLoadMore"
      key="2"
      v-actions:lookCheck.duration
      >
      <div v-if="checkTaskList.length > 0" style="padding-top:0.5px;">
        <!-- 考核任务 -->
        <div class="checkTask_box">
          <div class="listcheck" @click="toCheckTask(item)" v-for="(item,index) in checkTaskList" :key="index">
            <div class="checkTop">
              <div class="checkTop_box">
                <div class="sekuai"></div>
                <div class="checkCon_t">{{item.tpName}}</div>
              </div>
              <span class="checkRspan">{{item.maxFraction}}</span><span class="Rspan"> 分</span>
            </div>
            <div class="checkBom">
              <div class="box_top">
                <div class="check_top">
                  <div class="box_b">{{item.startTime}}</div>
                  <div class="box_t" >
                    <span class="Pspan" >限考次数</span>
                    <span class="Rspan" v-if="item.timesLimit>0">{{item.timesLimit}} 次</span>
                    <span class="Rspan" v-else>不限</span>
                  </div>
                </div>
                <div class="check_in">
                  <div class="box_b">{{item.endTime}}</div>
                  <div class="box_t">
                    <span class="Pspan">考核次数</span>
                    <span class="Gspan">{{item.usedTimes}} 次</span>
                  </div>
                </div>
              </div>
              <div class="check_bom">
                <img v-if="item.usedTimes && item.usedTimes>item.timesLimit && new Date().getTime() < new Date(item.endTime).getTime(new Date(item.endTime)) || item.timesLimit&&item.usedTimes<item.timesLimit && new Date().getTime() < new Date(item.endTime).getTime(new Date(item.endTime)) " src="static/images/icon/ceyice.png " alt="">
                <img v-else src="static/images/icon/end.png " alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="noData" style="padding-top:0.5px;" v-else>
        <noGood></noGood>
      </div>
    </Scroll>
  </VueActions>
</template>
<script>
import { Dialog } from 'vant';
import { Toast } from 'mint-ui';
import Header from '../../comps/header/header';
import backHeader from '../../comps/common/commonBackHeader';
import noGood from "../../comps/common/noGoods";
export default {
  name:'taskCheckTask',
  components:{ Header , backHeader ,noGood},
  data(){
    return {
      numScore:'',//考核批次
      checkLoading:true,   // 测试列表加载状态 true 记载中 false 加载完毕
      checkTaskListCount:"",
      checkTaskList:[],
      bsType:"",
      page:1,
      pageSize:16,
      titleList:[],
      TITLE:{dictitemDisplayName: "全部", dictitemCode: ''},
      selecteds:'',
      isActive:0,   // 判断头部滚动需要该参数，初始值为0
    }
  },
  created(){
  },
  mounted(){

  },
  activated(){
    // this.checkTaskList = [];
    this.bsType = localStorage.bsType;
    localStorage.removeItem('ceyice');
    if(localStorage.assessTask){
      this.getTitleList()
      if(localStorage.selecteds){
        this.selecteds = localStorage.selecteds
      }else{
        this.checkTaskShow()
      }
    }else{
      this.checkTaskShow()
    }

  },
  watch:{
    selecteds:function(newV,oldV){
      let _this = this;
      for(let i =0;i<_this.titleList.length;i++){
        if(newV==_this.titleList[i].dictitemCode){
          break;
        }
      }
      _this.checkTaskShow(newV);
    },
  },
  methods:{
    // 返回
    back(){
      localStorage.removeItem('selecteds')
      this.$router.push({
        path:"/index",
      })
      this.selecteds = ''
    },
    //获取头部滚动条列表数据
    getTitleList(){
      let _this = this;
      let params = {
        brandId: localStorage.brandId,
        dictCode: 'BS_TYPE_2',
      };
      let jsonParam = this.GLOBAL.g_paramJson(params);
      _this.$axios.post("/task/task/getTitleList", jsonParam).then(function (res) {
        _this.checkLoading = false;
        // console.log("首次使用生成任务", res);
        if (res.data.head.status == "0") {
          _this.titleList = res.data.body.titleList;
          _this.titleList.unshift(_this.TITLE)
        } else {
          _this.$toast(res.data.message);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    // 点击头部导航进行内容切换
    set_tab_index(val,index){
      let _this = this;
      // _this.checkLoading = true;
      localStorage.selecteds = val;

      if(_this.selecteds!=val){

        if(this.isActive != index){
          if(this.isActive < index){
            this.$refs.checkTopScroll.scrollToElement(event.currentTarget,500);
          }else{
            if(!!event.currentTarget.previousElementSibling){
              this.$refs.checkTopScroll.scrollToElement(event.currentTarget.previousElementSibling,500);
            }else{
              this.$refs.checkTopScroll.scrollToElement(event.currentTarget,500);
            }
          }
        }

        this.isActive = index;

        _this.checkLoading = true;
        _this.selecteds=val;
        // 监听selecteds有变化的时候会重新请求
      }
    },
    // 获取考核任务列表
    checkTaskShow(){
      let _this = this;
      let scopId = "";
      let params = {
        userId: localStorage.userId,
        taskType: 2,
        bsCode: localStorage.brandIdGDY,
        bsType: this.bsType,
        bsTypeSec: _this.selecteds,
        scopId: scopId,
        page: this.page,
        pageSize: 6,
        querySource:'0'
      };
      let jsonParam = this.GLOBAL.g_paramJson(params);
      _this.$axios.post("/task/task/getTaskList", jsonParam).then(function (res) {
        _this.checkLoading = false;
        // console.log("获取考核任务列表", res.data);
        if (res.data.head.status == "0") {
          if(_this.page == 1){
            _this.checkTaskList = res.data.body.vResult
            _this.checkTaskListCount = res.data.body.count;
          }else{
            _this.checkTaskList = _this.checkTaskList.concat(res.data.body.vResult);
            _this.checkTaskListCount = res.data.body.count;
          }
        } else {
          _this.$toast(res.data.head.msg);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    // 上拉刷新
    checkRefresh(){
      this.page = 1;
      this.checkTaskShow();
    },
    // 下拉加载
    checkLoadMore(){
      if(this.checkTaskList.length < this.checkTaskListCount){
        this.page++;
        this.checkTaskShow();
      }else{
        this.$refs.checkScroll.update(true)
      }
    },

    //列表跳转方法
    toCheckTask(item){
      // console.log("item",item);
      let _this = this;
      localStorage.selecteds = this.selecteds;
      localStorage.numScore = item.maxFraction;
      // 获取批次号接口，为空，给出提示，直接开始做题
      localStorage.usedTimes = item.usedTimes;
      localStorage.timesLimit = item.timesLimit;
      localStorage.taskId = item.taskId;
      localStorage.dateName = item.tpName;
      localStorage.issuanceNumber = item.issuanceNumber;
      // 先判断考核日期是否已经结束，未结束再判断考核次数是否已达到限制次数
      // 当前日期是否大于开始时间且小于结束时间
      if(new Date().getTime() < new Date(item.endTime).getTime(new Date(item.endTime)) && new Date().getTime() > new Date(item.startTime).getTime(new Date(item.startTime))){
        // 判断考核次数
        // 次数大于0，则跳转到考核批次列表页面，否则直接跳转到开始测试页面
        if(item.usedTimes&&item.usedTimes>0){
          // 次数大于0，则跳转到考核批次列表页面
          localStorage.endTime = item.endTime;
          localStorage.startTime = item.startTime;
          _this.$router.push({
            path:"./taskBatch",
            query:{
              item:item,
            }
          })
          return;
        }else{
          // 未考核过（考核次数为0），直接跳转到开始测试页面
          localStorage.toTestPath = 'taskCheckTask';
          _this.$router.push({
            path:"./taskTest",
            query:{
              check:1
            }
          })
          return;
        }
      }else{
        // 超过限制日期但考核过(这里不管考核次数限制)，跳转到考核记录列表页
        if(item.usedTimes&&item.usedTimes>0){
          _this.$router.push({
            path:"./taskBatch",
            query:{
              item:item
            }
          })
          return;
        }else{
          // 不跳转
          this.$toast('考核时间已过，考核记录为空');
          return;
        }
      }
    },
  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/taskCheckTask";
</style>
