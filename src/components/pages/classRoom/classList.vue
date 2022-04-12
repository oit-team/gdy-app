<template>
  <div id="classList">
    <div class="headBox">
      <backHeader title="微课堂" style="background-color: #f5f5f5;">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right"></span>
      </backHeader>
    </div>

    <Scroll
       class="box"
       ref="classTitScroll"
      :probeType='3'
      :scrollX='true'
      :scrollY='false'
      :autoUpdate="true"
      :pullDown="false"
      :pullUp="false"
    >
      <ul class="box-list">
        <li
          v-for="(item,index) of content"
          :key="index"
          :class="{active: isActive === index}"
          @click="changeAdd(item.dicttimeDisplayName,index)"
        >{{item.dicttimeDisplayName}}
        </li>
      </ul>
    </Scroll>

     <!-- 切换类别显示数据加载中圆圈 -->
    <div class="coll-loading-box" v-if="classLoading == true">
      <van-loading color="#00a2ea"  />
    </div>
    <!-- 品牌知识 -->
    <Scroll
      v-else
      :update-data="[courseList]"
      class="home"
      ref="moduleScroll"
      :listenScroll='true'
      :probeType='3'
      :scrollX='false'
      :scrollY='true'
      :autoUpdate="false"
      @pullingDown="circleRefresh"
      @pullingUp="cyclicLoading">
      <div class="scroll" v-if='courseList.length>0'>

        <van-collapse v-model="activeNames">
          <div class='courseList' v-for="(item,index) in courseList" :key="index" >
            <van-collapse-item :value='item.courseType| formatType' :name="index">
              <template slot='title'>
                <span class='odiv'></span>
                <span class='courseTit'>{{item.courseName}}</span>
              </template>

              <div class='courseItem' v-for="(smallItem,idx) in item.chapterList" :key="idx" @click="toClassDetail(smallItem,item.id)">
                <span>PART{{idx+1}}：{{smallItem.chapterName}}</span>
                <span>{{smallItem.studyDuration}}</span>
              </div>

            </van-collapse-item>
            <div class='operateBox'>
              <div class="operateItem">
                <img src="static/images/icon/time.png" alt="">
                <span class="tab1">{{item.studyDuration}}</span>
              </div>
              <div class="operateItem">
                <img src="static/images/icon/top.png" alt="">
                <span class="tab2">{{item.examRankingMax}}分</span>
              </div>
              <!-- 先隐藏掉，看后续要不要再开发此功能 -->
              <!-- <div class="operateItem" @click="runking(item)">
                <img src="static/images/icon/runKing.png" alt="">
                <span class="tab3">排行榜</span>
              </div> -->
              <div class="operateItem" @click='toClassRecord(item)'>
                <img src="static/images/icon/lishi.png" alt="">
                <span class="tab4">查历史</span>
              </div>
              <div class="operateItem" @click="toCheck(item)">
                <img src="static/images/icon/ceyice.png" alt="">
                <span class="tab5">测一测</span>
              </div>
            </div>
          </div>
        </van-collapse>

      </div>
      <div v-else style="padding-top:0.5px;">
        <noGood></noGood>
      </div>
    </Scroll>
  </div>
</template>

