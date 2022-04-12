<template>
  <div class="slide" ref="slide">
    <div class="slide-group" ref="slideGroup">
      <div class="img_wrapper">
        <img src="static/images/dev/seriesLabelBG@2x.png">
      </div>
      <div class="img_wrapper">
        <img src="static/images/dev/seriesLabelBG@2x.png">
      </div>
      <div class="img_wrapper">
        <img src="static/images/dev/seriesLabelBG@2x.png">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { addClass } from './dom.js'
  const COMPONENT_NAME = 'slide'
  export default {
    name: COMPONENT_NAME,
    props: {
      loop: {
        type: Boolean,
        default: false
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      },
      showDot: {
        type: Boolean,
        default: false
      },
      click: {
        type: Boolean,
        default: true
      },
      threshold: {
        type: Number,
        default: 0.3
      },
      speed: {
        type: Number,
        default: 400
      }
    },
    data() {
      return {

      }
    },
    mounted() {
      this.init();
    },
    methods: {
      init(){
        // this.
        let _this = this;
        this._setSlideWidth();
        setTimeout(function(){
          _this.children[0].style;
        },2000);
      },
      _setSlideWidth(isResize) {
        // debugger
        this.children = this.$refs.slideGroup.children;
        let width = 0;
        let slideWidth = this.$refs.slide.clientWidth;
        this.slideWidth = slideWidth;
        let childrenWidth=this.children[0].clientWidth;
        this.childrenWidth = childrenWidth;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slide-item');
        }
        this.children[0].style.transform = 'translateX('+(-303)+'px) scale(0.83)'
        this.children[1].style.transform = 'translateX('+((slideWidth-childrenWidth)/2)+'px) scale(1)'
        this.children[2].style.transform = 'translateX('+355+'px) scale(0.83)'
      }
    },
    watch: {

    }
  }
</script>
<style scoped>
.slide{
  width: 100%;
  height:100%;
}
.slide-group{
  width: 100%;
  height:100%;
  overflow: hidden;
  position: relative;
}

.img_wrapper{
  width:328px;
  height:124.5px;
  position: absolute;
  overflow: hidden;
  text-align: center;
}
.img_wrapper img{
  width:328px;
  height:124.5px;
}
</style>
