<template>
  <div>
    <!-- 顶部图片 -->
    <div>
      <div></div>
      <div>1/6</div>
    </div>
    <!-- 信息 -->
    <div class="goods_container">
      <h4 class="goods_name">双面呢韩版森系毛呢羊毛绒</h4>
      <p class="goods_describe">时尚潮流，高密度3复合面料，羊毛呢大衣，4级保暖防 脱水</p>
      <div class="goods_wrap">
        <div class="goods_price">¥<strong>1239</strong></div>
        <div>
          <span>推荐: </span>
          <span
            v-for="(item, key) in [1,2,3,4,5]"
            :key="key"
            class="star"
            :class="{highlighted:key<4}"
          ></span>
        </div>
      </div>
    </div>
    <div class="spacing"></div>
    <!-- 基础信息 -->
    <div class="wrap">
      <h4 class="title"><span></span>&nbsp;商品基础信息&nbsp;<span></span></h4>
      <p class="subtitle">Commodity basic</p>
      <div>
        <ul class="basic_info">
          <li
            v-for="(item, key) in basic_info"
            :key="key"
          >
            <span class="name">{{item.name}}</span>:
            <span class="value">{{item.value}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="spacing"></div>
    <!-- 卖点 -->
    <div class="wrap">
      <h4 class="title"><span></span>试试这样卖<span></span></h4>
      <p class="subtitle">Try selling like this</p>
      <ul class="selling_point">
        <li><span class="name"><i class="dot"></i>【面料卖点】：</span> <span class="value">100%山羊绒</span> </li>
        <li><span class="name"><i class="dot"></i>【设计卖点】：</span><span class="value">粗花呢质感，精致镶边，优雅高贵</span> </li>
        <li><span class="name"><i class="dot"></i>【穿着卖点】：</span><span class="value">显身材</span> </li>
      </ul>
    </div>
    <div class="spacing"></div>
    <!-- 搭配 -->
    <div class="wrap">
      <h4 class="title"><span></span>试试这样搭<span></span></h4>
      <p class="subtitle">Try this way </p>
      <div class="collocation">
        <div class="col_img_a">
          <img
            height="100%"
            src="./images/94642406403105424.png"
            alt=""
          >
        </div>
        <div class="col_img_b">
          <img
            height="100%"
            src="./images/23172134944337573232.png"
            alt=""
          >
        </div>

      </div>
    </div>
    <div class="spacing"></div>
    <!-- 推荐 -->
    <div
      class="wrap"
      style="background:#F8F8F8"
    >
      <h4 class="title"><span></span>搭配单品推荐<span></span></h4>
      <p class="subtitle">Matching single product recommendation</p>
      <div>
        <ul class="recommended">
          <li
            v-for="(item, key) in [1,2,3]"
            :key="key"
          >
            <div class="rec_item">
              <img
                width="100%"
                src="./images/23172134944337573212.png"
                alt=""
              >
              <p class="name">2018新款围巾羊绒围巾 披肩两用灰色羊毛女</p>
              <p class="rec_bottom"><span class="price"><i style="">¥</i> 1239</span><span class="people_buy">{{'6'}}人已买</span></p>
            </div>

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
      basic_info: [
        { name: '所属', value: '春一波' },
        { name: '洗涤', value: '手洗' },
        { name: '编号', value: '4657682' },
        { name: '款式', value: '小香风' },
        { name: '材质', value: '羊绒' },
        { name: '系列', value: '优雅香颂' },
        { name: '廓形', value: 'S型' },
        { name: '颜色', value: '蓝色' },
        { name: '类别', value: '连衣裙' },
      ]
    }
  }
}
</script>

<style scoped>
.goods_container {
  padding: 14.5px 15px 10px 15px;
}
.goods_name {
  font-size: 18px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  padding: 0 0 11px 0;
  /* line-height: 78px; */
}
.goods_describe {
  font-size: 14px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
  line-height: 16px;
  padding: 0 0 7.5px 0;
}
.goods_wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.goods_price {
  font-size: 14px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(184, 5, 2, 1);
}
.goods_price strong {
  font-size: 27px;
  font-family: KaiTi;
  font-weight: 400;
}
.star {
  display: inline-flex;
  vertical-align: text-top;
  width: 15.5px;
  height: 14px;
  margin-right: 1px;
  background: url("./images/star_no@2x.png") center / contain no-repeat;
}
.highlighted {
  background: url("./images/star@2x.png") center / contain no-repeat;
}
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 16px;
}
.title span {
  width: 15px;
  height: 1px;
  background: rgba(153, 153, 153, 1);
}
.subtitle {
  text-align: center;
  font-size: 9px;
  font-family: ArialMT;
  font-weight: 400;
  color: rgba(199, 199, 199, 1);
  line-height: 16px;
  margin-bottom: 13px;
}
.basic_info {
  background: #f7f7f7;
  display: flex;
  flex-wrap: wrap;
  margin: 0 7.5px;
  padding-top: 17px;
}

.basic_info li {
  width: 50%;
  font-size: 14px;
  font-family: PingFang-SC-Regular;
  font-weight: 400;
  line-height: 16px;
  margin-bottom: 15.5px;
  padding-left: 20px;
  box-sizing: border-box;
}
.name {
  color: #c7c7c7;
}
.value {
  color: #999;
}
.spacing {
  height: 10px;
  background: #f8f8f8;
}
.wrap {
  padding: 21px 0;
}
.selling_point {
  padding: 0 15px 0;
}
.selling_point li {
  margin-bottom: 14px;
}
.dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  background: rgba(201, 201, 201, 1);
  border-radius: 50%;
  margin-right: -2.5px;
  margin-bottom: 2px;
}
.collocation {
  display: flex;
  justify-content: space-between;
  height: 146.5px;
  padding: 0 45px;
}
.col_img_a {
  height: 100%;
  width: 50%;
  text-align: center;
}
.col_img_b {
  height: 100%;
  width: 50%;
  text-align: center;
}
.recommended {
  display: flex;
  flex-wrap: wrap;
  padding: 0 2.5px 0 12.5px;
}
.recommended li {
  width: 50%;
  margin-bottom: 8px;
}
.rec_item {
  background: #fff;
  margin-right: 10px;
}
.rec_item .name {
  margin: 14.5px 11.5px 9.5px;
  font-size: 14px;
  font-family: ArialMT;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 16px;
}
.rec_item .rec_bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 11.5px 16.5px;
}
.rec_item .rec_bottom .price {
  font-size: 18px;
  font-family: KaiTi;
  font-weight: 400;
  color: rgba(184, 5, 2, 1);
  line-height: 16px;
}
.rec_item .rec_bottom i {
  font-size: 14px;
  font-style: normal;
}
.rec_item .people_buy {
  font-size: 12px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
  line-height: 16px;
}
</style>
