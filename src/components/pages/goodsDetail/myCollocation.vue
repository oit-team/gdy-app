<template>
  <VueActions id="myCollocation" data="collocations">
    <div class="headBox">
      <backHeader title="我要搭配" style="background-color: #fff;">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right">
          <slot>
            <img class="add-icon" src="static/images/icon/addColl.png" alt="">
          </slot>
        </span>
      </backHeader>
    </div>
    <div class="tabBox">
      <div class="tabItem"
        v-for="(item,index) in tabList"
        :key="index"
        @click="clickTab(item.id)"
        :class="tabActiveId == item.id?'active':''">{{item.name}}({{item.nums}})</div>
    </div>
    <div style="height:6px;background-color: #f5f5f5;"></div>

    <div v-if="collLoading == true" key='1'>
      <van-loading color="#00a2ea"  />
    </div>
    <Scroll
      v-else
      :update-data="[collList]"
      :refresh-data="[]"
      class="collBody"
      ref="collBodyScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      key="2"
      >
      <!-- @pullingDown="collRefresh"
      @pullingUp="collLoadMore" -->
      <div class="collListBox" v-if="collList.length > 0">
        <div class="item" v-for="i in 5" :key="i" @click="toCollDetail(i)">
          <img class="collImg" src="../../../../static/images/goodDetail/coll003.jpg" alt="">
          <div class="collDesc">工作服颜色很正，码数也很标准，上身很合适，显得人特别的端正</div>
        </div>
      </div>
      <div style="padding-top:0.5px;" v-else>
        <noGood></noGood>
      </div>
    </Scroll>




  </VueActions>
</template>
<script>
import Header from '../../comps/header/header';
import backHeader from '../../comps/common/commonBackHeader';
import noGood from "../../comps/common/noGoods";
export default {
  name:'myCollocation',
  components:{ Header , backHeader ,noGood },
  data(){
    return {
      tabActiveId:0,
      tabList:[
        {
          id:0,
          name:'已保存',
          nums:1
        },
        {
          id:1,
          name:'审核中',
          nums:3
        },
        {
          id:2,
          name:'已发布',
          nums:105
        }
      ],
      collLoading:true,
      collList:[
        {
          id:0,
          desc:'工作服颜色很正，码数也很标准，上身很合适，显得人特别的端正',
          imgUrl:require('../../../../static/images/goodDetail/coll003.jpg')
        },
        {
          id:1,
          desc:'工作服颜色很正，码数也很标准，上身很合适，显得人特别的端正',
          imgUrl:require('../../../../static/images/goodDetail/coll003.jpg')
        },
        {
          id:2,
          desc:'工作服颜色很正，码数也很标准，上身很合适，显得人特别的端正',
          imgUrl:require('../../../../static/images/goodDetail/coll003.jpg')
        },
        {
          id:3,
          desc:'工作服颜色很正，码数也很标准，上身很合适，显得人特别的端正',
          imgUrl:require('../../../../static/images/goodDetail/coll003.jpg')
        },
        {
          id:4,
          desc:'工作服颜色很正，码数也很标准，上身很合适，显得人特别的端正',
          imgUrl:require('../../../../static/images/goodDetail/coll003.jpg')
        }
      ],
      collTotal:0,

    }
  },
  created(){},
  mounted(){
    this.getCollList();
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    clickTab(id){
      this.tabActiveId = id;
    },
    // 去我要搭配详情页面
    toCollDetail(item){
      // console.log("搭配详情=====",item)
      this.$router.push({path:'/shopCollDetail',query:{ collId:1950,stemp:new Date().getTime()}})
    },
    getCollList(){
      this.collLoading = false;

    },
    collRefresh(){
      this.page = 1;
      this.getCollList();
    },
    collLoadMore(){
      if(this.collList.length < this.collTotal){
        // console.log(this.collocationList.length , this.collTotal)
        this.page++;
        this.getCollList();
      }else{
        // console.log(this.collocationList.length , this.collTotal)
        this.$refs.collBodyScroll.update(true)
      }
    },

  }
}
</script>
<style lang="less" scoped>
#myCollocation{
  width:100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .headBox{
    height: 1.4rem;
  }
  .tabBox{
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 45px;
    line-height: 45px;
    // background-color: #ccc;
    border:0.5px solid #ccc;
    .tabItem{
      font-size: 14px;
    }
    .tabItem.active{
      color:#1978FE;

    }
  }
  .collBody{
    flex:1;
    overflow: hidden;
    background-color: #f5f5f5;
    padding-left:10px;
    padding-top:10px;

    .collListBox{
      width:100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      .item{
        width:47%;
        margin-right:10px;
        margin-bottom:10px;
        border-radius: 6px;
        overflow: hidden;
        background-color: #fff;
        .collImg{
          width:100%;
          display: block;
        }
        .collDesc{
          padding:3px 6px;
          box-sizing: border-box;
          width:100%;
          font-size: 14px;
          line-height: 22px;

          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 2;
        }
      }
    }
  }
}

</style>
