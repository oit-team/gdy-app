<template>
  <div class="main" @touchmove.prevent>
    <!-- <div class='header'>
      <div @click="back"><img src="static/images/dev/back@2x.png" ></div>
      <span>修改密码</span>
      <span class="right" @click="change">确定</span>
    </div> -->
    <Header :title="'修改密码'"></Header>
    <div class="page">
      <ul>
        <li>
          <input v-model="password" type="password" placeholder="输入新密码">
        </li>
        <li>
          <input v-model="realPassword" type="password" placeholder="确认新密码">
        </li>
      </ul>
    </div>
    <div class="conBtn" @click="change">确认</div>
  </div>
</template>

<script>
import Header from '../../comps/header/header';
import {Toast} from 'mint-ui';
export default {
  name: "",
  components:{Header},
  data() {
    return {
      password:"",
      realPassword:""
    };
  },
  methods:{
    back(){
      this.password = '';
      this.realPassword = '';
      this.$router.go(-1);
    },
    change(){
      let _this = this;
      if(_this.password=="" || _this.realPassword==""){
        Toast("密码不能为空!");
        return false;
      }
      if(_this.password!=_this.realPassword){
        Toast("两次密码不一致!");
        return false;
      }
      let param = {
        id:localStorage.userId,
        password:_this.realPassword
      }
      _this.$axios.post("/api/userInfo/change",param)
      .then(function(res){
        let data = res.data;
        if(data.code=="200"){
          Toast("修改成功");
          _this.$router.go(-1);
        }else{
          Toast("修改失败");
        }
      })
      .catch(function(error){
        console.log(error);
      });
    }
  },
  mounted(){

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  color: #333333;
  font-family:PingFang-SC-Medium;
  font-size: 15px;
}
.header{
  height: 1.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}
.header div{
  padding-left:0.4rem;
  padding-right: 0.4rem;
  height: 1rem;
  display: flex;
  align-items: center;
}
.header .right{
  font-size: 14px;
  padding-right: 0.4rem;
}
.header img{
  height: 0.4rem;
}
.page{
  /* border-top:0.5px solid #ccc;  */
}
.page ul{
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  padding:0 15px;
  width:100%;
  margin: 10px auto;
  border-radius: 12px;
  box-sizing: border-box;
}
.page ul li {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height:50px;
  border-bottom:0.5px solid #f3f3f3;
}
.page ul li span{
  margin-right:55px;
}
.page ul li input{
  flex: 1;
  background: transparent;
  border: 0;
  outline: none;
}
.conBtn{
  width:90%;
  height: 40px;
  line-height: 40px;
  background-color: #1978FE;
  color:#fff;
  font-size: 16px;
  text-align: center;
  margin:0 auto;
  border-radius: 12px;
  margin-top:10px;
}


</style>
