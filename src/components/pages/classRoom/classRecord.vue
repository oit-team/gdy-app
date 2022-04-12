<template>
  <div id="classRecord">
    <!-- <h1>微课堂历史考核记录</h1> -->
    <div style="height:1.2rem;">
      <backHeader :title="title+'--历史记录'">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right"></span>
      </backHeader>
    </div>
    <Scroll
      :update-data="[classRecordList]"
      :refresh-data="[]"
      class="classRecordScrollCon"
      ref="classRecordScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      @pullingDown="classRefresh"
      @pullingUp="classLoadMore"
      >
      <div v-if="classRecordList.length > 0" style="padding-top:0.5px;">
        <div class='itemBox' v-for="(item,index) in classRecordList" :key='index'>
          <div class="checkedSelect" @click.stop="checkedSelect(item,index)">
            <img v-if='item.checked' src="static/images/icon/choosed.png" alt="">
            <img v-else src="static/images/icon/no-choose.png" alt="">
          </div>
          <div class='finishTime'>{{item.finshTime}}</div>
          <div class="score">{{item.maxFraction}}</div>
        </div>

      </div>
      <div class="noData" style="padding-top:0.5px;" v-else>
        <noGood></noGood>
      </div>
    </Scroll>
    <div class="delBox">
      <div class="selectCircle" @click="clickSelectAll()">
        <img v-if='selectAll' src="static/images/icon/choosed.png" alt="">
        <img v-else src="static/images/icon/no-choose.png" alt="">
        <span style="margin-left:5px;">全选</span>
      </div>
      <div class="countBox">共计{{selectedList.length}}/{{classRecordCount}}</div>
      <van-button type="info" class="delBtn"  @click="delBtn()">删除</van-button>
      <van-button type="info" class="startBtn" @click="toCheck()">测一测</van-button>
    </div>

  </div>
</template>
<script>
import backHeader from '../../comps/common/commonBackHeader';
import noGood from "../../comps/common/noGoods";
export default {
  name:'classRecord',
  components:{ backHeader , noGood },
  data(){
    return {
      title:'',
      classRecordList:[],
      classRecordCount:0,
      page:1,
      pageSize:12,
      courseId:null,
      selectAll:false,
      selectedList:[],
      score :null,

    }
  },
  created(){},
  mounted(){},
  activated(){
    console.log("queryInfo>>>",this.$route.query);
    this.title = this.$route.query.item.courseName;
    this.courseId = this.$route.query.item.id;
    this.getClassRecordList();
  },
  methods:{
    back(){
      this.$router.go(-1);
    },
    // 获取微课程考核记录列表数据
    getClassRecordList(){
      let _this = this;
      let scopId = "";
      let params = {
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

      let jsonParam = this.GLOBAL.g_paramJson(params);
      _this.$axios.post("/task/task/getTaskList", jsonParam).then(function (res) {
        // console.log("获取微课程任务考核记录列表", res.data);
        if (res.data.head.status == "0") {
          if(_this.page == 1){
            _this.selectedList = [];
            _this.selectAll = false;
            _this.classRecordList = res.data.body.vResult
            _this.classRecordCount = res.data.body.count;
          }else{
            _this.classRecordList = _this.classRecordList.concat(res.data.body.vResult);
            _this.classRecordCount = res.data.body.count;
          }
        } else {
          _this.$toast(res.data.head.msg);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },

    classRefresh(){
      this.page = 1;
      this.getClassRecordList();
      // this.$refs.classRecordScroll.update(true)

    },
    classLoadMore(){
      if(this.classRecordList.length < this.classRecordCount){
        // console.log(this.collocationList.length , this.collTotal)
        this.page++;
        this.getClassRecordList();
      }else{
        // console.log(this.collocationList.length , this.collTotal)
        this.$refs.classRecordScroll.update(true)
      }
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
      for(let i=0;i<this.classRecordList.length;i++){
        if(this.classRecordList[i].checked){
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
        for(let i=0;i<this.classRecordList.length;i++){
          this.selectedList = []
          this.$set(this.classRecordList[i],'checked',false)
        }
        // console.log(this.selectedList)
      }else{
        this.selectAll = true
        for(let i=0;i<this.classRecordList.length;i++){
          let obj={
            taskId:'',
            issuanceNumber:'',
            bachId:'',
          }
          obj.taskId = this.classRecordList[i].taskId;
          obj.issuanceNumber = this.classRecordList[i].issuanceNumber;
          obj.bachId = '';
          this.selectedList.push(obj)
          this.$set(this.classRecordList[i],'checked',true)
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
    // 删除记录
    delBtn(){
      Dialog.confirm({
        message: '确认删除该记录信息吗?',
      }).then(() => {

      }).catch(()=>{
        _this.$toast("已取消");
      })
    },
    // 由记录列表去测一测
    toCheck(){
      console.log("点击测一测")
    },
  }
}
</script>
<style lang="less" scoped>
#classRecord{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .classRecordScrollCon{
    flex:1;
    overflow: hidden;
    padding:0px 10px;
    box-sizing: border-box;

    .itemBox{
      display: flex;
      justify-content: space-between;

    }

  }

}
</style>
