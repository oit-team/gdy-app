<template>
  <VueActions id="taskTopicCatalog" data="taskTopic">

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
      class="topicCatalogCon"
      ref="topicCatalogScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      :pullDown="false"
      :pullUp="false">
      <!-- 测试过程点击目录进入 -->
      <div class="bodys" v-if="jiexi!=1" key="isJieXi">
        <!-- <div class="bodysTop"></div> -->
        <div class="bodysBom">
          <div class="bodysBomIn" v-for="(item,index) in query.vResult" @click="topicShow(item,index)" :key="index" v-actions:bomIn.click.duration>
            <div class="bodysBomInIn" :class="item.age?'active':''">{{index+1}}</div>
          </div>
        </div>
        <!-- <div class="bodysBom" v-else> -->
          <!-- <div class="bodysBomIn" v-for="(item,index) in query.list" @click="topicShow(item,index)" :key="index">
            <div class="bodysBomInIn"  :class="item.age?'active':''">{{index+1}}</div>
          </div> -->
        <!-- </div> -->
      </div>
      <!-- 解析进入 -->
      <div class="bodys" v-else key="goInAnalyse">
        <!-- 解析 -->
        <div class="bodysBom" >
          <div class="bodysBomIn" v-for="(item,index) in tastReportList.list" @click="topicShow(item,index)" :key="index" v-actions:topicShow.click.duration>
            <span class="bodysBomInIn" :class="item.correct ==1 ?'oactive':item.correct ==3? 'vactive':'xactive'">{{index+1}}</span>
          </div>
        </div>
      </div>
    </Scroll>
    <!-- <div class="footer" >
      <van-button class="startBtn" round type="info" @click="seeResult">交卷并查看结果</van-button>
    </div> -->
  </VueActions>
</template>
<script>
import { Dialog } from 'vant';
import { Toast } from 'mint-ui';
import Header from '../../comps/header/header';
import backHeader from '../../comps/common/commonBackHeader';
import noGood from "../../comps/common/noGoods";
export default {
  name:'taskTopicCatalog',
  components:{ Header , backHeader ,noGood},
  data(){
    return {
      topicCatalogLoading: true,
      activeId:3,
      displayName:"2020冬",
      title:"Z9",
      query:{
        vResult:[{}]
      },
      panams:"",
      jiexi:"",
      student:"",
      tastReportList:[],
      BACHID:"",

      dateName:'',
    }
  },
  created(){},
  mounted(){},
  activated(){
    this.dateName = localStorage.dateName;
    if(this.$route.query.item){
      this.query = this.$route.query.item;
    }
    this.jiexi = this.$route.query.jiexi;
    this.panams = this.$route.query.panams;//已选择list
    this.tastReportList = this.$route.query.ana;
    this.BACHID = this.$route.query.BACHID;//解析需要的批次号
    if(this.$route.query.item){
      this.topicSize()
    }



  },
  watch:{

  },
  methods:{
    //判断本题是否已做（初始加载）
    topicSize(){
      for(let a=0;a<this.query.vResult.length;a++){
        for(let b=0;b<this.panams.length;b++){
          if(this.query.vResult[a].instanceId == this.panams[b].instanceId){
            this.$set(this.query.vResult[a],"age", 1)
          }
        }
      }
    },
    // 返回
    back(){
      // // jiexi存不存在都要返回上一页的
      localStorage.testFlag = 'true';
      setTimeout(()=>{
        localStorage.removeItem("testFlag");
      },3000)
      this.$router.go(-1)
    },
    // 点击跳转至第几题
    topicShow(item,index){
      // console.log("跳转信息=====",item,index)
      localStorage.testFlag = 'true';
      setTimeout(()=>{
        localStorage.removeItem("testFlag");
      },3000)
      localStorage.curTestNum = index;   // 点击目录记录对应测试题目的num
      this.$router.go(-1)
    },
  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/taskTopicCatalog";
</style>
