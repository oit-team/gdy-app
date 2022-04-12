<template>
  <div id="collList">
    <!-- 搭配list -->
    <Scroll
      class="collBody"
      ref="collBodyScroll"
      :probeType = '3'
      :bounceTime = "0"
      :listenScroll = 'true'
      :pullDown="false"
      :pullUp="false"
    >
      <div class="brandRecList">
        <!-- <h1>品牌推荐</h1> -->
        <div class="brandItem" v-for="(item,index) in collListData" :key="index" >
          <img :src="item.imgUrl" alt="" @click="toStyleDetail(item.id)">
          <div class="collLabel">{{item.collName}}</div>
 
          <Scroll
            class="collItemScroll"
            :ref="'collItemScroll'+(index+1)"
            :probeType='3'
            :scrollX='true'
            :scrollY='false'
            :autoUpdate="true"
            :pullDown="false"
            :pullUp="false">
            <!-- 滚动的内容 -->
            <div class="imgList">
              <!-- <img class="navItem" v-for="(item,index) in item.styleList" :key="index" @click="toGoodsDetail(item.id)" :src="item.imgUrl" alt=""> -->
              <div class="imgBox" v-for="(item,index) in item.styleList" :key="index" @click="toGoodsDetail(item.id)">
                <img :src="item.imgUrl" alt="">
              </div>
            </div>
          </Scroll>
        </div>  
      </div>
    </Scroll>
  </div>
</template>
<script>
export default {
  name:'',
  components:{},
  props:['collListData'],
  data(){
    return {

    }
  },
  mounted(){
    // console.log(this.collListData)
  },
  methods:{
    toStyleDetail(val){
      let _this = this;
      _this.$router.push({path:"/styleDetail",query:{"collId":val,stemp:new Date().getTime()}});
    },
    toGoodsDetail(val){
      let _this = this;
      let route = {
        path:"/goodsDetail2",
        query:{
          styleId:val,
          stamp:new Date().getTime()
        }
      }
      _this.$router.push(route);
    },

  }
}
</script>
<style scoped lang="less">
#collList{
  width:100%;
  height:100%;
  display: flex;
  flex-direction: column;
  font-size:14px;
  color:#333;
  align-items: center;
  padding-top:5px;
  
  .collBody{
    flex: 1;
    overflow: hidden;
    .brandRecList{
      padding-left:3%;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      .brandItem{
        width:47%;
        margin-right:3%;
        margin-bottom:10px;
        background-color: #fff;
        border-radius: 12px;
        overflow: hidden;
        img{
          width:100%;
          display: block;
        }
        .collLabel{
          font-size: 12px;
          line-height: 30px;
        }

        .collItemScroll {
          width:100%;
          height: 1.0rem;
          line-height: 1rem;
          display: flex;
          margin-bottom:10px; 
          .imgList{
            flex:1;
            overflow: hidden;
            display: flex;
            height: 1.0rem;
            .imgBox{
              height: 1.0rem;
              font-size: 14px;
              margin-right:10px;
              width:50px;
              // object-fit: ;
              height: 50px;
              img{
                width:100%;
              }
            }
            .imgBox:last-child{
              margin-right:0px;
            }
          }
        }

      }
    }
  }
}

</style>
