<template>
  <div class="topic">
    <div class="listsBom" v-for="(item,index) in query.vResult" :key="index">
      <div v-if="item.img" class="listsTop">
        <img src="../../../../static/images/goodDetail/shopRec1.png">
      </div>
      <div class="listsBomTop">
        <div class="listsBomTopTop"><span class="listsBomTopTopSpan">{{item.rowId}}</span>/{{query.count}}</div>
        <div class="listsBomTopBom"><img class="listsBomTopTopImg" src="static/images/goodsTest/test35@2x.png" alt=""><span  ref="startTimer">{{time}}</span></div>
      </div>
      <div class="listsBomIn">{{item.content}}</div>
      <div class="listBomBom" v-for="(key,i) in item.answers" :key="i">
        <div class="listBomBomList">
          <div class="listIcon" :class="key.instanceId==activeId&&i == activeIndex?'active':''" @click="listIconShow(key.instanceId,i)">{{key.orderNum}}</div><div>{{key.orderContent}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:"topic",
  components:{},
  props:{
    msg:String
  },
  data() {
    return {
    }
  },
  methods:{
  }
}
</script>
<style lang="less">
.topic{
  width:100%;
  height:100%;
  margin-top:100px;
  box-sizing: border-box;
  img{
    width:80px;
    display: block;
    margin:0 auto;
  }
  .desc{
    font-size:14px;
    text-align: center;
    margin-top:20px;
    color:#666;
  }
  .empty_desc{
    font-size:14px;
    text-align: center;
    margin-top:20px;
  }
}
</style>
