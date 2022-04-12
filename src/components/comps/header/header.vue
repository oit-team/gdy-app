<template>
  <div class='header'>
    <img src="static/images/dev/back@2x.png" @click="back" >
    <span class="tit" @click="back">{{title}}</span>
    <span class="placeLabel">
      <slot name="after"></slot>
    </span>
    <!-- <img src="" alt=""> -->
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {

    };
  },
  methods:{
    back(){
      if (this.$listeners.back) {
        this.$emit('back')
      } else {
        this.$router.back();
      }
    },
  },
  mounted(){

  },
  props:{
    title:String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header{
  width:100%;
  height:1.2rem;
  padding:0 0.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color:#333;
  box-sizing: border-box;
  background-color: #F6F6F6;
  /* background-color: red; */
  user-select: none; -webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;
}
.header img{
  width:8px;
  height: 13px;
  margin-right: 5px;
  padding:5px 25px 5px 0px;
  /* background-color: pink; */
  user-select: none; -webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;
}
.header .tit{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size:16px;
  user-select: none; -webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;
}
.header .placeLabel{
  float: right;
  height: 13px;
}
</style>