<script>
import Header from "../../comps/header/header";
import backHeader from "../../comps/common/commonBackHeader";
import noGood from "../../comps/common/noGoods";
export default {
  name:'classList',
  components: { Header, backHeader,noGood },
  data() {
    return {
      activeTest:['1'],
      activeNames: ['1'],

      content: [],
      isActive: 0,
      courseList: [],
      pageSize: 10,
      pageNum: 1,
      classCount: 0,
      courseType:"",
      status: 0,
      classLoading: true,//加载效果
      chapterItem:null,  // 学习单元的项

      // scope接口传参时要求这样传，所以在data里直接这样定义了，之后动态修改cValue即可
      scopeList:[
        {
          cKey: "BAND",
          cValue: 657
        }
      ],
      subList:[
        {
          subNum: 10,
          subType: "1"
        }
      ],
      courseId:null
    };
  },
  created(){
    this.getCateList();
  },
  mounted() {
    this.queryCourseList();
  },
  activated(){
    this.getCateList();
    // 从首页过来的话需要重新请求课程列表的逻辑
    if(localStorage.loadClassFlag&&localStorage.loadClassFlag=='true'){
      this.isActive = 0;
      this.courseType='';
      this.pageNum = 1;
      this.courseList = [];
      this.queryCourseList();
      localStorage.removeItem('loadClassFlag');
    }

    // 获取单元学习时间的处理逻辑
    if(localStorage.learnStratTime){
      let courseLearnStratTime = Number(localStorage.learnStratTime);
      let courseLearnEndTime = new Date().getTime();
      // console.log('开始：',courseLearnStratTime,'结束：',courseLearnEndTime)
      let learnDuration = courseLearnEndTime - courseLearnStratTime;
      let duration = parseInt(learnDuration/1000);
      console.log("课程学习时长：",learnDuration,learnDuration/1000,parseInt(learnDuration/1000))
      localStorage.removeItem('learnStratTime');
      this.saveLearnDuration(duration);
    }
  },
  watch:{
    $route(to,from){}
  },
  // 过滤
  filters:{
    formatType(val){
      return val.join("/")//数组转字符用逗号隔开
    },
  },
  methods: {
    back() {
      this.$router.push({
        path:'/index'
      })
    },
    //排行榜跳转详情
    runking(item){
      this.$router.push({
        path: "/runking",
        query:{
          item:item,
        }
      });
    },
    // 微课堂查询历史记录
    toClassRecord(item){
      localStorage.checkRecordFlag = 'true';
      localStorage.dateName = item.courseName;
      localStorage.courseId = item.id;
      localStorage.topicCount = item.topicCount;  // 当前测试题目总数，>=10可进行测试，小于10不可测试
      localStorage.classInfo = JSON.stringify(item) ;
      this.$router.push({
        path:'/checkRecord',
        query:{
          item:item
        }
      })
    },
    // 跳转去测一测
    toCheck(item){
      // console.log("测一测item:",item);
      localStorage.dateName = item.courseName;
      localStorage.courseId = item.id;
      localStorage.toTestPath = 'classList';
      if(item.topicCount>=10){
        this.$router.push({
          path:'/taskTest',
          query:{
            courseInfo:item
          }
        })
      }else{
        this.$toast('测试题目未准备完毕，不能自测');
      }
    },
    changeAdd(item,i) {

      if(this.courseType != item){
        if(this.isActive != i){
          if(this.isActive < i){
            this.$refs.classTitScroll.scrollToElement(event.currentTarget,500);
          }else{
            if(!!event.currentTarget.previousElementSibling){
              this.$refs.classTitScroll.scrollToElement(event.currentTarget.previousElementSibling,500);
            }else{
              this.$refs.classTitScroll.scrollToElement(event.currentTarget,500);
            }
          }
        }

        this.isActive = i;

        if(item=="全部"){
          this.courseType=''
        }else{
          this.courseType = item;
        }
        this.pageNum = 1;
        this.classLoading = true;
        this.queryCourseList();
      }

    },
    toClassDetail(item,courseId) {
      console.log('课程单元的item:',item);

      localStorage.curCountStudyTime = item.courseDuration;   //以秒数为单位 单元学习的当前总时长，不包括本次点击所要学习的时长


      this.courseId = courseId;
      this.chapterItem = item;
      localStorage.learnStratTime = new Date().getTime();  // 当前单元开始学习时间
      localStorage.curChapterId = item.id;   // 当前学习单元id
      this.$router.push({
        path: "/classDetailPage",
        query:{
          item:item,
          courseId:courseId
        }
      });
    },
    // 课程列表查询
    queryCourseList() {
      let _this = this;
      let con = {
        userId: localStorage.userId,
        courseType: _this.courseType,
        status: _this.status,
        pageNum: _this.pageNum,
        pageSize: _this.pageSize,
        brandId: localStorage.brandId
      };
      let jsonParam = this.GLOBAL.g_paramJson(con);
      _this.$axios.post("/work/CourseInfo/getAppQueryCourse", jsonParam).then(function(res) {
        _this.classLoading = false;
        if (res.data.head.status == "0") {
          // 赋值给data
          // console.log(res.data);
          _this.classCount = res.data.body.count
          // 滚动加载分页判断
          if(_this.pageNum == 1){
            _this.courseList = res.data.body.resultList
          }else{
              _this.courseList = _this.courseList.concat( res.data.body.resultList);
          }
        } else {
          _this.$toast(res.data.head.msg);
        }
      })
      .catch(function(error) {
        console.log(error);
        // _this.$toast("接口调用失败");
      });
    },
    //上拉刷新，下拉加载，分页
    circleRefresh() {
      this.pageNum = 1;
      this.queryCourseList();
    },
    cyclicLoading() {
      if (this.courseList.length < this.classCount) {
        // console.log(this.collocationList.length , this.collTotal)
        this.pageNum++;
        this.queryCourseList();
      } else {
        // console.log(this.collocationList.length , this.collTotal)
        this.$refs.moduleScroll.update(true);
      }
    },
    // 顶部分类接口
    getCateList(){
      let _this = this;
      let con = {
       "userId":localStorage.userId,
        "brandId":localStorage.brandId,
        "type":"CURRICULUM",
      }
      // BS_TYPE_2 考核任务及题库类型
      // CURRICULUM 微课堂
      // SHOP_AFFAIR 店务类型
      // BRAND_MODULE 工作圈类型
      let jsonParam = _this.GLOBAL.g_paramJson(con,100009);
      _this.$axios.post("/goods/dictitemInfo/dictitemInfoAllMethod", jsonParam).then((res) => {
        // console.log("查询顶部类别列表成功-----",res.data.body);
        if(res.data.head.status == 0){
          _this.content = res.data.body.result;
          let obj = {dicttimeDisplayName: "全部"};
          _this.content.unshift(obj);
        }else{
          _this.$toast(res.data.head.msg);
        }
      }).catch(err=>{
        console.log(err)
      });
    },
    // 保存学习时长接口
    saveLearnDuration(duration){
      let _this = this;
      let con = {
        "userId":localStorage.userId,
        "chapterId": localStorage.curChapterId,
        "chapterDuration": duration,
        "courseId":this.courseId
      }
      // console.log('con:======',con)
      let jsonParam = _this.GLOBAL.g_paramJson(con);
      _this.$axios.post("work/chapterUser/updateChapterDuration", jsonParam).then((res) => {
        // console.log("保存学习时长接口成功-----",res.data.body);
        if(res.data.head.status == 0){
          // body为null,只需要针对学习时长做处理就好
          localStorage.removeItem('curChapterId');
          let durationFormat = '';
          let temp = '';
          let countTime = duration+Number(localStorage.curCountStudyTime);
          console.log("该单元总的学习秒数：====",duration,countTime);

          if(countTime>=86400){
            temp = Math.round(countTime/3600/24);   // Math.round()四舍五入取值
            durationFormat = `约${temp}天`;
          }else if(countTime>=3600){
            temp = Math.round(countTime/3600);
            durationFormat = `约${temp}小时`;
          }else if(countTime>=60){
            temp = Math.round(countTime/60);
            durationFormat = `约${temp}分钟`;
          }else if(countTime>0){
            temp = countTime;
            durationFormat = `约${temp}秒`;
          }
          // console.log('durationFormat:',durationFormat)
          _this.chapterItem.studyDuration = durationFormat
        }else{
          _this.$toast(res.data.head.msg);
        }
      }).catch(err=>{
        console.log(err)
      });
    }

  }
};
</script>

