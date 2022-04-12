<template>
  <div class="slide" ref="slide">
    <div class="slide-group" ref="slideGroup">
      <slot>
      </slot>
    </div>
    <div v-if="showDot" class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" :key="index"></span>
    </div>
    <div class="page_box" v-if="showDot">
      {{currentPageIndex+1}}/{{pages}}
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { addClass } from './dom.js'
  import BScroll from 'better-scroll'
  const COMPONENT_NAME = 'slide'
  export default {
    name: COMPONENT_NAME,
    props: {
      loop: {
        type: Boolean,
        default: true
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
        default: true
      },
      click: {
        type: Boolean,
        default: false
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
        dots: [],
        currentPageIndex: 0,
        pages:0
      }
    },
    mounted() {
      this.update()
      window.addEventListener('resize', () => {
        if (!this.slide || !this.slide.enabled) {
          return
        }
        clearTimeout(this.resizeTimer)
        this.resizeTimer = setTimeout(() => {
          if (this.slide.isInTransition) {
            this._onScrollEnd()
          } else {
            if (this.autoPlay) {
              this._play()
            }
          }
          this.refresh()
        }, 60)
      })
    },
    activated() {
      if (!this.slide) {
        return
      }
      this.slide.enable()
      let pageIndex = this.slide.getCurrentPage().pageX;
      // console.log(pageIndex)
      this.slide.goToPage(pageIndex, 0, 0)
      this.currentPageIndex = pageIndex
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated() {
      this.slide.disable()
      clearTimeout(this.timer)
    },
    beforeDestroy() {
      this.slide.disable()
      clearTimeout(this.timer)
    },
    methods: {
      update() {
        if (this.slide) {
          this.slide.destroy()
        }
        this.$nextTick(() => {
          this.init()
        })
      },
      destroy(){
        if(this.slide){
          this.slide.destroy();
        }
      },
      refresh() {
        this._setSlideWidth(true)
        this.slide.refresh()
      },
      prev() {
        this.slide.prev()
      },
      next() {
        this.slide.next()
      },
      init() {
        clearTimeout(this.timer)
        this.currentPageIndex = 0
        this._setSlideWidth()
        if (this.showDot) {
          this._initDots()
        }
        this._initSlide()
        if (this.autoPlay) {
          this._play()
        }
      },
      _setSlideWidth(isResize) {
        this.children = this.$refs.slideGroup.children
        let width = 0
        let slideWidth = this.$refs.slide.clientWidth
        // console.log(this.children.length)
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slide-item')
          child.style.width = slideWidth + 'px'
          width += slideWidth;
        }
        if (this.loop && !isResize) {
          width += 2 * slideWidth;
        }
        this.$refs.slideGroup.style.width = width + 'px';
        // console.log(this.$refs.slideGroup.style.width)
      },
      _initSlide() {
        this.pages = this.$refs.slideGroup.children.length;
        this.slide = new BScroll(this.$refs.slide, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: this.threshold,
            speed: this.speed
          },
          bounce: false,
          stopPropagation: false,
          click: this.click,
          preventDefaultException: { tagName: /^(IMG)$/ }
        })
        this.slide.on('scrollEnd', this._onScrollEnd)
        this.slide.on('touchEnd', () => {
          if (this.autoPlay) {
            this._play()
          }
        })
        this.slide.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      _onScrollEnd() {
        // debugger
        let pageIndex = this.slide.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        if (this.autoPlay) {
          this._play()
        }
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _play() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slide.next()
        }, this.interval)
      }
    },
    watch: {
      loop() {
        this.update()
      },
      autoPlay() {
        this.update()
      },
      speed() {
        this.update()
      },
      threshold() {
        this.update()
      }
    }
  }
</script>

<style scoped lang="less">
.page_box{
  position: absolute;
  // left:50%;
  // margin-left:-24px;
  // width: 48.5px;
  // height:19px;
  // background-color:#00A2EA;
  // background-color: #1978EF;
  // background-color: #333;
  background-color: rgba(33, 33, 33, 0.3);
  border-radius: 9.5px;
  bottom: 10px;
  right:14px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  font-weight: 200;
  padding:2px 17px;
  font-weight:bold;
}
.slide{
  min-height: 0.5px;
  .slide-group{
    position: relative;
    overflow: hidden;
    display: inline-flex;
    .slide-item{
      box-sizing: border-box
    }
  }
  .dots{
    position: absolute;
    right: 0;
    left: 0;
    bottom: 6px;
    transform: translateZ(0.5px);
    text-align: center;
    font-size: 0;
    // .dot{
    //   display: inline-block;
    //   margin: 0 2px;
    //   width: 4px;
    //   height: 4px;
    //   border-radius: 50%;
    //   background: green;
    //   &.active{
    //     width: 10px;
    //     border-radius: 2.5px;
    //     background:white;
    //   }
    // }

  }
}
</style>

