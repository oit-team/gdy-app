<template>
  <div id="addCollocation" @touchmove.prevent>
    <div class="headBox">
      <backHeader title="添加搭配">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right"></span>
      </backHeader>
    </div>


    <Scroll
      class="addCollScrollBox"
      ref="addCollScroll"
      :probeType = '3'
      :bounce='false'
      :listenScroll='true'
      :pullDown="false"
      :pullUp="false">
      <div class="recAddReason">
        <van-field
          v-model="message"
          rows="4"
          autosize
          label="推荐理由"
          type="textarea"
          maxlength="140"
          placeholder="请输入推荐理由,最多140字"
          show-word-limit
        />
      </div>

      <!-- <div class="collImgBox">
        <div class="collTit">搭配照</div>
        <div class="imgListBox">
          <div class="imgBox"></div>
          <div class="imgItemBox">
            <img class="photo"  :src="headPortrait" alt="">
            <input type="file" class="avatarFile" accept="image/*" name="image" @change="handleInputChange">
          </div>
        </div>
      </div> -->


      <div class="addCollImgBox">
        <div class="tit">搭配照</div>
        <van-uploader v-model="collImgList" multiple :after-read="collAfterRead" />
      </div>
      <div class="addCollImgBox">
        <div class="tit">搭配单品</div>
        <!-- <van-uploader v-model="goodsImgList" multiple :after-read="goodAfterRead" /> -->
        <div class="addSingleBtn">
          <span @click="addSingle">添加单品</span>
        </div>
      </div>



      <div class="suitOccationBox">
        <div class="tit">适用场景</div>
        <div class="suitBox">
          <span v-for="(item,index) in suitOccaList" :class="[item.choosed?'active':'']" @click="changeState(item)"  :key="index">{{item.name}}</span>
        </div>
      </div>
      <div class="btnBox">
        <div class="confirmBtn">提交</div>
      </div>
    </Scroll>

  </div>
</template>

<script>
import Header from '../../comps/header/header';
import backHeader from '../../comps/common/commonBackHeader';
export default {
  name: "addCollocation",
  components:{ Header , backHeader },
  data() {
    return {
      message:'',
      collImgList: [
        { url: 'http://res.oitor.com:8099/upload/0/2019/5/d1ee197e2d7441519f9d55c6bca9fb6c.jpg' },
        { url: 'http://res.oitor.com:8099/upload/0/2019/5/8847d7f72f8a40dbaf8c102f91e3893b.jpg' },
        { url: 'http://res.oitor.com:8099/upload/0/2019/5/1c5dcce928f647819014e289520cf006.jpg' },
        { url: 'http://res.oitor.com:8099/upload/1/2020/4/fb470a4bc2d248d09534b8c5ca8005f9.jpg' }
      ],
      goodsImgList:[
        { url: 'https://img.yzcdn.cn/vant/leaf.jpg' },
        { url: 'https://img.yzcdn.cn/vant/leaf.jpg' },
        { url: 'https://img.yzcdn.cn/vant/leaf.jpg' },
        { url: 'https://img.yzcdn.cn/vant/leaf.jpg' }
      ],
      suitOccaList:[{id:1,name:"度假"},{id:2,name:"休闲"},{id:3,name:"通勤"},{id:4,name:"商务"},{id:5,name:"社交"},{id:6,name:"日常"},{id:7,name:"欢乐"}],
      activeSuit:[],
      headPortrait:'',
    };
  },
  created(){
    for(let i=0;i<this.suitOccaList.length;i++){
      this.$set(this.suitOccaList[i], 'choosed',false);
    }
    // console.log(this.suitOccaList)
  },
  mounted(){},
  methods:{
    back(){
      this.$router.go(-1)
    },
    // 处理头像上传
    handleInputChange(e){
      // console.log(e.target.files)
      for(var i = 0; i < e.target.files.length; i++) { // 如果需要对文件大小类型进行验证，可以将e.target.files[i]打印出来，对其中的键值进行逻辑判断
        var img_url = window.URL.createObjectURL(e.target.files[i]) // 通过该方法可以获取到文件的路径，可以用于图片回显
        // console.log(img_url) // blob:http://localhost:8080/557d2808-c433-4c2c-aa87-dbe13222a572
        // var html = '<img src="'+ img_url +'"  width="50px" height="50px"/> ';
        let html = `<img src=${img_url} width="50px" height="50px" />`
        // document.getElementsByClassName("imgBox").innerHTML = html
        document.getElementsByClassName("imgBox")[0].append(html)
      }

    },
    // 搭配上传成功后
    collAfterRead(file) {
      // 此时可以自行将文件上传至服务器
      // console.log(file);   // 上传一个，返回的是个对象，上传多个，返回的是数组
    },
    // 点击去选择搭配单品
    addSingle(){
      this.$router.push({path:'/searchResult',stamp:new Date().getTime()})
    },
    // 搭配单品上传成功后
    goodAfterRead(file){
      // console.log(file);
    },
    changeState(item){
      // console.log("===========",item)
      if(this.activeSuit.length<3){
        for(let i=0;i<this.suitOccaList.length;i++){
          if(item.id == this.suitOccaList[i].id ){
            this.suitOccaList[i].choosed = !this.suitOccaList[i].choosed;
            if(this.suitOccaList[i].choosed){
              this.activeSuit.push(item.id)
            }
          }
        }
        // console.log(this.activeSuit)
      }else{
        this.$toast("最多选择三个")
        return
      }
    }
  },
  mounted(){

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../../assets/workCss/addCollocation.less";


</style>
