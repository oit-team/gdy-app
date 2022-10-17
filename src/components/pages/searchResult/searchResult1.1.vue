<template>
  <VueActions class="searchResultMain" data="searchResult" @touchmove.prevent>
    <div class="hd_select">
      <img src = "static/images/dev/back@2x.png" @click="back">
      <div class="hd_input_wrap">
        <span class="icon select"></span>
        <form style="width:100%" action="javascript:return true" @submit.prevent>
          <input
            v-model="value"
            ref="search"
            type="search"
            :placeholder="defaultValue"
            @input="$root.$emit('update:searchValue', $event.target.value)"
            @keyup.13="toSearch()"
          >
        </form>
      </div>
      <div class="search" @click="toSearch()">搜索</div>
    </div>

    <Scroll
      ref="searchResScroll"
      class="searchResBody"
      :update-data="[searchList]"
      :refresh-data="[]"
      :probeType = '3'
      :listenScroll='true'
      :scrollX='false'
      :scrollY='true'
      :autoUpdate="false"
      @pullingDown="rescollRefresh"
      @pullingUp="rescollLoadMore">
      <ul v-if="searchList.length>0" class="recommended">
        <!-- <li
          v-for="(item, key) in searchList"
          :key="key">
          <div class="rec_item" @click="toGoods(item.id)">
            <img
              width="100%"
              :src="item.imgUrl"
              alt="" @load="loadedImg()"
            >
            <div class="name">{{item.styleName}}</div>
            <p class="rec_bottom"><span class="price"><i style="">¥</i> {{item.stylePrice}}</span></p>
          </div>
        </li> -->
        <div v-for="(item,index) in searchList"
          :key="index"
          class="keyStyle-item fl"
          @click="toGoods(item.id)"
          v-actions:searchItem.click
          >
          <!-- @click="toGoods(item.id)" -->
          <div class="goods-img-box">
            <img class="goods-img"  :src="item.imgUrl" alt="">
          </div>
          <div class="goods-num">{{item.styleNo}}</div>
          <div class="goods-stylePrice">
            <div class='money-symbel'>¥{{item.stylePrice}}</div>
          </div>
        </div>
      </ul>
      <div v-else class="noData">
        <noGood></noGood>
      </div>
    </Scroll>

  </VueActions>
</template>

<script>
import util from '@/assets/js/util.js';
import loadAll from '../../comps/common/loadAll';
import noGood from "../../comps/common/noGoods";

