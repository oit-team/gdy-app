<template>
  <div class="hd_select">
    <div class="hd_input_wrap select-none" @click="toSearch">
      <span class="icon select"></span>
      <span class="search-desc">新品上架</span>
    </div>
    <!-- <div class="icon hd_right_btn" @click="toSetup"></div> -->
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      searchValue:""
    };
  },
  methods:{
    toSearch(){
      this.$router.push("/search");
    },
    toSetup(){
      this.$router.push("/setup");
    }
  },
  mounted(){

  },
  props:[
    'type',
  ]
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hd_select {
  display: flex;
  height:1.4rem;
  align-items: center;
  background-color: #f5f5f5;
}
.hd_input_wrap {
  border-radius: 16px;
  background: #fff;
  height: 32px;
  display: flex;
  justify-content: left;
  align-items: center;
  margin-left: 12px;
  margin-right: 12px;
  flex: 1;
  padding: 0 10px;
}
.icon {
  width: 15px;
  height: 15px;
}
.search-desc{
  font-size:11px;
  color:#999;
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
  background: url("../../../../static/images/collocation/select@2x.png") left /
    contain no-repeat;
}
.select-none{
  user-select: none;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
}
</style>