<style scoped lang="less">
@deep:~'>>>';
#classList {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .box {
    width: 100%;
    height: 1.2rem;
    line-height: 1.1rem;
    display: flex;
    background-color: #fff;
    border-bottom: 1px solid #f5f5f5;
    padding-left: 5px;
    .box-list {
      width: 100%;
      -webkit-box-flex: 1;
      flex: 1;
      overflow: hidden;
      display: flex;
      height: 1.1rem;
      align-content:space-between;
      box-sizing: border-box;

      .active {
        border-bottom: 2px solid #1978fe;
        color: #1978fe;
        font-size: 16px;
      }
      li {
        white-space: nowrap;
        font-size: 14px;
        color: #999;
        box-sizing: border-box;
        margin: 0 15px;
        height: 0.96rem;
      }

    }
  }
  .home {
    flex: 1;
    width: 100%;
    background-color: #f5f5f5;
    .scroll {
      -webkit-box-flex: 1;
      flex: 1;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      flex-direction: column;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      @{deep} .van-collapse{
        margin:0px 10px;
        box-sizing: border-box;
      }
      @{deep} .van-cell{
        height: 50px;
        line-height: 50px;
        .van-cell__title{
          font-size: 14px;
          color:#666;
        }
        .van-cell__value{
          font-size: 12px;
          color:#666;
        }
        .van-cell__right-icon{
          font-size: 14px;
          height: 50px;
          line-height: 50px;
        }
      }


      @{deep} .van-collapse-item__content{
        // padding:0px 10px;
        font-size: 12px;
        color:#666;
      }
      .courseList{
        margin:10px 0px;
        margin-bottom:20px;
        border: 0.5px solid #fff;
        border-radius: 6px;
        overflow: hidden;
        .odiv{
          display: inline-block;
          width:3px;
          margin-right: 8px;
          background:#1978FE;
          height:14px;
          vertical-align:baseline;
        }
        .courseTit{
          font-size: 14px;
          vertical-align:top;
        }

        .courseItem{
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          border-bottom: 0.5px solid #f3f3f3;
          justify-content: space-between;
        }
        .operateBox{
          background-color: #fff;
          padding:7px 0px;
          display: flex;
          .operateItem{
            flex:1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img{
              text-align: center;
              width:20px;
              object-fit: cover;
            }
            span {
              margin-top: 5px;
              font-size: 12px;
            }
            .tab5 {
              color: #5ea1fe;
            }
            .tab4 {
              color: #4fd5ac;
            }
            .tab2 {
              color: #ff8c7c;
            }
            .tab3 {
              color: #af9414;
            }
            .tab1 {
              color: #8a8a8a;
            }

          }
        }
      }

    }
  }
}
</style>
