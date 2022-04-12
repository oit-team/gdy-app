<template>
  <!-- app并没用到该页面，可删除 -->
  <div id="topicCatalog">
    <div>
      <Header class="header" title="目录"></Header>
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
      <div class="bodys">
        <div class="bodysTop">{{displayName +' '+ title.name}}</div>
        <div class="bodysBom" >
          <div class="bodysBomIn" v-for="(item,index) in catalog">
            <div class="bodysBomInIn" v-for="(item,index) in item.catalog">{{1}}</div>
          </div>
        </div>
      </div>
    </Scroll>
    <div class="footer" >
      <van-button class="startBtn" round type="info" @click="seeResult">交卷并查看结果</van-button>
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
  name:'topicCatalog',
  components:{ Header , backHeader ,noGood},
  data(){
    return {
      topicCatalogLoading: true,
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
  },
  watch:{
  },
  methods:{
    seeResult(){
      this.$router.push({
        path:"./testReport",
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
@import "../../../assets/pageCss/topicCatalog";
</style>
