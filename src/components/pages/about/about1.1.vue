<template>
  <div class="aboutMain" @touchmove.prevent>
    <!-- <div class=header>
      <div class="back_wrapper" @click="back"><img src="static/images/dev/back@2x.png"></div>
      <span>关于我们</span>
      <div class="back_wrapper"></div>
    </div> -->
    <Header :title="'关于我们'"></Header>

    <div class="aboutMain" ref="aboutScroll">
      <div class="about-con">

        <img src="static/images/login/logo.png" class="logoImg">
        <!-- <div class="logo-desc">
          <span>做</span><span>高</span><span>单</span><span>可</span><span>以</span><span>很</span><span>容</span><span>易</span>
        </div> -->
        <div class='about-desc'>

          <div class="brief-item" >拥抱科技，开启智慧零售新时代;</div>
          <div class="brief-item">轻松上手简单操作，快速成长，用业绩展示智慧零售新力量</div>
          <img src="static/images/about/about2.1.png" alt="" class="descImg">
          <div><span class="dot"></span><span class="item-desc">商品知识、组合搭配，随时学习，迅速掌握</span></div>
          <div><span class="dot"></span><span class="item-desc">哪款不会搜哪款，卖点解析、搭配截读轻松掌握</span></div>
          <div><span class="dot"></span><span class="item-desc">主款搭配？高单易为您全面展现......</span></div>
          <div><span class="dot"></span><span class="item-desc">介绍商品？卖点讲解，标准话术全在这里......</span></div>
          <div><span class="dot"></span><span class="item-desc">满足顾客不同场合的穿搭需求?高单易给你提供优选方案</span></div>
          <div>......</div>
          <div class="expectForUse">更多功能,期待您的使用</div>
        </div>

      </div>
    </div>

    <div class="fix_box">
      <div class="agreement-box">
        <span class="service_agreement" @click="toServiceAgreement">用户协议</span>
        <span class="divideLine">|</span>
        <span class="privacy_policy" @click="toPrivacyPolicy">隐私协议</span>
      </div>

      <div class="copy-right">Copyright @2020 高单易网络科技 版权所有</div>
    </div>
  </div>
</template>

<script>
import Header from '../../comps/header/header';
export default {
  name: "",
  components:{Header},
  data() {
    return {

    };
  },
  methods:{
    back(){
      this.$router.go(-1);
    },
    toServiceAgreement(){
      console.log("toServiceAgreement");
      this.$router.push({
        path:'/serviceAggrement'
      });
    },
    toPrivacyPolicy(){
      console.log("toPrivacyPolicy");
      this.$router.push({
        path:'/privacyPolicy'
      });
    },
    initAboutScroll(){
      let _this = this;
      _this.$nextTick(()=>{
        if(!_this.aboutScroll){
          _this.aboutScroll = new _this.$BScroll(_this.$refs.aboutScroll,{
            scrollX:false,
            scrollY:true,
            click:true,
            probeType:3,
            useTransition:false,
          });
          _this.aboutScroll.on('scroll', (pos) => {
            // console.log(pos)
            // console.log("scroll",pos.y,_this.aboutScroll.maxScrollY,pos.y-_this.aboutScroll.maxScrollY)
            if(pos.y-_this.aboutScroll.maxScrollY <= 0){
              _this.aboutScroll.refresh();
            }
          })

          // console.log(_this.aboutScroll)
        }else{
          _this.aboutScroll.refresh();
        }
      })
    },
  },
  mounted(){
    this.initAboutScroll()
  },
  updated(){
    // this.initAboutScroll()
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.aboutMain{
  background:#fff;
  color: #333333;
  font-family:PingFang-SC-Medium;
  font-size: 14px;
  align-items: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
// .header{
//   width: 100%;
//   height:1rem;
//   padding:0 0.4rem;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   font-size: 18px;
//   flex-shrink: 0;
//   /* flex:0; */
//   background-color: #f5f5f5;
// }
// .header img{
//   height: 0.4rem;
// }
// .header .back_wrapper{
//   height: 1rem;
//   width: 1rem;
//   display: flex;
//   justify-self: center;
//   align-items: center;
// }
// .header .back_wrapper img{
//   height: 0.4rem;
//   margin-left:0.4rem;
// }
.aboutMain{
   width: 100vw;
  flex: 1;
  overflow: hidden;
  box-sizing:border-box;
  .about-con{
    text-align: center;
    .logoImg{
      width:33%;
      margin-top:32.5px;
    }
    .logo-desc{
      margin:0 auto;
      width:33%;
      color:#7F7F7F;
      font-size:12px;
      margin-bottom:20px;
      display: flex;
      justify-content: space-between;
    }
    .about-desc{
      color:#1a1a1a;
      font-size:12px;
      .brief-item{
        font-size:14px;
      }
      .descImg{
        width:80%;
        margin:15px 0px;
      }
      div{
        line-height: 26px;
        .dot{
          margin-bottom:2.5px;
          margin-right:3px;
          box-sizing:border-box;
          display: inline-block;
          width:4px;
          height:4px;
          border-radius:50%;
          background-color: #1978FE;
        }
        .item-desc{

        }
      }
      .expectForUse{
        margin-top:20px;
        padding-bottom:10px;
      }
    }
  }
}


.fix_box{
  box-sizing:border-box;
  border-top:0.5px solid #eee;
  padding-top:0.1rem;
  height:1.4rem;
  width:100%;
  div{
    text-align: center;
  }
  .agreement-box{
    .service_agreement,.privacy_policy{
      color:#1978FE;
      border-bottom:1px solid #1978FE;
    }
    .divideLine{
      margin:0px 5px;
    }

  }
}



</style>
