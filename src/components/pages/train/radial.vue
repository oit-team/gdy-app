
<template>
  <!-- app并没用到该页面，可删除 -->
  <div class="radial" :style="{'width':size+'px','height':size+'px'}">
    <div class="percentloop">
      <div class="circle-left" :style="{ backgroundColor: color}">
        <div :style="{ backgroundColor: backgroundColor}" ref="leftcontent"></div>
      </div>
      <div class="circle-right" :style="{ backgroundColor: color}">
        <div :style="{ backgroundColor: backgroundColor}" ref="rightcontent"></div>
      </div>
      <div class="content-wrap">
        <span class="content-number" :title="percent+'%'">{{percent}}%</span>
        <span class="content-text" :title="content">{{content}}</span>
      </div>
    </div>
  </div>
</template>
<script>
// Events: animationFinished

export default {
  name: 'radial',
  props: {
    size: {
      type: [String, Number],
      default: 155
    },
    content: String,
    color: {
      type: String,
      default: '#00b3ef'
    },
    backgroundColor: {
      type: String,
      default: '#7fd9f7'
    },
    percentNum: {
      type: [String, Number],
      default: 0
    },
    speed: {
      // suggest 1~3
      type: [String, Number],
      default: 1
    }
  },

  data () {
    return {
      percent: 0,
      initDeg: 0,
      timeId: null,
      animationing: false
    }
  },

  created () {
    this.goRotate(this.transformToDeg(this.percentNum))
  },

  watch: {
    'percentNum': function (val) {
      if (this.animationing) return
      this.goRotate(this.transformToDeg(val))
    }
  },

  methods: {
    transformToDeg (percent) {
      let deg = 0
      if (percent >= 100) {
        deg = 360
      } else {
        deg = parseInt(360 * percent / 100)
      }
      return deg
    },

    transformToPercent (deg) {
      let percent = 0
      if (deg >= 360) {
        percent = 100
      } else {
        percent = parseInt(100 * deg / 360)
      }
      return percent
    },

    //  > 180
    rotateLeft (deg) {
      this.$refs.leftcontent.style.transform = 'rotate(' + (deg - 180) + 'deg)'
    },

    //  < 180
    rotateRight (deg) {
      this.$refs.rightcontent.style.transform = 'rotate(' + deg + 'deg)'
    },

    goRotate (deg) {
      this.animationing = true
      this.timeId = setInterval(() => {
        if (deg > this.initDeg) {
          this.initDeg += Number(this.speed)
          if (this.initDeg >= 180) {
            this.rotateLeft(this.initDeg)
            this.rotateRight(180)
          } else {
            this.rotateRight(this.initDeg)
          }
        } else {
          this.initDeg -= Number(this.speed)
          if (this.initDeg >= 180) {
            this.rotateLeft(this.initDeg)
          } else {
            this.rotateLeft(180)
            this.rotateRight(this.initDeg)
          }
        }
        this.percent = this.transformToPercent(this.initDeg)
        const remainer = Number(deg) - this.initDeg
        if (Math.abs(remainer) < this.speed) {
          this.initDeg += remainer
          if (this.initDeg > 180) {
            this.rotateLeft(deg)
          } else {
            this.rotateRight(deg)
          }
          this.animationFinished()
        }
      }, 10)
    },

    animationFinished () {
      this.percent = this.percentNum
      this.animationing = false
      clearInterval(this.timeId)
      this.$emit('animationFinished')
    }
  }
}
</script>

<style>
.radial .percentloop {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.radial .circle-left,
.radial .circle-right {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
}

.radial .circle-left>div,
.radial .circle-right>div {
  width: 100%;
  height: 100%;
  transform-origin: right center;
  /* transition: all .5s linear; */
}

.radial .circle-right {
  left: 50%;
}

.radial .circle-right>div {
  transform-origin: left center;
}

.radial .content-wrap {
  position: absolute;
  top: 3%;
  bottom: 3%;
  left: 3%;
  right: 3%;
  background-color: #fff;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #000;
}

/* .radial .content-wrap .content-number {
  font-size: 12px;
  padding: 2.5px 0 3.5px 0;
  cursor: pointer;
}

.radial .content-wrap .content-text {
  display: inline-block;
  max-width: 45px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
} */
.radial .content-wrap .content-number {
  font-size: 18px;
  font-weight: 700;
  padding: 2.5px 0 3.5px 0;
  cursor: pointer;
}

.radial .content-wrap .content-text {
  display: inline-block;
  max-width: 45px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
</style>
