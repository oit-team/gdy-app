<template>
  <!-- 横向滚动通用组件 -->
  <VueAction id="horizonScroll" data="horizonScroll">
    <div class="scrollBox" ref = "horizonScrollList">
      <ul class="scrollUl" >
        <li
          class="hori-scroll-item"
          :class="[item[types] == activeVal ?'active':'']"
          v-for="(item,index) in horizonScroll"
          :key="index"
          @click="clickItem(item[types],item[renderName])"
          v-actions:ScrollItem.click
        >
          {{item[renderName]}}
        </li>
      </ul>
    </div>
  </VueAction>
</template>
<script>
export default {
  name:'',
  // horizonScroll   父组件传过来的数组
  // types           父组件传过来的需要判断的动态项的key
  // activtedVal     父组件传过来的当前活动项的值,即types对应的value
  // renderName      父组件传过来的要渲染的值
  props:['horizonScroll','types','activtedVal','renderName'],
  data(){
    return {
      activeVal:null,
      length:null,
      newArr:[],

    }
  },
  created(){
    this.activeVal = this.activtedVal;
    this.length = this.horizonScroll.length;
    // console.log(this.horizonScroll)
    for(let i=0;i<this.horizonScroll.length;i++){
      this.newArr.push(this.horizonScroll[i][this.types]);
    }
    // console.log(this.newArr)

    this.ininListScroll();
  },
  mounted(){},
  methods:{
    ininListScroll(){
      this.$nextTick(()=>{
        if(!this.horizonScrollList){
          this.horizonScrollList = new this.$BScroll(this.$refs.horizonScrollList,{
            scrollX:true,
            scrollY:false,
            click:true,
            bounce:false,
            probeType:3
          });
          // console.log(this.horizonScrollList)
          let el = document.querySelector(".scrollUl .active");
          console.log(el,"当前选中的元素")     // 获取当前滚动的元素并滚动到它的位置
          this.horizonScrollList.scrollToElement(el,0,0)
        }else{
          this.horizonScrollList.refresh();
        }
      })
    },
    clickItem(val,seriesName){
      if(this.activeVal != val){   // 当前项不等于点击项
        let newIndex = this.newArr.indexOf(val);
        // console.log("点击项索引",newIndex);
        let oldIndex = this.newArr.indexOf(this.activeVal);
        // console.log("当前项索引",oldIndex);
        if(oldIndex < newIndex){
          //  console.log("点击元素索引值大于当前元素索引值，向右滑动",oldIndex , newIndex)
          this.horizonScrollList.scrollToElement(event.currentTarget,500);
        }else{
          // console.log("点击元素索引值小于当前元素索引值，向左滑动",oldIndex , newIndex)
          if(!!event.currentTarget.previousElementSibling){
            // console.log("点击元素之前没有了")
            this.horizonScrollList.scrollToElement(event.currentTarget.previousElementSibling,500);
          }else{
            this.horizonScrollList.scrollToElement(event.currentTarget,500);
          }
        }
        this.activeVal = val;
        this.$emit('func',seriesName)
      }


    }
  }

}
</script>
<style lang="less" scoped>
  #horizonScroll{
    width:100%;
    .scrollBox {
      width: 92vw;
      margin:0px auto;
      box-sizing: border-box;
      overflow: hidden;
      border-bottom: 0.5px solid #ebebeb;
      flex-shrink: 0;
      .scrollUl {
        box-sizing: border-box;
        font-size: 16px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        line-height: 17.5px;
        display: inline-flex;
        flex-wrap: nowrap;
        position: relative;
        .hori-scroll-item {
          white-space: nowrap;
          padding-right:25px;
          // border:0.5px solid #000;
          text-align: left;
          height: 40px;
          line-height: 40px;
        }
        .hori-scroll-item.active {
          position: relative;
          color: #00A2EA;
        }
        .hori-scroll-item:last-child{
          padding-right:0px;
        }
      }
    }

  }

</style>
