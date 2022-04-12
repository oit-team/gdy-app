<template>
  <div class="popup" ref="popup" style="display:none">
    <div class="popup_main" :class="{fadein:isShow}" >
      <!-- <div class="title">
        <span>{{title}}</span>
      </div> -->
      <div class="popupTit">
        <slot name="popupTit"></slot>
      </div>
      <div class="popupTop">
        <slot name="popupTop"></slot>
        <div class="closeBtn">
          <img @click="close" src="static/images/icon/cancelIcon.png" alt="">
        </div>
      </div>

      <div ref="popupMain" class="body">
        <slot name="popupBody"></slot>
      </div>
      <!-- <div class="popup_btn" @click="close">
        <div>完成</div>
      </div> -->
    </div>
    <div class="bg" @click="close"></div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      isShow:false,
    };
  },
  methods:{
    close(){
      let _this = this;
      _this.isShow=false;
      setTimeout(function(){
        _this.$refs.popup.style.display = 'none'
      },200);
    },
    show(){
      this.$refs.popup.style.display = 'block';
      this.isShow=true;
      this.initScroll();
    },
    initScroll(){
      let _this = this;
      if(!_this.popScroll){
        _this.popScroll = new _this.$BScroll(_this.$refs.popupMain,{
          scrollY:true,
          scrollX:false,
          useTransition:false,
          preventDefaultException:{className:/(^|\s)bs_prevent(\s|$)/}
        });
      }else{
        _this.popScroll.refresh();
      }
    }
  },
  mounted(){

  },
  props:{
    title:{
      type:String,
      default:"商品基础信息"
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@deep:~'>>>';
.popup{
  width: 100vw;
  font-size: 14px;
}
.bg{
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: .5;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2019
}
.popup_main{
  height: 70vh;
  position: fixed;
  z-index: 2020;
  width: 100%;
  transition: .2s ease-out;
  top: 100%;
  background-color: #fff;
  border-top-left-radius: 7.5px;
  border-top-right-radius: 7.5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.fadein{
  transform: translateY(-100%);
}
.title{
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  flex-shrink: 0;
  font-size: 15px;
  font-weight:600;
}
.popupTit {
  width:100%;
  .tit{
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    font-weight:600;
  }
}

.popupTop{
  // background-color: pink;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .closeBtn{
    width:23px;
    // height: 20px;
    margin-right:10px;
    margin-left:auto;
    // background-color: red;
    img{
      width:100%;
      height: 100%;
    }
  }

}
.body{
  overflow: hidden;
  flex: 1;
}
.popup_btn{
  height: 66.5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup_btn div{
  width: 344.5px;
  height: 42.5px;
  border-radius: 21.5px;
  background-color: #00a2ea;
  font-size: 18px;
  display: inherit;
  color: #fff;
  font-weight: 40000;
  justify-content: center;
  align-items: center;
}



.popup_main ul{
  padding: 0 26.5px;
}

.popup_main li{
  display: flex;
  padding:12.5px 0;
  line-height: 26px;
  letter-spacing:1px;
  border-bottom: 0.5px #E1E1E1 dashed;
}
.popup_main li span:first-child{

  letter-spacing:5px;
}
.popup_main .style_label_li{

}
.style_label_li .label_name{
  /* width:58px; */
  margin-right: 0.8rem;
}
.style_label_li .label_con{
  flex:1;
}

.popup_main li:not(.style_label_li)>span:first-child{
  margin-right: 30px;
}
.popup_main li>span{
  /* color: #636363; */
}
.popup_main li>span:last-child{
  flex: 1;
  word-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap !important;
  color: #636363;
}

.popup_main .sell-list{
  padding: 0 18px;
  padding-top:10px;
}
.sell-item:last-child{
  margin-bottom:15px;
}
.sell-list .sell-item-tit{
  color:#000;
  display: flex;
  align-items: center;
  margin:8px 0px;
}
.sell-list .sell-item-tit img{
  width:15px;
  height:15px;
  margin-right:4px;
  box-sizing:border-box;
}
.sell-list .sell-item-inner{
  // padding: 0 18px;
  color:#666;
  line-height: 35px;
  letter-spacing: 1px;
  text-align:justify;
  // ol li{
  //   list-style-type: decimal ;
  //   margin: 0 10px ;
  // }
  // ul li{
  //   list-style-type: disc ;
  //   margin: 0 10px ;
  // }
}
@{deep} .sell-list .sell-item-inner ol li{
  list-style-type: decimal ;
  margin: 0 15px ;
}
@{deep} .sell-list .sell-item-inner ul li{
  list-style-type: disc ;
  margin: 0 15px ;
}
.popup {
  // 商品详情弹出框
  .basicTop{
    width:100%;
    padding:18px 15px;
    border-bottom:0.5px solid #f5f5f5;
    color:#999;
    span{
      margin-right:10px;
      font-size: 14px;
      color:#999;
    }
    .active{
      font-size: 16px;
      color:#1978FE;
      padding-bottom:4px;
      border-bottom:2px solid #1978FE;
    }
  }
  .baseone{
    height:100%;
    >div{
      display: flex;
      // justify-content: space-between;
      // height: 50px;
      // line-height: 50px;
      padding:16px 15px;
      font-size:16px;
      border-bottom:0.5px solid #f5f5f5;
      .tit{
        color:#333;
        width:20%;
        // background-color: pink;
      }
      .inner{
        color:#999;
        width:80%;
        text-align: left;
      }
      @{deep} .maintain ol li{
        list-style-type: decimal ;
        // margin: 0 15px ;
      }
      @{deep} .maintain ul li{
        list-style-type: disc ;
        // margin: 0 15px ;
      }
    }
  }
}
</style>
