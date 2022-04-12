<template>
  <div class="container">
    <!-- 搜索 -->
    <div class="hd_select">
      <div class="hd_input_wrap">
        <span class="icon select"></span>
        <span>新品上架</span>
      </div>

      <div class="icon hd_right_btn"></div>
    </div>
    <!-- 顶部导航 -->
    <div class="hd_container">
      <ul
        class="hd_tab_wrap"
        :style="{width:2.72*[1,2,3,4,5,6,6,7,7,6].length+ 'rem' }"
      >
        <li
          v-for="(item, key) in [1,2,3,4,5,6,6,7,7,6]"
          :key="key"
          class="hd_tab_item"
          :class="{active: key === hd_tab_index}"
          @click="set_tab_index(key,'hd')"
        >
          18秋冬
        </li>
      </ul>
    </div>
    <div class="content">
      <!-- 左侧导航 -->
      <div class="left_tab">
        <ul>
          <li
            v-for="(item, key) in [1,3,4] "
            :key="key"
            :class="{active: key === left_tab_index}"
            class="left_tab_item"
            @click="set_tab_index(key,'left')"
          >
            <p>{{'日常'}}</p>
          </li>
        </ul>
      </div>
      <!-- 右侧内容 -->
      <div class="right_content">
        <p class="top">
          <span></span>&nbsp;优品18秋冬系列&nbsp;<span></span>
        </p>
        <ul class="goods_list">
          <li
            v-for="(item, key) in [1,2,3,4]"
            :key="key"
          >
            <div class="img_wrap">
              <img
                height="100%"
                src="../../../../static/images/collocation/f4df5f1aff4effc76ea04774f56a37a1.png"
                alt=""
              >
            </div>

            <p class="goods_name">通勤装</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hd_tab_index: 0,
      left_tab_index: 0
    }
  },
  methods: {
    set_tab_index(i, type) {
      if (type === 'hd') {
        this.hd_tab_index = i
      } else {
        this.left_tab_index = i
      }

    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.hd_select {
  display: flex;
  margin: 5px 0;
}
.hd_input_wrap {
  border-radius: 16px;
  background: rgba(244, 244, 244, 1);
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 37.5px;
  flex: 1;
  padding: 0 10px;
}
.icon {
  width: 15px;
  height: 15px;
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
  background: url("../../../../static/images/collocation/select@2x.png") center /
    contain no-repeat;
}
.hd_container {
  width: 100vw;
  overflow: auto;
  border-bottom: 0.5px solid #ebebeb;
}
.hd_container::-webkit-scrollbar {
  height: 0 !important;
}
.hd_tab_wrap {
  font-size: 16px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 17.5px;
  padding-bottom: 2.5px;
  overflow: hidden;
}
.hd_tab_item {
  float: left;
  width: 2.72rem /* 204/75 */;
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: #999999;
}
.hd_tab_item.active {
  position: relative;
  color: #333333;
}
.content {
  flex: 1;
  display: flex;
}
.hd_tab_item.active::after {
  position: absolute;
  content: "";
  display: block;
  left: 0;
  right: 0;
  bottom: -3px;
  height: 3px;
  background: #00a8c5;
}
.left_tab {
  width: 79.5px;
  height: 100%;
  background: #f6f6f6;
}
.left_tab_item {
  height: 50px;
  padding: 0.5px;
}
.left_tab_item p {
  margin: 14px 8px;
  height: 22px;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  color: rgba(51, 51, 51, 1);
}
.left_tab .active {
  background: #fff;
}
.left_tab .active p {
  background: rgba(0, 168, 197, 1);
  border-radius: 11px;
  color: #fff;
}
.right_content {
  flex: 1;
}
.right_content .top {
  /* background: #fff; */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 13px;
  height: 25px;
  /* line-height: 25px; */
  color: rgba(153, 153, 153, 1);
  margin-top: 10px;
}
.right_content .top span {
  width: 15px;
  height: 0.5px;
  background: rgba(153, 153, 153, 1);
}
.goods_list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 21px;
}
.goods_list li {
  width: 33.33%;
  padding-bottom: 25px;
}
.img_wrap {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.goods_name {
  text-align: center;
  margin-top: 12px;
}
</style>
