<template>
  <VueActions id="taskTestTopic" data="taskTestTopic">
    <div class="headBox">
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
      class="goodsTestTopicCon"
      ref="goodsTestTopicScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      :pullDown="false"
      :pullUp="false">
      <div class="bodys">

        <div class="listsBom" >
          <div class="listsBomTop">
            <div class="listsBomTopTop"><span class="listsBomTopTopSpan" >{{content_index+1}}</span>/{{goodslist.count?goodslist.count:goodslist.questionCount}}</div>
            <div v-if="jiexi!=1" class="listsBomTopBom"><img class="listsBomTopTopImg" src="static/images/goodsTest/test35@2x.png" alt=""><span ref="startTimer">{{time}}</span></div>
          </div>
          <div class="listsBomIn" v-html="goodslist.vResult[content_index].subTitle?goodslist.vResult[content_index].subTitle:goodslist.vResult[content_index].content"></div>
          <div class="listBomBom" v-for="(key,i) in (goodslist.vResult[content_index].option?goodslist.vResult[content_index].option:goodslist.vResult[content_index].answers)" :key="i">
            <div v-if="jiexi!=1" class="listBomBomList" @click="listIconShow(key,i,content_index)" key="listIcon" v-actions:listIcon.click>
              <!-- 判断 id 判断 选项 -->
              <div class="listIcon" :class="goodslist.vResult[content_index].ageNUM == key.orderNum&&goodslist.vResult[content_index].egaID == key.instanceId||goodslist.vResult[content_index].ID == key.orderNum?'active':''" >{{key.orderNum}}</div><div class="listContent">{{key.title?key.title:key.orderContent}}</div>
            </div>
            <div v-else class="listBomBomList">
              <div class="listIcon" :class="sisDataList.correctAnswer==sisDataList.usertAnswer==key.orderNum?'green':sisDataList.correctAnswer==key.orderNum?'green':sisDataList.userAnswer==key.orderNum?'red':''" >{{key.orderNum}}</div><div class="listContent">{{key.orderContent}}</div>
            </div>
          </div>
        </div>

      </div>
    </Scroll>
    <div class="footer">
      <van-button class="startBtn up" v-if="content_index" type="info" @click="startTesting()" key="pre" v-actions:pre.click>上一题</van-button>
      <van-button class="startBtn up" v-else disabled type="info">上一题</van-button>
      <van-button class="startBtn in" v-if="queryArr.length!=0" @click="catalogShow()" key="menuAll" v-actions:menuAll.click>目 录({{queryArr.length}}/{{goodslist.count?goodslist.count:goodslist.questionCount}})</van-button>
      <van-button class="startBtn in" v-else @click="catalogShow()" key="menuEmpty" v-actions:menuEmpty.click>目 录</van-button>

      <van-button class="startBtn down" v-if="(((queryArr.length>0?queryArr.length:0) == goodslist.vResult.length)&&jiexi!=1)" type="info" :disabled="isDisable" @click="submit()" key="next" v-actions:next.click>提交</van-button>
      <van-button class="startBtn down" v-else-if="content_index < goodslist.vResult.length-1"  type="info"  @click="endTesting(1)" key="lastTest" v-actions:last.click>下一题</van-button>
      <van-button class="startBtn down" v-else-if="(queryArr.length>0?queryArr.length:0) < goodslist.vResult.length" disabled type="info" >下一题</van-button>

    </div>
  </VueActions>