export default {
  name: "",
  components:{ loadAll,noGood },
  data() {
    return {
      value:"",
      defaultValue:"毛衣",
      searchList:[{}],
      page:1,
      pageSize:12,
      isLoaded:true,
      isOver:false,
      resTotal:0,
    };
  },
  methods:{
    loadedImg(){
      // this.initOrReloadScroll();
    },
    back(){
      this.$router.go(-1);
      localStorage.removeItem("search");
    },
    toSearch(val){
      this.page=1;
      this.$refs.search.blur();
      this.search(val);
    },
    search(val){
      let _this = this;
      if(_this.value==""){
        _this.value =  _this.defaultValue;
      }
      if(_this.page==1){
        util.loading();
      }
      _this.$axios.get("/api/style/search/"+_this.value+"?currentPage="+_this.page+"&pageSize="+_this.pageSize+"&brandId="+localStorage.brandId)
      .then(function(res){
        let data = res.data;
        console.log(data)
        if(data.code=="200"){
          if(_this.page==1){
            _this.searchList = data.data.list;
          }else{
            _this.searchList = _this.searchList.concat(data.data.list);
          }
          _this.resTotal = data.data.total;

          // if(_this.searchList.length == _this.resTotal){
          //   _this.$refs.searchResScroll.update(true)
          // }
        }
      })
      .catch(function(error){
        console.log(error);
      });
    },

    // 搭配的上拉下拉
    rescollRefresh(){
      this.page = 1;
      this.search();
    },
    rescollLoadMore(){
      if(this.searchList.length < this.resTotal){
        // console.log(this.collocationList.length , this.collTotal)
        this.page++;
        this.search();
      }else{
        // console.log(this.collocationList.length , this.collTotal)
        this.$refs.searchResScroll.update(true)
      }
    },


    initOrReloadScroll(){
      let _this = this;
      _this.$nextTick(function(){
        if(!_this.scrollView){
          _this.scrollView = new _this.$BScroll(_this.$refs.scrollView,{
            scrollX:false,
            scrollY:true,
            click:true,
            probeType:3,
            useTransition:false,
          });
          _this.scrollView.on("scroll",(pos)=>{
            if(pos.y-_this.scrollView.maxScrollY<600 && _this.isLoaded && !_this.isOver){
              console.log(true);
              _this.isLoaded=false;
              _this.page++;
              _this.search();
            }
          });
        }else{
          _this.scrollView.refresh();
        }
      });
    },
    toGoods(id){
      let _this = this;
      let route = {
        path:"/goodsDetail2",
        query:{
          styleId:id,
          stamp:new Date().getTime()
        }
      };
      localStorage.search = _this.value;
      _this.$router.push(route);
    }
  },
  mounted(){
    let _this = this;
    let val = localStorage.search==null?_this.$route.query.value:localStorage.search;
    _this.value = val;
    _this.search(val);
  },
  updated(){
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.searchResultMain{
  width: 100%;
  height:100%;
  background-color: #f5f5f5;
  font-size:14px;
  color: #333333;
  display: flex;
  flex-direction: column;
}
.hd_select {
  display: flex;
  /* margin: 5px 0; */
  height: 1.4rem;
  align-items: center;
  padding:0px 12px;
}
.hd_select img{
  height:0.4rem;
}
.hd_input_wrap {
  border-radius: 16px;
  height: 32px;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex: 1;
  margin: 0 10px;
  padding: 0 10px;
  /* border:0.5px solid #ccc; */
  background-color: #fff;
}
.icon {
  width: 15px;
  height: 15px;
}
.hd_input_wrap input {
  background: transparent;
  border: 0;
  width: 100%;
  height: 20px;
  font-size: 12px;
  outline: none;
}
.hd_right_btn {
  margin: 8.5px;
  background: url("../../../../static/images/collocation/WechatIMG302.png")
    center / contain no-repeat;
}
.select {
  margin-right: 5px;
  background: url("../../../../static/images/collocation/select@2x.png") center /
    contain no-repeat;
}

.search_list{
  /* padding: 0 10.5px; */
  margin-top:10px;
  flex: 1;
  overflow: hidden;
  /* justify-content: space-between; */
}






.empty_box{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height:420px;
}
.empty_box img{
  width: 128px;
  height: 128px;
}
.empty_box div{
  margin-top: 20px;
  color: #bfbfbf;
}

.bottom-tip{
  margin:0 auto;
}


.searchResBody{
  flex:1;
  overflow: hidden;
}
.noData{
  padding-top:5px;
}
.recommended {
  display: flex;
  flex-wrap: wrap;
  padding: 0 2px 0 12px;
  box-sizing: border-box;
}
.recommended li {
  width: 50%;
  margin-bottom: 8px;
  /* border-radius: 8px; */
  overflow: hidden;
}
.rec_item {
  background: #fff;
  margin-right: 10px;
}
.rec_item .name {
  margin: 14.5px 11.5px 9.5px;
  font-size: 14px;
  font-family: ArialMT;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 16px;
  text-overflow: ellipsis;
}
.rec_item .rec_bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 11.5px 16.5px;
}
.rec_item .rec_bottom .price {
  font-size: 18px;
  font-family: KaiTi;
  font-weight: 400;
  color: rgba(184, 5, 2, 1);
  line-height: 16px;
}
.rec_item .rec_bottom i {
  font-size: 14px;
  font-style: normal;
}
.rec_item .people_buy {
  font-size: 12px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
  line-height: 16px;
}

.keyStyle-item{
  float:none;
  display: inline-block;  // 一行排多个
  vertical-align: top; //因高度不一致，靠顶部对齐

  width:31.2%;
  padding:0.5px;
  box-sizing: border-box;
  // border:0.5px solid #eee;
  margin-bottom: 6px;
  margin-right:2%;
  background-color: #fff;
  .goods-img-box{
    width:100%;
    position: relative;
    .goods-img{
      width:100%;
    }
    .addIcon{
      position: absolute;
      top:0;
      right:0;
      width:30px;
      height: 30px;
      // background-color: pink;
      color:#fff;
      font-size: 26px;
      line-height: 30px;
      text-align: center;
      img{
        width:25px;
        height: 25px;
        margin-top:2.5px;
      }
    }
    .tipBox{
      position: absolute;
      top:0;
      left:0;
      width:100%;
      img{
        width:14px;
      }
    }
  }
  .goods-num{
    text-align: center;
    font-size:12px;
    line-height: 20px;
    width:100%;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color:#666;
  }
  .goods-price{
    font-size:15px;
    color:#AF0005;
    line-height: 20px;
    .money-symbel{
      font-size:10px;
      margin:0px 2px;
    }
  }

  .goods-stylePrice{
    box-sizing: border-box;
    height: 20px;
    display: flex;
    justify-content:center;

    .money-symbel{
      display: inline-block;
      height:20px;
      line-height: 20px;
      font-size:14px;
      color:#AF0005;
    }
    .learnIcon{
      margin-left:4px;
    }
    .lastIcon{
      margin-left:4px;
      margin-top:1px;
    }

  }

}
.keyStyle-item:nth-child(3n+2){
  margin-bottom: 6px;
}
</style>
