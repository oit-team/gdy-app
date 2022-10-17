<template>
  <div class="page">
    <Header title="选择搭配"></Header>
    <van-tabs v-model="selectClass" @click="onClick">
      <van-tab v-for="(item, index) in classList" :key="item.dictitemCode" :title="item.dicttimeDisplayName">
        <van-empty
          v-if="showEmpty"
          description="暂无数据"
        ></van-empty>
        <div v-else class="w-full">
          <van-pull-refresh
            v-model="isLoading"
            class="ub-refresh"
            success-text="加载成功"
            @refresh="isLoading = true, formData.pageNum = 1, getData()"
          >
            <van-list
              v-model="loading"
              :finished="finished"
              :error.sync="error"
              error-text="请求失败，点击重新加载"
              finished-text="没有更多了"
              :immediate-check="false"
              @load="getData"
            >
              <div class="content-box flex w-full flex-wrap text-sm p-2 box-border">
                <div
                  class="list-item"
                  v-for="(item, index) in indexData"
                  :key="item.id"
                >
<!--                  <div class="tipBox">-->
<!--                    <img v-if="item.styleFlag == 1" class="key-tip-img" src="static/images/icon/tip.png" alt="">-->
<!--                    <img v-if="item.leaFlag == 1" class="learnIcon"  src="static/images/icon/new.png" alt="">-->
<!--                    <img v-if="item.videoFlag == 0" class="videoIcon"  src="static/images/icon/video.png" alt="">-->
<!--                  </div>-->
<!--                  _chose 是否已经添加   false  未添加  true 已添加-->
                  <div class="addIcon">
                    <img v-show="!item._chose" src="static/images/icon/add1.png" alt="" @click.stop="addSingle(item, index)">
                    <img v-show="item._chose" src="static/images/icon/a-reduce.png" alt="" @click.stop="delSingle(item, index)">
<!--                    <van-image-->
<!--                      :src="item._chose ? 'static/images/icon/a-reduce.png' : 'static/images/icon/add1.png'"-->
<!--                      @click="onSingle(item, index)"-->
<!--                    ></van-image>-->
                  </div>
                  <van-image
                    height="110"
                    fit="cover"
                    :src="item.collImgUrl"
                  />
                  <div class="list-info flex flex-col items-center">
                    <p class="van-multi-ellipsis--l2 w-full h-10">
                      {{item.collName}}
                    </p>
                    <div>
                      {{ item.collImg }}
                    </div>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
<!--    底部确认-->
    <div class="page-btm bgf !absolute bottom-0 text-sm flex justify-end w-full items-center p-2 box-border" @click="show = true">
      <div class="mr-2">
        已选中：{{ selectImg.length }}/15
      </div>
      <van-button class="py-2" size="mini" type="info" round>确认</van-button>
    </div>
    <!--    弹出层-->
    <van-popup v-model="show" position="buttom" :style="{ height: '30%' }">
      <div class="pop-scroll">
          123
      </div>
    </van-popup>
  </div>
</template>

<script>
import Header from '@/components/comps/header/header'
import { dictitemInfoAllMethod } from "@/api/mould";
import {getCollocationList} from "../../api/mould";

export default {
  name: "Collocation",
  components: {
    Header,
  },
  data: () => ({
    classList: [],
    selectClass: 0,
    indexData: [],
    showEmpty: false,
    finished: false,
    isLoading: false,
    loading: false,
    error: false,
    formData: {
      pageNum: 1,
      pageSize: 18,
      brandId: localStorage.getItem('brandId'),
      styleCategory: '',
    },
    selectImg: [],
    show: false,
  }),
  activated() {
    this.getClass()
  },
  methods: {
    // 获取商品列表数据
    getData() {
      this.formData.styleCategory = this.classList[this.selectClass].dicttimeDisplayName
      getCollocationList({
        ...this.formData,
      }).then((res) => {
        if (res.head.status !== 0) {
          this.$toast(res.head.msg)
          this.error = true
          return false
        } else {
          if (this.formData.pageNum === 1) {
            this.indexData = res.body.collocationList
            if (res.body.collocationList.length === 0) this.showEmpty = true
            if (res.body.totalCount <= 20) {
              this.finished = true
            } else {
              this.formData.pageNum++
            }
          } else {
            this.indexData = [...this.indexData, ...res.body.collocationList]
            if (res.body.totalCount === this.indexData.length) {
              this.finished = true
            } else if (res.body.totalCount > this.indexData.length) this.formData.pageNum++
          }
          this.indexData.forEach((run) => {
            run._chose = false
          })
        }
      }).catch(() => {
        this.showEmpty = true
        this.error = true
        this.finished = true
      }).finally(() => {
        this.loading = false
        this.isLoading = false
      })
    },
    //获取分类列表tab
    getClass() {
      dictitemInfoAllMethod({
        brandId: localStorage.getItem('brandId'),
        type: 'styleCategory',
        userId: localStorage.getItem('userId'),
      }, {
        cmd: 100009
      }).then((res) => {
        if (res.head.status === 0) {
          this.classList = res.body.result
          this.getData()
        }
      })
    },
    // 切换tab
    onClick(name, title) {
      this.indexData = []
      this.showEmpty = false
      this.finished = false
      this.error = false
      this.selectClass = name
      this.getData()
    },
    // 添加照片到数组
    addSingle(item, index) {
      const num = this.selectImg.length + item.imgResInfo.length
      if (num > 15) {
        this.$toast('最多只能选择15张图片')
        return false
      } else {
        item._chose = true
        this.$set(this.indexData, index, item)
        this.selectImg.push(...item.imgResInfo)
      }
    },
    // 删除照片
    delSingle(item, index) {
      item._chose = false
      this.$set(this.indexData, index, item)
      item.imgResInfo.forEach(e => {
        this.selectImg.forEach((i, index) => {
          if (e.resId === i.resId) {
            this.selectImg.splice(index, 1)
          }
        })
      })
    },
  },
}
</script>

<style scoped>
.page{
  background-color: rgb(245, 245, 245);
}
.list-item{
  position: relative;
  width: 32%;
  margin-right: 5px;
  margin-bottom: 5px;
  background-color: #fff;
}
.list-item > .van-image{
  width: 100%;
}
.list-item::marker{
  content: '';
}
.list-item:nth-child(3n){
  flex: 1;
  margin-right: 0;
}
.tipBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%
}
.tipBox > img{
  width:14px;
}
.addIcon {
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  color: #fff;
  font-size: 26px;
  line-height: 30px;
  text-align: center;
  z-index: 1;
}
.addIcon > img{
  width:25px;
  height: 25px;
  margin-top:2.5px;
}
.van-button{
  padding: 0 10px !important;
}
.bgf{
  background-color: #fff;
}
.pop-scroll{
  overflow-y: auto;
}
</style>
