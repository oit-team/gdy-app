<template>
  <div id="addCollocation" @touchmove.prevent>
    <div class="headBox">
      <backHeader title="添加搭配">
        <span slot="left" class="head-class f-l" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span slot="right" class="head-class place-label"></span>
      </backHeader>
    </div>

    <Scroll
      ref="addCollScroll"
      class="addCollScrollBox"
      :probeType = '3'
      :bounce='false'
      :listenScroll='true'
      :pullDown="false"
      :pullUp="false">
      <!-- 推荐理由 -->
      <div class="recAddReason">
        <van-field
          v-model="recommentReason"
          rows="4"
          autosize
          label="推荐理由"
          show-word-limit
          type="textarea"
          maxlength="140"
          placeholder="请输入推荐理由,最多140字"

        />
        <!-- @input="getFieldValue" -->
      </div>

      <!-- 搭配照 -->
      <div class="addCollImgCon">

        <div class="addCollImgBox">
          <div class="tit">搭配照</div>
          <Uploader
            v-model="uploadImages"
            multiple
            :max-count="5"
            :max-size="15000 * 1024"
            :action="baseUrl + '/system/file/upVideoOrAudio'"
            :transform-data="transformData"
            :headers="headers"
            :chunk-size="5000"
            :handle-response="handleResponse"
            @oversize="onOversize"
            @success="onSuccess"
            @error="onError"
          />
        </div>
        <div class="tip">{{uploadImages.length}}/5</div>
      </div>

      <!-- 搭配单品 -->
      <div class="addCollSingleCon">
        <div class="addCollSingle">
          <div class="tit">搭配单品</div>
          <div class="singleBox">
            <div v-if="choosedList.length>0" class="singleImgCon">
              <div v-for="(item,index) in choosedList" :key="index" class="singleImgBox">
                <img class="singleImg"  :src="item.imgUrl" alt="">
                <img class="delIcon" src="static/images/icon/close1.png" alt="" @click="delSingle(index)">
              </div>
              <div v-if="choosedList.length<5" class="addSingleBtn" @click="addSingle">+</div>

            </div>
            <div v-if="choosedList.length==0" class="addSingleBtn" @click="addSingle">+</div>
          </div>
        </div>
        <div class="singleLength">{{choosedList.length}}/5</div>
      </div>

      <div class="suitOccationBox">
        <div class="tit">适用场景</div>
        <div class="suitBox">
          <span v-for="(item,index) in suitOccaList" :key="index" :class="[item.choosed?'active':'']"  @click="changeState(item)">{{item.fitOccasionName}}</span>
          <div class="suitLimit">{{activeSuit.length}}/3</div>
        </div>
      </div>

    </Scroll>

    <div v-show="hideshow" class="btnBox">
      <div v-if="showSaveBtnFlag" class="confirmBtn saveBtn" @click="saveCollFun">保存</div>
      <div class="confirmBtn" @click="submitCollFun">提交</div>
    </div>

    <div v-if="upFlag" class="bgImg"></div>
    <div v-if="upFlag" class="loadingBox"><van-loading v-if="upFlag" color="#fff"  size="14px">图片上传中...</van-loading></div>


  </div>
</template>

<script>
import { Dialog } from 'vant';
import Header from '../../comps/header/header';
import backHeader from '../../comps/common/commonBackHeader';
import EXIF from 'exif-js';
import { Uploader, uploaderOptions } from '@oit/vant-extend'

const continuingly = new WeakMap()

