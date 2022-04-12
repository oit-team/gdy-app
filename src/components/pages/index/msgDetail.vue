<template>
  <div id="msgDetail">
    <div class="headBox">
      <backHeader title="系统消息">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right"></span>
      </backHeader>
    </div>
    <div class="msgDetailCon">
      <div class="msgTime">{{msgCon.createDate}}</div>
      <div class="msgContent" v-html="msgCon.content"></div>
    </div>

  </div>
</template>
<script>
import backHeader from '../../comps/common/commonBackHeader';

export default {
  name:"msgDetail",
  components:{backHeader},
  data(){
    return {
      msgCon:""
    }
  },

  created(){
  },
  mounted(){},
  activated(){
    // console.log(this.$route.query);
    if(this.$route.query && this.$route.query.msg){
      this.msgCon = this.$route.query.msg
    }
    this.msgReaded();
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    msgReaded(){
      let _this = this;
      let params = {
        "msgId":this.msgCon.id,
        "userId":localStorage.userId
      }
      _this.$axios.post("/api/msg/addMsgUserRelation",params).then(function(res){
        let data = res.data;
        if(data.code=="200"){
          //  console.log("该条消息已读")
        }
      }).catch(function(error){
        console.log(error);
      });
    },

  }
}
</script>
<style lang="less" scoped>
#msgDetail{
  width:100%;
  height:100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  .headBox{
    width:100%;
  }
  .msgDetailCon{
    background-color: #fff;
    flex:1;
    overflow: hidden;
    padding:12px 12px;
    .msgType{
      font-size:16px;
      line-height: 26px;
      color:#333;
    }
    .msgTime{
      font-size:14px;
      line-height: 26px;
      color:#666;
    }
    .msgContent{
      font-size:16px;
      line-height: 26px;
      color:#333;
    }
  }
}

</style>
