<template>
  <div id="run">
    <div class="headBox">
      <backHeader :title="tit" style="background-color: #f5f5f5;">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right"></span>
      </backHeader>
    </div>

    <Scroll
      :update-data="[rankList]"
      class="rankScrollBox"
      ref="rankListScroll"
      :listenScroll='true'
      :probeType='3'
      :scrollX='false'
      :scrollY='true'
      :autoUpdate="false"
      @pullingDown="runRefresh"
      @pullingUp="runLoading">

      <div class="content" v-if="rankList.length>0">
        <div class="rankList" v-for="(item,index) in rankList" :key="index">
          <div class="checkedSelect">
          用户：
          </div>
          <span class="user">{{item.userName}}</span>
          <span class="run">{{item.examRankingMax}}分</span>
          </div>
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
  name: "run",
  components: { Header, backHeader ,noGood},
  data() {
    return{
      tit:'',
      pageNum:1,
      pageSize:10,
      rankCount:20,
      courseId:null,
      rankList:[]


    }

  },
  mounted() {},
  activated(){
    console.log(this.$route.query.item);
    this.tit = this.$route.query.item.courseName;
    this.courseId = this.$route.query.item.id;
    this.getRankList()

  },
  methods:{
    back() {
      this.$router.go(-1)
    },
    // 获取排行榜列表
    getRankList(){
      let _this = this;
      let con = {
        userId: localStorage.userId,
        courseId: _this.courseId,
        pageNum: _this.pageNum,
        pageSize: _this.pageSize,
        bsCode: localStorage.brandIdGDY,
      };
      let jsonParam = this.GLOBAL.g_paramJson(con);
      _this.$axios.post("/task/taskManage/getUserMaxFraction", jsonParam).then(function(res) {
        console.log("获取排行榜列表：",res.data.body);
        if (res.data.head.status == "0") {
          // 赋值给data
          _this.rankCount = res.data.body.count
          if(_this.pageNum == 1){
            _this.rankList = res.data.body.resultList
          }else{
            _this.rankList = _this.rankList.concat( res.data.body.resultList);
          }
        } else {
          _this.$toast(res.data.message);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    runRefresh(){
      this.pageNum = 1;
      this.getRankList();
    },
    runLoading(){
       if (this.rankList.length < this.rankCount) {
        // console.log(this.collocationList.length , this.collTotal)
        this.pageNum++;
        this.getRankList();
      } else {
        // console.log(this.collocationList.length , this.collTotal)
        this.$refs.rankListScroll.update(true);
      }

    }
  }

}
</script>

<style scoped lang="less">
#run {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .headBox {
    height: 1.4rem;
  }
  .rankScrollBox{
    width: 100%;
    flex: 1;
    overflow: hidden;
    background-color: #fff;
    .content{
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      background: #fff;
      .rankList{
        display: flex;
        width: 100%;
        height: 65px;
        text-align: center;
        border-top: 0.5px solid #e3e3e3;
        font-size: 14px;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px 0 20px;
        box-sizing: border-box;
        .checkedSelect{
          text-align: center;
          margin: 4px 10px 0 10px;
        }
        .checkedSelect>img{
          width: 15px;
          height: 15px;

        }
        .user{
          color: #999;
          margin-right: auto;
        }
        .run{
          color: #F8736E;
        }
        span{
          display: block;
        }


      }

    }
  }
}

</style>
