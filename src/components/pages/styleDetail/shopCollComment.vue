<template>
  <VueActions id="shopCollComment" data="comment">
    <div class="headBox">
      <backHeader title="店铺搭配评论">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right">
          <!-- <slot>
            <img class="add-icon" src="static/images/icon/addColl.png" alt="">
          </slot> -->
        </span>
      </backHeader>
    </div>

    <!-- <div class="commentBody"></div> -->
    <!-- <div v-if="!styleListFlag"><van-loading color="#00a2ea"  /></div> -->
    <Scroll
      :update-data="[collCommentList]"
      :refresh-data="[]"
      class="commentCon"
      ref="commentScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      @pullingDown="commentRefresh"
      @pullingUp="commentLoadMore"
     >

      <div class="commentConBox">
        <div v-if="collCommentList.length>0">
          <div class="commentItem" v-for="(item,index) in collCommentList" :key="index">
            <div class='titBox'>
              <img v-if="item.headPortrait" :src="item.headPortrait" alt="">
              <img v-else src="static/images/default/avatarGirl.png" alt="">
              <div class="titInfo">
                <div class="name">{{item.userName}}</div>
                <div class="specs">{{item.pjTime}}</div>
              </div>
            </div>
            <div v-if="item.content" class="commentVal">{{item.content}}</div>
            <div v-else class="commentVal">这个颜色很喜欢，超级百搭又显白，面料柔软不扎人，包装简约大气，用来送人也不错</div>
          </div>
        </div>
        <div style="padding-top:0.5px;" v-else>
          <noGood></noGood>
        </div>
      </div>

    </Scroll>
    <div class="addCommentBox">
      <input class="comIpt" type="text" v-model="commentVal" placeholder="说说你的看法">
      <span class="subBtn" @click="submitComment" v-actions:comment:click>发表</span>
    </div>

  </VueActions>
</template>

<script>
import backHeader from '../../comps/common/commonBackHeader';
import noGood from "../../comps/common/noGoods";
export default {
  name:'shopCollComment',
  components:{ backHeader , noGood },
  data(){
    return {
      collCommentList:[],
      currentPage:1,
      pageSize:6,
      commentTotal:0,
      commentVal:"",   // 评论内容
    }
  },
  created(){
    this.getCommentList();
  },
  mounted(){},
  methods:{
    back(){
      this.$router.go(-1)
    },
    // 获取评论列表
    getCommentList(){
      let _this = this;
      let params={
        "collId": _this.$route.query.collId,
        "currentPage":_this.currentPage,
        "pageSize":_this.pageSize
      }
      _this.$axios.post("/api/coll/queryCollEvtion",params).then(function(res){
        let data = res.data;
        // console.log("评论列表>>>>>>>>>>>>>>>>>>>>>>>>",data)
        if(data.code=="200"){
          _this.commentTotal = res.data.data.total;

          if(_this.currentPage == 1){
            _this.collCommentList = data.data.list;
          }else{
            _this.collCommentList = _this.collCommentList.concat(data.data.list);
          }
          // _this.collCommentList = res.data.data.list;
        }else{
          _this.$toast(res.data.message)
        }
      }).catch(function(error){
        console.log(error);
        // _this.$toast("接口调用失败")
      });
    },

    commentRefresh(){
      this.currentPage = 1;
      this.getCommentList();
    },
    commentLoadMore(){
      if(this.collCommentList.length < this.commentTotal){
        // console.log(this.collocationList.length , this.collTotal)
        this.currentPage++;
        this.getCommentList();
      }else{
        // console.log(this.collocationList.length , this.collTotal)
        this.$refs.commentScroll.update(true)
      }
    },
    submitComment(){
      let _this = this;
      let params={
        "collId": _this.$route.query.collId,
        "content": _this.commentVal,
        "userId": localStorage.userId
      }
      _this.$axios.post("/api/coll/addPutEvt",params).then(function(res){
        let data = res.data;
        console.log("发表评论:",data)
        if(data.code=="200"){
          _this.$toast("发表评论成功");
          _this.commentVal = '';
          _this.currentPage = 1;
          _this.getCommentList();
        }else{
          _this.$toast(res.data.message)
        }
      }).catch(function(error){
        console.log(error);
        // _this.$toast("接口调用失败")
      });
    }
  }
}
</script>

<style scoped lang="less">
#shopCollComment{
  width:100%;
  height:100%;
  display: flex;
  flex-direction: column;
  .headBox{
    width:100%;
  }
  .commentCon{
    margin-top:0.5px;
    flex:1;
    overflow: hidden;
    padding: 10px 12px;
    box-sizing: border-box;
    .commentConBox{
      // padding: 10px 12px;
      .commentItem{
        padding: 15px 0px;
        font-size: 16px;
        border-bottom: 0.5px solid #ddd;
        .titBox{
          display: flex;
          margin:7px 0px;
          img{
            width:40px;
            height: 40px;
            object-fit: cover;
            margin-right: 8px;
            border-radius: 50%;
          }
          .titInfo{
            flex:1;
            .name{
              color:#333;
            }
            .specs{
              font-size: 14px;
              color:#999;
            }
          }
        }
        .commentVal{
          font-size: 14px;
          color:#333;
          line-height: 22px;
        }

      }
    }
  }

  .addCommentBox{
    width:100%;
    height:60px;
    background-color: #fff;
    border-top:0.5px solid #ccc;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .comIpt{
      width:86%;
      height:35px;
      // margin-top:8px;
      margin-left:4%;
      padding-left:8px;
      border:none;
      background-color: #f3f3f3;
      border-radius: 12px;
      font-size: 14px;
    }
    .subBtn{
      width:14%;
      text-align: right;
      // background-color: pink;
      color:#1978FE;
      font-size: 16px;
      margin-left:auto;
      margin-right:15px;
    }
  }

}

</style>
