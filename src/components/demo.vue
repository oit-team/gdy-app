<template>
  <div class="main">
    <!-- <button @click="test">测试</button>
    <m-popup ref="mpopup">
      <ul>
        <li><span class="name">款号</span><span class="value">6S1EWSC75WSC7586S1</span></li>
        <li><span class="name">款号</span><span class="value">6S1E586S16S1EWSC7586S1</span></li>
        <li><span class="name">款号</span><span class="value">6S1EWSC7586S16S1EWSC7586S16S1EWSC7586S16S1EWSC7586S1</span></li>
      </ul>
    </m-popup> -->

    <div class="headBox">
      <backHeader title="测试页面">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right"></span>
      </backHeader>
    </div>

    <!-- <div class="content-wrap">
      <div :class="['content', expande ? 'expande' : 'close']" ref="content">
        思路：1、判断当前内容是否超过三行。此处可以给每行设置一个行高line-height,渲染完后超过三倍的行高即认为是内容超过了三行。2、展示/收起状态的切换可以通过data中的参数来绑定。3、在底部使用position:absolute来绝对定位展开该在的位置。4、根据业务需求来设定好展开和收起按钮需要呆的地方。
      </div>
      <div class="expande-button-wrap" v-if="needShowExpande">
        <div class="expande-button" @click="expandeClick" v-if="!expande">展开</div>
        <div class="expande-button" @click="expandeClick" v-else>收起</div>
      </div>
    </div> -->
    <!-- <van-uploader v-model="tempFiles" multiple accept="image/*,video/*" :after-read="afterReaderFiles" :max-count="9">
    </van-uploader> -->
    <!--查看压缩之后的图片:还原组件回显图片样式，预览-->
    <!-- <div>
      <img :src="item" v-for="(item,index) in pressImgUrl" :key="index"
            @click="ImagePreview(item)"
            alt="压缩之后的图片" width="40px" height="40px"
            style="object-fit: cover;border-radius: 4px;margin-right:4px">
    </div> -->

    <!-- <h1 @click="show=true">点击出现预览组件</h1>
    <van-image-preview v-model="show" :images="images" :showIndex="true" :start-position="curIndex" @change="onChange">
      <template v-slot:index>第{{ index }}页</template>
    </van-image-preview> -->

    <!-- 左右滑动 -->
    <div class='mainCon'>
      <div class='testCon'>
        <Scroll
          class="left"
          :probeType = '3'
          :bounce='false'
          :listenScroll='true'
          :pullDown="false"
          :pullUp="false">
          <div>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
            <h1>zuoce</h1>
          </div>
        </Scroll>

        <Scroll
          class="right"
          :probeType = '3'
          :bounce='false'
          :listenScroll='true'
          :pullDown="false"
          :pullUp="false">
          <div >
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
            <h1>右侧</h1>
          </div>
        </Scroll>


      </div>
    </div>



  </div>

</template>

<script>
import popup from "./comps/popup/popup.vue";
import backHeader from './comps/common/commonBackHeader';

export default {
  name: "",
  components:{
    "mPopup":popup,
    backHeader
  },
  data() {
    return {
      isShow:false,
      expande: true,
      needShowExpande: false,

      files: {
        name: "",
        type: ""
      },
      headerImage: null,
      picValue: null,
      upImgUrl:null,

      tempFiles:[],
      pressImgUrl:[],

      show: false,
      index: 0,
      images: [
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg',
        'https://img.yzcdn.cn/vant/apple-3.jpg',
        // 'https://img.yzcdn.cn/vant/apple-4.jpg',
      ],
      curIndex:1
    };
  },

  methods:{
    back(){
      this.$router.go(-1)
    },
    // test(){
    //   this.$refs.mpopup.show();
    // },
    // expandeClick() {
    //   console.log('expandeClick')
    //   this.expande = !this.expande
    // },

    onChange(index) {
      this.index = index;
    },


  /**
   * 文件流读取完成
   * @param file
   */
    async afterReaderFiles(file) {
      console.log(file);
      /*let regExp = /^video\//;*/
      if (file instanceof Array) {			// 多文件 Array
        file.forEach(fileItem => {
          console.log(fileItem);
          // debugger;
          this.afterReaderFiles(fileItem);
        });
      } else {
        // 单 Object
        /*if (regExp.test(file.file.type)) {
          this.videoOpretion(file);
          return
        };*/
        if (file.file.size > 150 * 1024) {
          this.pressImgUrl.push(await this.imageCompress(file.content));
          console.log("this.pressImgUrl=====",this.pressImgUrl)


          for(let i=0;i<this.pressImgUrl.length;i++){
            // 去掉base64编码中的前缀 data:image/png;base64,
            let baseStr=this.pressImgUrl[i],tag="base64,";
            baseStr=baseStr.substring(baseStr.indexOf(tag)+tag.length);
            // 去掉base64编码中的“=”号　　
            var eqTagIndex=baseStr.indexOf("=");
            baseStr=eqTagIndex!=-1?baseStr.substring(0,eqTagIndex):baseStr;
            // 计算文件流大小
            var strLen=baseStr.length;
            var fileSize=strLen-(strLen/8)*2
            alert("文件大小:"+fileSize/1024+"kb");
          }


        }else{
          console.log("文件小于100kb，正常上传")
        }
      }
    },
    /**
     * 图片压缩 base64->canvas->base64
     * @param base64
     */
    imageCompress(base64) {
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
          dataURL = canvas.toDataURL('image/jpeg', 0.3); //转换图片为dataURL
          resolve(dataURL);
        };
      });
      console.log("============p",p,)
      p.then(res=>{
        console.log(res)
      })
      return p
    },

  },
  mounted(){
    this.$nextTick(() => {
      // let lineHeight =22
      // console.log(this.$refs.content.offsetHeight , lineHeight * 3)
      // if (this.$refs.content.offsetHeight > lineHeight * 3) {
      //   this.expande = false
      //   this.needShowExpande = true
      // } else {
      //   this.expande = true
      // }
    })

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.main{
  width:100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .mainCon{
    flex: 1;
    overflow: hidden;
    .testCon{
      width:100%;
      height: 100%;
      display: flex;
      box-sizing: border-box;
      .left{
        width:150px;
        border:1px solid red;
      }
      .right{
        flex:1;
        border:1px solid green;
      }
    }


  }
}
.content {
    font-size: 14px;
    color: black;
    letter-spacing: 0;
    line-height: 22px;
    text-align: justify;
    overflow: hidden;
    padding:10px 12px;
    /* display: -webkit-box; */
    /* -webkit-line-clamp: 3;
    -webkit-box-orient: vertical; */
    /* text-overflow: ellipsis; */
}

.expande {
    overflow: auto;
    height: auto;
    padding-bottom: 11px;
}

.close {
    overflow: hidden;
    height: 33px;
    padding-bottom: 0;
}

.expande-button-wrap {
    width: 30px;
    height: 22px;
    background:red ;
}

.expande-button {
    text-align: right;
    vertical-align: middle;
    color: #5995ef;
    font-size: 14px;
    line-height: 22px;
}

</style>