</template>
<script>
import { Dialog, ContactCard } from 'vant';
import { Toast } from 'mint-ui';
import Header from '../../comps/header/header';
import backHeader from '../../comps/common/commonBackHeader';
import noGood from "../../comps/common/noGoods";
import Topic from '../../comps/common/topic.vue';
export default {
  name:'taskTestTopic',
  components:{ Header , backHeader ,noGood},
  data(){
    return {
      inHtml:"",
      dateName:'',
      query:"",
      queryArr:[],   // 已选题目列表
      activeIndex:"",
      content_index:0,  // 当前显示题目索引
      activekey:"",
      //以下计时器参数
      time:"00:00:00",
      timer: "",
      seconds:0,

      isDisable: false,//重复提交

      jiexi:"",
      goodslist:{
        title:'',
        count:'',
        subTitle:'',
        vResult:[
          {
            answers:[{}],
            rowId:"",
          }
        ]
      },
      model:2,
      analysis:{},
      sisDataList:{},
      BACHID:"",

    }
  },
  created(){

    },
  mounted(){
    if(this.$route.query.kaotiList){
      this.goodslist = this.$route.query.kaotiList;
      localStorage.goodslist = JSON.stringify(this.goodslist);
    }else{
      this.goodslist = JSON.parse(localStorage.goodslist)
    }
    // console.log('测试题目列表数据:this.goodslist',this.goodslist)
    this.seconds = this.goodslist.checkingTime
    if(!localStorage.analy){
      this.start()
    }
  },
  activated(){
    // console.log('localStorage.testFlag:',localStorage.testFlag)
    if(localStorage.testFlag && localStorage.testFlag == 'true'){
      // console.log("1111111111,需要正常停留在测试题目列表页");
    }else{
      this.$router.push({
        path:"/index"
      })
      return
    }
    // console.log("进入测试页面的query参数：",this.$route.query)
    if(localStorage.analysisList){
      this.analysis = JSON.parse(localStorage.analysisList)
    }
    this.dateName = localStorage.dateName;
    if(localStorage.curTestNum || localStorage.curTestNum === 0){
      this.content_index = Number(localStorage.curTestNum);
    }

    if(this.$route.query.jiexi){
      this.jiexi = this.$route.query.jiexi?this.$route.query.jiexi:"";
      this.analysisShow(this.analysis)
    }
    // console.log("this.analysis====",this.analysis);
  },
  watch:{
    $route(to,from){}
  },
  methods:{
    // 返回
    back(){
      // of 是从开始测试页面传递过来的参数，代表此页面处于答题过程，点击提出需要提示
      if(this.$route.query.of == 1){
        Dialog.confirm({
          title:"温馨提示",
          message: '现在是答题阶段<br/>退出将自动提交所做答案！',
        }).then(() => {
          clearTimeout(this.timer);
          localStorage.removeItem("curTestNum");
          this.submit(1)
          // on confirm
        }).catch(() => {
          // on cancel
        });

      }else{
        //  localStorage.testFlag = 'true';
        localStorage.testFlag = 'true';
        setTimeout(()=>{
          localStorage.removeItem("testFlag");
        },3000)
        clearTimeout(this.timer)
        localStorage.removeItem("curTestNum");
        this.$router.push({
          path:'/taskReport',
        })
      }

    },

    // 处理每一道题目选中abcd方法（单选）
    listIconShow(key,i,content_index){
      // console.log("item:",key,'索引',i,"题目index：",content_index);
      this.$set(this.goodslist.vResult[content_index],'ID',key.orderNum);
      this.queryArr.unshift(key);
      let obj = {};
      let departTagS = this.queryArr.reduce(function(item, next) {
        next.answer = next.orderNum;
        next.useTime = 100;
        obj[next.instanceId] ? '' : obj[next.instanceId] = true && item.push(next);
        return item;
      }, []);
      this.queryArr = departTagS;
      this.activeIndex = i;
      this.activekey = key;
      this.$set(this.queryArr[0],'ageNUM',key.orderNum);
      this.$set(this.queryArr[0],'egaID',key.instanceId);
    },
    // 上一题
    startTesting(){
      if(this.content_index>0){
        this.content_index = this.content_index-1
        localStorage.curTestNum =this.content_index
      }
      if(this.jiexi){
        this.analysisShow(this.analysis)
      }
    },
    // 下一题
    endTesting(w){
      if(this.content_index<this.goodslist.vResult.length-1){
      this.content_index = this.content_index+1
      localStorage.curTestNum =this.content_index
      }
      if(this.jiexi){
        this.analysisShow(this.analysis)
      }
    },
    // 提交  有参数代表未正确点击提交按钮，点击了左上角的返回按钮进行提交
    submit(sub){
      // 点击提交的时候，获取本套题所用的时间。除以本所做题的数量。
      if(localStorage.bsType=='3'){  // 考核才用到这个
        localStorage.atts = 1
      }
      if(sub){
        this.isDisable = true;//重复提交
        if(this.queryArr != []){
          for(let i=0;i<this.queryArr.length;i++){
            this.queryArr[i].useTime = parseInt((this.goodslist.checkingTime-this.seconds)/this.queryArr.length)//每道题多少时间
          }
        }
        let _this = this;
        let params = {
          userName:localStorage.userName,
          taskId: localStorage.taskId,
          answers: this.queryArr,//集合
          brandId:localStorage.brandId,
          bsCode:localStorage.brandIdGDY,
          issuanceNumber:localStorage.issuanceNumber,
          orgId:localStorage.orgId,
          userId:localStorage.userId,
        };
        let jsonParam = this.GLOBAL.g_paramJson(params);
        _this.$axios
          .post("/task/task/submitAnswer", jsonParam)
          .then((res) => {
            this.isDisable = false;//重复提交
            // console.log("提交答案",res.data);
            if (res.data.head.status == 0) {
              // localStorage.testFlag = 'false';
              localStorage.curBachId = res.data.body.bachId;
              clearTimeout(this.timer);
              localStorage.removeItem("curTestNum");
              _this.$router.push({
                path:"./taskReport",
                query:{
                  to:1,
                  bachId:res.data.body.bachId,
                  stamp:new Date().getTime()
                }
              })
            } else {
              _this.$toast(res.data.head.msg);
            }
          })
          .catch(function (error) {
            console.log(error);
            // _this.$toast("接口调用失败");
          });
      }else{
        Dialog.confirm({
          title:"温馨提示",
          message: '确认要提交吗?',
        }).then(() => {
          this.isDisable = true;//重复提交
          if(this.queryArr != []){
            for(let i=0;i<this.queryArr.length;i++){
              this.queryArr[i].useTime = parseInt((this.goodslist.checkingTime-this.seconds)/this.queryArr.length)//每道题多少时间
            }
          }

          let _this = this;
          let params = {
            userName:localStorage.userName,
            taskId: localStorage.taskId,
            answers: this.queryArr,//集合
            brandId:localStorage.brandId,
            bsCode:localStorage.brandIdGDY,
            issuanceNumber:localStorage.issuanceNumber,
            orgId:localStorage.orgId,
            userId:localStorage.userId,
          };
          let jsonParam = this.GLOBAL.g_paramJson(params);
          _this.$axios.post("/task/task/submitAnswer", jsonParam).then((res) => {
            this.isDisable = false;//重复提交
            // console.log("提交答案",res.data);
            if (res.data.head.status == 0) {
              localStorage.curBachId = res.data.body.bachId;
              clearTimeout(this.timer);
              localStorage.removeItem("curTestNum");
              _this.$router.push({
                path:"./taskReport",
                query:{
                  to:1,
                  bachId:res.data.body.bachId,
                  stamp:new Date().getTime()
                }
              })
            } else {
              _this.$toast(res.data.head.msg);
            }
          }).catch(function (error) {
            console.log(error);
            // _this.$toast("接口调用失败");
          });
        }).catch(() => {
          // on cancel
          this.$toast("已取消提交");
        });
      }
    },

    // 倒计时
    start () {
      // console.log("测试时间：秒数：",this.seconds)
      this.timer = setInterval(() => {
        if(this.seconds){
          this.seconds = this.seconds - 1;
        }
        let hr = parseInt(this.seconds  / 60 / 60)
        let min = parseInt(this.seconds / 60 % 60)
        let sec = parseInt(this.seconds % 60)
        // 个位数前补零
        hr = hr > 9 ? hr : '0' + hr
        min = min > 9 ? min : '0' + min
        sec = sec > 9 ? sec : '0' + sec
        this.time = hr+":"+min+":"+sec

        if(this.seconds == 0){
          this.submit(1)
        }
      }, 1000);
    },
    // 查看实例详情（题目解析）
    analysisShow(sis){
      let _this = this;
      let params = {
        taskId: localStorage.taskId,
        instanceId: sis.list[this.content_index].instanceId,
        userId: localStorage.userId,
        issuanceNumber: localStorage.issuanceNumber,

        bachId: localStorage.curBachId,//拿不到bachId
      };
      let jsonParam = this.GLOBAL.g_paramJson(params);
      _this.$axios.post("/task/task/getInstanceInfo", jsonParam).then(function (res) {
        // console.log("查看实例详情",res);
        if (res.data.head.status == 0) {
          _this.sisDataList = res.data.body
        } else {
          _this.$toast(res.data.head.msg);
        }
      }).catch(function (error) {
        console.log(error);
        // _this.$toast("接口调用失败");
      });
    },
    // 跳转目录页
    catalogShow(){
      if(this.jiexi == 1){
        // console.log("解析")
        this.$router.push({
          path:"./taskTopicCatalog",
          query:{
            BACHID:this.BACHID, //解析批次号
            ana:this.analysis,//解析list(答案对错)
            panams:this.queryArr,//已选泽list
            jiexi:1
          }
        })
      }else{
        // console.log("测试目录")
        // clearTimeout(this.timer)
        this.$router.push({
          path:"./taskTopicCatalog",
          query:{
            item:this.goodslist,//考题list
            panams:this.queryArr,//已选泽list
          }
        })
      }
    },
  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/taskTestTopic";
@deep:~">>>";
.headBox{
height: 1.4rem;
}
@{deep} video{
  width:300px;
  height: 150px;
}
</style>
