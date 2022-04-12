<template>
    <div class="main">
      <search type='1' @search="search"></search>
      <div class="wrapper" ref="scrollView">
        <div class="content">
          <div class="style_box" v-for="(item,index) in searchList" :key="index" @click="toStyle(item.id)">
            <img :src="item.imgUrl">
            <p class="style_name">{{item.styleName}}</p>
            <p class="style_price">￥{{item.stylePrice}}</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import search from "../../comps/search/search"
export default {
  name: "",
  data() {
    return {
      value:"",
      searchList:[]
    };
  },
  methods:{
      search(val){
        let _this = this;
        _this.$axios.get("/api/style/search/"+val)
        .then(function(res){
          let data = res.data;
          if(data.code=="200"){
            _this.searchList = data.data;
          }
        })
        .catch(function(error){
          console.log(error);
        });
      },
      initOrReloadScroll(){
        let _this = this;
        _this.$nextTick(function(){
          if(!_this.scrollView){
            _this.scrollView = new _this.$BScroll(_this.$refs.scrollView,{
              scrollX:false,
              scrollY:true,
              click:true
            });
          }else{
            _this.scrollView.refresh();
          }
        });
      },
      toStyle(id){
        let _this = this;
        let route = {
          path:"/goodsDetail",
          query:{
            styleId:id
          }
        };
        _this.$router.push(route);
      }
  },
  components:{
    search
  },
  mounted(){

  },
  updated(){
    this.initOrReloadScroll();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{
  width: 100%;
  height:100%;
  background-color: #fff;
}
.wrapper{
  height:16.7rem;
  overflow: hidden;
  padding:0.2rem 0;
}
.content{

  display: flex;
  justify-content:space-between;
}
.style_box{
  /* display: flex; */
  background-color: #f0f0f0;
  width:49.5%;
  font-size:0.4rem;
  font-weight: 600;
  border: 0.02rem solid #dfd5d5;
}
.style_box img{
  width:100%;
}
.style_price{
  font-size: 0.5rem;
  color:#ff4c00;
}
</style>