export default {
  name: "addCollocation",
  components:{ Header , backHeader, Uploader },
  data() {
    return {
      baseUrl: process.env.NODE_ENV === 'production' ? './mta-api' : '/api',
      uploadImages: [],
      headers: {
        token: localStorage.accessToken,
        userId: localStorage.userId,
      },
      recommentReason:'',
      collImgList: [],    // 搭配照回显数组

      upImgList:[],  // 上传搭配照暂存数组,base64格式
      collImgStr:"",   // 以#@#隔开的字符串

      imgUrlList:[],  // 上传搭配照暂存数组,http格式,点击保存时要传递的数组
      imgUrlStr:'',

      suitOccaList:[],   // 使用场景列表
      activeSuit:[],   // 被选中列表
      headPortrait:'',

      choosedList:[],   // 选中的单品
      status:1,  // 按钮状态  0 以保存  1 待审核（提交）
      choosedIdList:[],

      collId:null,   // 搭配id(已保存的进行编辑)

      pressImgUrl:[],
      imgLength:1,

      showSaveBtnFlag:true,   // 已拒绝的搭配进入编辑页面，保存按钮不显示 true 显示  false 不显示

      upFlag:false,    // false 不显示  true 显示

      docmHeight: window.innerHeight,  //默认屏幕高度
      showHeight: window.innerHeight,   //实时屏幕高度
      hideshow:true,  //显示或者隐藏footer
    };
  },
  created(){
    // console.log("-------created-------",this.$route.query)
    if(this.$route.params.collId && this.$route.params.editFlag){
      this.collId = this.$route.params.collId;
      localStorage.shopCollId = this.collId
      this.getStyleInfo(this.collId)
    }
    if(this.$route.params.collStatus && this.$route.params.collStatus==2){
      this.showSaveBtnFlag = false;

    }
    // this.getSuitList();
  },
  mounted(){
    // console.log("-------mounted-------",this.$route.query);
    // window.onresize监听页面高度的变化
    window.onresize = ()=>{
      return(()=>{
        this.showHeight = window.innerHeight;
      })()
    }
  },
  //监听
  watch:{
    showHeight: function(newValue) {
      if(this.docmHeight > newValue){
        this.hideshow = false
      }else{
        this.hideshow = true
      }
    }
  },
  activated(){
    this.getSuitList();

    if(localStorage.recommentReasonVal){
      this.recommentReason = localStorage.recommentReasonVal;
    }

    if(localStorage.collImgListArr){
      this.collImgList = JSON.parse(localStorage.collImgListArr)
    }
    // console.log(this.collImgList)

    if(localStorage.singleList){
      this.choosedList = JSON.parse(localStorage.singleList);
      // console.log("搭配单品列表====",this.choosedList)
      let arr = [];
      for(let i=0;i<this.choosedList.length;i++){
        arr.push(this.choosedList[i].id);
      }
      // console.log(arr,"=============");
      this.choosedIdList = arr;
    }

    if(localStorage.activeSuitList){
      // console.log("localStorage.activeSuitList",localStorage.activeSuitList)
      this.activeSuit = JSON.parse(localStorage.activeSuitList);
      // console.log("this.activeSuit",this.activeSuit)
    }

  },

  methods:{
    transformData(data, option) {
      const _data = uploaderOptions.transformData(data, option)
      _data.fname = continuingly.get(option.file) || _data.fname
      return _data
    },
    handleResponse(response, option) {
      if (response.status === 101)
        continuingly.set(option.file, response.fname)

      return uploaderOptions.handleResponse(response)
    },
    onSuccess({ item, response }) {
      this.$set(item, 'response', response)
    },
    onError(e) {
      console.log(e)
    },
    back(){
      if(this.recommentReason || this.choosedIdList.length > 0 || this.activeSuit.length > 0 || this.imgUrlList.length > 0 ){
        Dialog.confirm({
          title: '提示',
          message: '信息未保存，需要退出吗？',
        }).then(() => {
          this.$router.push({
            path:"/myCollocation"
          })
          this.$destroy()
        }).catch(() => {
          // console.log("取消")
        });
      }else{
        this.$router.push({
          path:"/myCollocation"
        })
        this.$destroy()
      }
      // this.$router.push({
      //   path:"/myCollocation"
      // })
    },
    getFieldValue(e){
			// console.log(e)
			this.recommentReason = e.detail
		},
    // 编辑搭配时----获取搭配详情信息
    getStyleInfo(id){
      let _this = this;
      let params={
        brandId:localStorage.brandId,
        id:id,
        userId:localStorage.userId
      }
      _this.$axios.post("/api/coll/info",params)
      .then(function(res){
        let data = res.data;
        // console.log("搭配详情",data)
        if(data.code=="200"){
          // 理由
          if(data.data.collInterpretation){
            _this.recommentReason = data.data.collInterpretation;
            localStorage.recommentReasonVal = _this.recommentReason;
          }
          // 搭配单品
          if(data.data.styleList && data.data.styleList.length>0){
            let singleList = data.data.styleList;
            // console.log(singleList)
            _this.choosedList = singleList;
            let arr = [];
            for(let i=0;i<_this.choosedList.length;i++){
              arr.push(_this.choosedList[i].id);
            }
            _this.choosedIdList = arr;
            // console.log(_this.choosedIdList,"=============");
            localStorage.singleList = JSON.stringify(_this.choosedList);
          }

          // 搭配照
          if(data.data.imgUrls){
            let collImgs = data.data.imgUrls.split(",");
            let tempCollImgs = [];
            // console.log(collImgs)
            for(let i=0;i<collImgs.length;i++){
              let obj={}
              obj.url = collImgs[i];
              tempCollImgs.push(obj)
            }
            // console.log(tempCollImgs);
            _this.collImgList = tempCollImgs;
            // console.log("_this.collImgList",_this.collImgList)

            localStorage.collImgListArr = JSON.stringify(_this.collImgList);
            // console.log(localStorage.collImgListArr)

            let imgList = [];
            for(let i=0;i<_this.collImgList.length;i++){
              let num = i + 1;
              let url = _this.collImgList[i].url+"_"+num; // http://xxxxx.jpg_1
              // fileUrls[i].fileUrl = url+"_"+num;
              imgList.push(url)
            }
            // console.log("==========",imgList,fileUrls)
            _this.imgUrlList = imgList;  // 点击保存或提交时所要传递的参数值
            // console.log("获取的http的图片路径",_this.imgUrlList)
          }

          // 适用场合
          if(data.data.fitOccasion){
            let curOccasion = data.data.fitOccasion.split(",");
            // console.log("编辑获取详情",curOccasion)
            // console.log("curOccasion",curOccasion)
            for(let i=0;i<curOccasion.length;i++){
              if(curOccasion[i]){
                curOccasion[i] = Number(curOccasion[i])
              }
            }
            for(let i=0;i<curOccasion.length;i++){
              if(!curOccasion[i]){
                curOccasion.splice(i,1);
              }
            }
            // console.log("处理后curOccasion",curOccasion)
            _this.activeSuit = curOccasion;
            localStorage.activeSuitList = JSON.stringify(_this.activeSuit);
            _this.getSuitList();
          }

        }
      }).catch(function(error){
        console.log(error);
      });
    },

    // 删除搭配图片
    deleteUploadImg(delItem, detail){

      this.collImgList.splice(detail.index,1);   // 反显搭配照数组
      this.imgUrlList.splice(detail.index,1);   // 保存时要传递的搭配照数组
      // console.log("--imgUrlList---222",this.imgUrlList) ;
      // this.pressImgUrl.splice(detail.index,1);
      return ;
    },

    // 点击去选择搭配单品
    addSingle(){
      // console.log("this.collImgList===",this.collImgList);
      if(this.recommentReason){
        localStorage.recommentReasonVal = this.recommentReason;
      }
      this.$router.push({
        path:'/addSingle',
      })
    },
    // 删除单品
    delSingle(index){
      this.choosedList.splice(index,1);
      // console.log("删除后的this.choosedList===",this.choosedList)
      let arr = [];
      for(let i=0;i<this.choosedList.length;i++){
        arr.push(this.choosedList[i].id);
      }
      // console.log(arr,"=============");
      this.choosedIdList = arr;
      localStorage.singleList = JSON.stringify(this.choosedList);

    },

    // 获取适用场景列表
    getSuitList(){
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "brandId": localStorage.brandId,
        "dType": 3,
        "classification":1
      }
      // debugger
      _this.$axios.post("/api/dic/queryDicList",data).then(function (res){
        // console.log("适用场景列表为:",res.data)
        if(res.data.code == 200){
          _this.suitOccaList = res.data.data;
          for(let i=0;i<_this.suitOccaList.length;i++){
            _this.$set(_this.suitOccaList[i], 'choosed',false);
          }
          // console.log(_this.suitOccaList);
          if(_this.activeSuit.length>0){
            // console.log("----------1111---------")
            for(let i=0;i<_this.activeSuit.length;i++){
              // console.log(_this.activeSuit[i])
              // console.log("this.suitOccaList",_this.suitOccaList)
              for(let j=0;j<_this.suitOccaList.length;j++){
                // console.log("----------22222---------")
                if(_this.activeSuit[i] == _this.suitOccaList[j].id ){
                  _this.suitOccaList[j].choosed = true;
                }
              }
            }
          }
        }
      }).catch(function (error) {
        console.log(error);
        _this.$toast("请求失败！");
      });
    },
    // 保存搭配
    saveCollFun(){
      this.recommentReason = this.recommentReason.replace(/\s*/g,"");
      // if(!this.recommentReason){
      //   this.$toast("请输入推荐理由")
      //   return
      // }
      if(this.choosedIdList.length == 0){
        this.$toast("请选择搭配单品")
        return
      }
      if(this.activeSuit.length == 0){
        this.$toast("请选择适用场景")
        return
      }
      Dialog.confirm({
        title: '提示',
        message: '信息将临时保存至草稿箱，请尽快完善信息，提交总部审批',
      }).then(() => {
        // on confirm
        this.status = 0;
        this.confirmCollFun();
      }).catch(() => {
        // on cancel
      });
    },
    // 提交搭配
    submitCollFun(){
      this.recommentReason = this.recommentReason.replace(/\s*/g,"");
      // if(!this.recommentReason){
      //   this.$toast("请输入推荐理由")
      //   return
      // }
      if(this.choosedIdList.length == 0){
        this.$toast("请选择搭配单品")
        return
      }
      if(this.activeSuit.length == 0){
        this.$toast("请选择适用场景")
        return
      }

      Dialog.confirm({
        title: '提示',
        message: '确认将该搭配提交至总部审批吗？审批通过后将显示在高单易APP中',
      }).then(() => {
        // on confirm
        this.status = 1;
        this.confirmCollFun();
      }).catch(() => {
        // on cancel
      });
    },
    confirmCollFun(){
      // console.log("点击提交按钮",this.collImgList);
      let _this = this;
      // let imgList = [];
      // for(let i=0;i<_this.collImgList.length;i++){
      //   let num = i + 1;
      //   let url = _this.collImgList[i].url+"_"+num; // http://xxxxx.jpg_1
      //   // fileUrls[i].fileUrl = url+"_"+num;
      //   imgList.push(url)
      // }
      // console.log("==========",imgList,fileUrls)
      // 点击保存或提交时所要传递的参数值
      _this.imgUrlList = this.uploadImages.map((item, index) => {
        return `${item.response.fileUrl}_${index}`
      });
      console.log(_this.imgUrlList)
      if(this.imgUrlList.length == 0){
        this.$toast("请选择搭配照")
        return
      }
      // console.log("点击提交_this.activeSuit----",_this.activeSuit)
      let userid = localStorage.getItem("userId");
      let data = {
        "brandId": localStorage.brandId,
        "collName": "无",
        "userId":localStorage.userId,
        "collInterpretation": _this.recommentReason,
        "styleId": _this.choosedIdList.join(","),  // 关联单品id
        "collVideoUrl":"",   // 视频，先不填
        "collLabel": "",    // 可不写
        "collImg":_this.imgUrlList.join(","),
        // "files":_this.imgUrlList.join(","),
        "fitOccasion": _this.activeSuit.join(","),
        "status":_this.status,
        // "collId":_this.collId,    // 先写死
        "collId":localStorage.shopCollId,
        "recommendationLevel": null,  // 推荐等级，可不传
      }
      // console.log("--点击保存、提交传递的参数----",data)
      // debugger

      _this.$axios.post("/api/coll/addColl",data).then((res) => {
        // console.log("适用场景列表为:",res.data)
        if(res.data.code == 200){
          localStorage.removeItem("activeSuitList");
          localStorage.removeItem("singleList");
          localStorage.removeItem("recommentReasonVal");
          localStorage.removeItem("collImgListArr");
          localStorage.removeItem("shopCollId");
          Object.entries(this.$options.data()).forEach(([key, value]) => {
            this[key] = value
          })

          // debugger
          _this.$toast("成功");
          _this.recommentReason = '';
          _this.collImgList = [];
          // _this.choosedList = [];
          // _this.activeSuit = [];

          _this.$router.push({
            path:"/myCollocation",
            query:{
              stamp:new Date().getTime()
            }
          })

        }else{
          _this.$toast(res.data.data)
        }
      }).catch(function (error) {
        console.log(error);
        _this.$toast("请求失败！");
      });
    },
    // 点击适用场景时的逻辑判断
    changeState(item){
      // console.log(item.id)
      if(this.activeSuit.length<3){
        // 小于3
        for(let i=0;i<this.suitOccaList.length;i++){
          if(item.id == this.suitOccaList[i].id ){
            // console.log(item.id == this.suitOccaList[i].id)
            this.suitOccaList[i].choosed = !this.suitOccaList[i].choosed;
            if(this.suitOccaList[i].choosed){
              this.activeSuit.push(item.id)
              // console.log("++++++ this.activeSuit==", this.activeSuit)
            }else{
              // console.log("this.activeSuit==", this.activeSuit,item.id)

              // console.log(this.activeSuit.indexOf(item.id))
              this.activeSuit.splice(this.activeSuit.indexOf(item.id), 1)
              // console.log("------ this.activeSuit==", this.activeSuit)
            }
          }
        }
      }else if(this.activeSuit.length==3){
        // 等于3,分未选中列表和已选中列表进行判断并操作
        let isExist = false;
        for(let j=0;j<this.activeSuit.length;j++){
          // console.log(item.id , this.activeSuit[j])
          if(item.id == this.activeSuit[j]){
            isExist = true;
            // console.log(this.activeSuit[j],".......this.activeSuit[j]..")
            this.activeSuit.splice(this.activeSuit.indexOf(item.id), 1)
            for(let i=0;i<this.suitOccaList.length;i++){
              if(item.id == this.suitOccaList[i].id ){
                this.suitOccaList[i].choosed = !this.suitOccaList[i].choosed;
              }
            }
            break;
          }
        }
        if(!isExist){
          this.$toast("最多选择三个")
        }
      }
      localStorage.activeSuitList = JSON.stringify(this.activeSuit) ;
      // console.log("localStorage.activeSuitList",localStorage.activeSuitList)
    },
    onOversize(file) {
      // console.log(file);
      this.$toast('文件大小不要超过15M');
    },

    async collAfterRead(file) {
      // console.log(file);
      this.upFlag = true;
      if (file instanceof Array) {			// 多文件 Array
        this.imgLength = file.length;
        file.forEach(fileItem => {
          this.collAfterRead(fileItem);
        });
        return
      } else {
        // console.log("file===",file)
        // 之前一直搞错了，要传递的是file.file，而不是file(整个图片文件)
        let Orientation = null
        // 去获取拍照时的信息，解决拍出来的照片旋转问题
        // EXIF.getData(file.file, function() {
        //   console.log("=================",Orientation)
        //   Orientation = EXIF.getTag(file.file, 'Orientation');
        //   console.log("Orientation====3333",Orientation)
        // })

        // 转为异步操作，获取到值之后再进行下一步
        Orientation = await this.getImageTag(file.file, 'Orientation');
        // if (file.file.size > 800 * 1024) {
        //   // 大于800k，压缩图片
        //   this.pressImgUrl.push(await this.imageCompress(file.content,Orientation));
        //   // console.log("this.pressImgUrl=====",this.pressImgUrl);
        //   // console.log("大于800k，压缩图片")
        // }else{
        this.pressImgUrl.push(file.content);
          // console.log("文件小于800kb，正常上传")
        // }
        // console.log(" this.pressImgUrl", this.pressImgUrl)
      }
      // console.log("0000000",this.pressImgUrl.length, this.imgLength)
      if(this.pressImgUrl.length>=this.imgLength){
        // console.log("调方法");
        this.upLoadImg(file);
      }
      // this.upLoadImg(file)

    },

    /**
     * @desc 获取图片信息，使用exif.js库，具体用法请在github中搜索
     * @param {Object} file 上传的图片文件，注意是拿到的file里面的file
     * @param {String} tag 需要获取的信息 例如：'Orientation'旋转信息
     * @return {Promise<Any>} 读取是个异步操作，返回指定的图片信息
     */
    // 获取拍照时的信息，解决拍出来的照片旋转问题
    getImageTag(file, tag){
      // console.log('file, tag',file, tag)
      if (!file) return 0;
      return new Promise((resolve, reject) => {
        // 箭头函数会修改this，所以这里不能用箭头函数
        // console.log("--------------",EXIF,EXIF.getData)
        EXIF.getData(file, function () {
          // console.log("{==========================")
          const o = EXIF.getTag(this, tag);
          // console.log("-----getImageTag----orientation----",o)
          resolve(o);
        });
      });
    },

    // 压缩图片
    imageCompress(base64,Orientation) {
      let _this = this;
      let Img = new Image(),
          dataURL = '';
          Img.src = base64;
      let p = new Promise(function (resolve, reject) {
        Img.onload = function () { //要先确保图片完整获取到，这是个异步事件
          let canvas = document.createElement("canvas"), //创建canvas元素
            width = Img.width, //确保canvas的尺寸和图片一样
            height = Img.height;
          // 默认将长宽设置为图片的原始长宽，这样在长宽不超过最大长度时就不需要再处理
          let ratio = width / height,
            maxLength = 1000,
            newHeight = height,
            newWidth = width;
          // 在长宽超过最大长度时，按图片长宽比例等比缩小
          if (width > maxLength || height > maxLength) {
            if (width > height) {
              newWidth = maxLength;
              newHeight = maxLength / ratio;
            } else {
              newWidth = maxLength * ratio;
              newHeight = maxLength;
            }
          };
          canvas.width = newWidth;
          canvas.height = newHeight;
          canvas.getContext("2d").drawImage(Img, 0, 0, newWidth, newHeight); //将图片绘制到canvas中

          // console.log("Orientation=======",Orientation)
          //修复上传图片的时候 被旋转的问题
          if (Orientation != "" && Orientation != 1) {
            // debugger
            // console.log("Orientation=======",Orientation)
            switch (Orientation) {
              case 6: //需要顺时针（向左）90度旋转
                // this.rotateImg(Img, "left", canvas);  // 报错：this.rotateImg is not a function 改变一下this指向即可
                _this.rotateImg(Img, "left", canvas);
                break;
              case 8: //需要逆时针（向右）90度旋转
                _this.rotateImg(Img, "right", canvas);
                break;
              case 3: //需要180度旋转
                _this.rotateImg(Img, "right", canvas); //转两次
                _this.rotateImg(Img, "right", canvas);
                break;
            }
          }

          dataURL = canvas.toDataURL('image/jpeg', 0.6);
          // canvas的toDataURL()方法是返回一个包含图片展示的 数据URL，同时可以指定输出格式和质量。
          // 语法：canvas.toDataURL(type, encoderOptions);
          // 参数：1、type：图片格式，默认为 image/png,可以是其他image/jpeg等
          //       2、encoderOptions：0到1之间的取值，主要用来选定图片的质量，默认值是0.92，超出范围也会选择默认值

          resolve(dataURL);
        };
      });
      // console.log("============p",p,)
      // p.then(res=>{
      //   // console.log(res)
      // })
      return p
    },
    // 旋转图片
    rotateImg(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错
        let height = img.height;
        let width = img.width;
        let step = 2;
        if (step == null) {
          step = min_step;
        }
        if (direction == "right") {
          step++;
          //旋转到原位置，即超过最大值
          step > max_step && (step = min_step);
        } else {
          step--;
          step < min_step && (step = max_step);
        }
        //旋转角度以弧度值为参数
        let degree = (step * 90 * Math.PI) / 180;
        let ctx = canvas.getContext("2d");
        switch (step) {
          case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    // 上传图片
    upLoadImg(file){
      // 上传图片后单独调用接口先拿到对应图片的外网地址
      // console.log("上传图片成功后接口");
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "userId": localStorage.userId,
        "files": _this.pressImgUrl.join("#@#"),      // 上传的搭配图片，以"#@#"隔开的字符串
        "fileType":0,  // 0:图片，1：视频，2：音频
      }
      // debugger
      _this.$axios.post("/api/userInfo/uploadFile",data).then(function (res){
        _this.imgLength = 1;
        // console.log("res=======",res)
        if(res.data.code == 200){
          _this.upFlag = false;
          // _this.imgLength = 1;
          // _this.pressImgUrl = [];
          let fileUrls = res.data.data.fileUrls;

          // 以下操作为传参所做操作
          if(_this.imgUrlList.length>0){
            // 如果之前已经有了搭配照
            let curUpLength = _this.pressImgUrl.length;
            // console.log("curUpLength===",curUpLength)
            for(let i=0;i<curUpLength;i++){
              _this.collImgList.pop();
            }
            // console.log("_this.collImgList===111",_this.collImgList);
            for(let i=0;i<fileUrls.length;i++){
              let imgLength = _this.imgUrlList.length;
              let num = imgLength + 1;
              let url = fileUrls[i].fileUrl;
              let curUrl =  url+"_"+num;       // http://xxxxx.jpg_1
              _this.imgUrlList.push(curUrl);


              let obj={}
              obj.url = fileUrls[i].fileUrl;
              _this.collImgList.push(obj);

              localStorage.collImgListArr = JSON.stringify(_this.collImgList);

            }
          }else{
            // 之前没有搭配照时
            let curUpLength = _this.pressImgUrl.length;
            // console.log("curUpLength===",curUpLength)
            for(let i=0;i<curUpLength;i++){
              _this.collImgList.pop();
            }
            // console.log("_this.collImgList===111",_this.collImgList);

            let imgList = [];
            for(let i=0;i<fileUrls.length;i++){
              let num = i + 1;
              let url = fileUrls[i].fileUrl;
              let curUrl = url+"_"+num;       // http://xxxxx.jpg_1
              imgList.push(curUrl);

              // _this.collImgList.pop();
              // console.log("_this.collImgList===222",_this.collImgList);
              let obj={}
              obj.url = fileUrls[i].fileUrl;
              _this.collImgList.push(obj);
              // console.log("_this.collImgList===333",_this.collImgList);
              localStorage.collImgListArr = JSON.stringify(_this.collImgList);
            }
            _this.imgUrlList = imgList;  // 点击保存或提交时所要传递的参数值
          }
          _this.pressImgUrl = []; // 最后再置空
        }else{
          // 上传失败后删除此次上传的图片并重置一些变量
          _this.upFlag = false;
          // _this.collImgList = [];  // 由编辑进入时原来的图片也会被清除，pass
          let curUpLength = _this.pressImgUrl.length;   // 此次上传的图片长度即上传搭配图片失败后要删除的数组长度
          // console.log("上传搭配图片失败后要删除的数组长度",curUpLength)
          for(let i=0;i<curUpLength;i++){
            _this.collImgList.pop();    // pop()删除数组最后一个元素
          }
          _this.pressImgUrl = [];
          // console.log("_this.collImgList====",_this.collImgList,_this.pressImgUrl)
          _this.$toast("上传图片请求失败,请重新上传！");
          // _this.$toast(res.data.data)
        }

      }).catch(function (error) {
        // 接口调用失败也要执行清除操作
        _this.upFlag = false;
        _this.imgLength = 1;
        let curUpLength = _this.pressImgUrl.length;
        for(let i=0;i<curUpLength;i++){
          _this.collImgList.pop();
        }
        _this.pressImgUrl = [];
        _this.$toast("上传图片请求失败,请重新上传！");
      });
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../../assets/workCss/addCollocation.less";


</style>
