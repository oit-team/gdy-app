<template>
  <div class="searchMain" @touchmove.prevent>
    <!-- 头部搜索框 -->
    <div class="hd_select">
      <img src = "static/images/dev/back@2x.png" @click="back">
      <div class="hd_input_wrap">
        <span class="icon select"></span>
        <form style="width:100%" action="javascript:return true" @submit.prevent>
          <input v-model="value" ref="search" type="search" :placeholder="defaultValue" @keyup.13="search()" >
        </form>
      </div>
      <div class="search" @click="search()">搜索</div>
    </div>

    <!-- 搜索发现的接口还没写，先保留之前的样式 -->
    <div class="hot_search">
      热门搜索
    </div>
    <div class="search_list">
      <span v-for="(item, index) in hotWords" :key="index" :style="'backgroundColor:'+item.color" @click="search(item.name)">{{item.name}}</span>
    </div>

    <!-- <div class="historyBox">
      <div class="top">
        <span class='tit'>搜索历史</span>
        <span class="delIcon">删除</span>
      </div>
      <div class="hisList">
        <div class="item" v-for="(item,index) in hisList" :key="index" @click="search(item)">{{item}}</div>
      </div>
    </div>

    <div class="hotBox">
      <div class="tit">搜索发现</div>
      <div class="hotList">
        <div class="item" v-for="(item,index) in hotList" :key="index" @click="search(item)">{{item}}</div>
      </div>
    </div> -->



  </div>
</template>

<script>
export default {
  name: "",

  data() {
    return {
      value:"",
      defaultValue:"外套",
      searchList:[],
      hisList:['复古回溯','摩登都市','裤子','小香风','8M1JDY','连衣裙','通勤装'],
      hotList:['针织衫','T恤','内搭衫','冬一波','连衣裙','浪漫邂逅','半身裙','2020年11月新款'],
      hotWords:[
        {name:"外套",value:1,color:"#f4f7ea"},
        {name:"风衣",value:1,color:"#eef8fa"},
        {name:"大衣",value:1,color:"#fbedfe"},
        {name:"衬衫",value:1,color:"#edeafb"},
        {name:"半裙",value:1,color:"#ffdfd6"},
        {name:"连衣裙",value:1,color:"#f6eed2"},
        {name:"内搭衫",value:1,color:"#ecf8d1"},
        {name:"针织衫",value:1,color:"#f2e5d3"},
        {name:"T恤",value:1,color:"#e1e3e9"},
        {name:"裤",value:1,color:"#fefcde"}
      ]
    };
  },
  created() {
    this.$root.$on('update:searchValue', this.setValue)
  },
  destroyed() {
    this.$root.$off('update:searchValue', this.setValue)
  },
  methods:{
    back(){
      this.$router.go(-1);
    },
    changfouce(){
      // this.$nextTick(()=>{   //正确写法
      //   this.$refs.search.focus();
      // })
      // 在上述代码之后重新调用了加载页面数据的方法，发现该方法导致页面效果有误，具体解决办法用延时器
      // ps;延时时间不能过短，因为有页面重新渲染效果，延时时间过短会导致延时不在生效！
      // 最后，该方法在ios中不可用，因为ios为了保护安全，禁止自动获取输入框focus方法！

      setTimeout(()=>{
        this.$refs.search.focus();
      },800)
    },
    search(val){
      let _this = this;
      let value = "";
      if(val!=null){
        value=val;
        _this.value = val
      }else{
        value = _this.value;
      }
      if(value==""){
        value = _this.defaultValue;
      }
      let route = {
        path:"/searchResult",
        query:{
          value:value,
          stamp:new Date().getTime()
        }
      }
      _this.$refs.search.blur();
      _this.$router.push(route);
    },
    setValue(e) {
      this.value = e
    }
  },
  components:{
  },
  mounted(){
  },
  updated(){
    // this.initOrReloadScroll();
  },
  activated(){
    this.changfouce()
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../../assets/pageCss/search";

</style>
