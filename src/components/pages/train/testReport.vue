<template>
  <!-- app并没用到该页面，可删除 -->
  <div id="testReport">
    <div>
      <Header class="header" title="测试报告"></Header>
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
            percentNum="80"
            speed="3"
            size="120"
            color="#1978FE"
            backgroundColor="#E8F1FE"
            content="正确率"
          >
          </Radial>
        </div>
        <div class="bodysTop">
          <div class="lists" v-for="item in testReportList" :key="item.id">
            <div class="listsTop">
              <img :src="item.icon">
            </div>
            <div class="listsBom">
              <div class="tspan">{{item.name}}</div>
              <div class="bspan">{{item.num}}</div>
            </div>
          </div>
        </div>
        <div class="bodysBom" >
          <div class="bodysBomIn" v-for="(item,index) in catalog">
            <div class="bodysBomInIn" v-for="(item,index) in item.catalog">{{1}}</div>
          </div>
        </div>
      </div>
    </Scroll>
    <div class="footer" >
      <van-button class="startBtn" round type="info" @click="startTesting">题目解析</van-button>
      <van-button class="testBtn" round type="info" plain @click="startTesting">再测一次</van-button>
      <van-button class="signOutBtn" round  @click="signOutShow">退出</van-button>
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
  name:'testReport',
  components:{ Header , backHeader ,noGood ,Radial},
  data(){
    return {
      testReportLoading: true,
      testReportList:
      [
        {
          icon:"/static/images/goodsTest/test44@2x.png",
          name:"考核系列",
          num:"",
        },
        {
          icon:"/static/images/goodsTest/test35@2x.png",
          name:"用时",
          num:"2分32秒",
        },
      ],
      activeId:3,
      displayName:"2020冬",
      title:"Z9",
      catalog:[
        {
          catalog:[
            {index:1,},
            {index:1,},
            {index:1,},
            {index:1,},
            {index:1,},
          ]
        },
        {
          catalog:[
            {index:1,},
            {index:1,},
            {index:1,},
            {index:1,},
            {index:1,},
          ]
        },
        {
          catalog:[
            {index:1,},
            {index:1,},
            {index:1,},
            {index:1,},
            {index:1,},
          ]
        },
      ],
    }
  },
  created(){

  },
  mounted(){

  },
  activated(){
    this.displayName = this.$route.query.displayName
    this.title = this.$route.query.item
    this.testReportList[0].num = this.displayName + " " + this.title.name
  },
  watch:{
  },
  methods:{
    // 退出
    signOutShow(){
      this.$router.push({
        path:"./index",
        query:{

        }
      })
    },
    startTesting(){
      this.$router.push({
        path:"./goodsTestTopic",
        query:{
          displayName:this.displayName,
          item:this.title
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/testReport";
</style>
