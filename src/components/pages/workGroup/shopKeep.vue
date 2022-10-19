<template>
<VueActions id="shopKeep" data="shop">
    <div class="headBox">
        <backHeader title="店务手册" style="background-color: #f5f5f5;">
            <span class="head-class f-l" slot="left" @click="back">
                <slot>
                    <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
                </slot>
            </span>
            <span class="head-class place-label" slot="right"></span>
        </backHeader>
    </div>
    <div class='mainCon'>
        <div class='testCon'>
            <Scroll class="left" :probeType='3' :bounce='false' :listenScroll='true' :pullDown="false" :pullUp="false">
                <ul class="module-ul">
                    <li v-for="(item,index) of list" :key="index" :class="{active: isActive === index}" @click="changeClass(item.dicttimeDisplayName,index)" v-actions:shopItemLeft.click>{{item.dicttimeDisplayName}}
                        <span class="borderActive"></span>
                    </li>
                </ul>
            </Scroll>
            <Scroll class="right" :probeType='3' :bounce='false' :listenScroll='true' :pullDown="false" :pullUp="false">
                <ul class="module-ul" v-if='goodList.length>0'>
                    <li v-for="(item,index) in goodList" :key="index" @click="toNewsDetail(item.id,item.browse)" v-actions:shopItemRight.click>
                        <div class="tit" style="text-align:left">
                            <span class="title">{{item.nTitle}} </span>
                            <img v-if="item.browse==1" class="readNo" src="../../../../static/images/icon/read-no.png" alt="">
                            <img v-else class="readed" src="../../../../static/images/icon/readed.png" alt="">
                        </div>
                    </li>
                </ul>
                <ul class="noData" v-else>
                    <li>
                        <noGood></noGood>
                    </li>
                </ul>
            </Scroll>
        </div>
    </div>
</VueActions>
</template>

<script>
import Header from "../../comps/header/header";
import backHeader from "../../comps/common/commonBackHeader";
import noGood from "../../comps/common/noGoods";
export default {
    name: "shopKeep",
    components: {
        Header,
        backHeader,
        noGood
    },
    data() {
        return {
            activeKey: 0,
            list: [],
            isActive: 0,
            moduleName: "",
            pageSize: 99999,
            pageNum: 1,
            goodList: [],
            newsLoading: true,
        };
    },
    created() {},
    mounted() {

    },
    activated() {
        if (localStorage.loadShopFlag && localStorage.loadShopFlag == 'true') {
            this.isActive = 0;
            this.getCateList()
            localStorage.removeItem('loadShopFlag');
        }
    },
    watch: {
        $route(to, from) {
            if (from.path == "/newsDetail") {
                for (var i = 0; i < this.goodList.length; i++) {
                    if (this.goodList[i].id == from.query.id) {
                        this.goodList[i].browse = 1;
                    }
                }
            }
        }
    },
    methods: {
        changeClass(item, i) {
            this.isActive = i;
            this.moduleName = item;
            this.newsLoading = true;
            this.getShopList();
        },
        //点击跳转详情页
        toNewsDetail(id, browser) {
            this.$router.push({
                path: "/newsDetail",
                query: {
                    id: id,
                    isBrowser: browser,
                    fromPath: 'shopKeep'
                }
            })
        },
        back() {
            this.$router.go(-1)
        },
        //获取店务列表接口
        getShopList() {
            let _this = this;
            let params = {
                USERID: localStorage.userId,
                status: 1,
                underModule: _this.moduleName,
                pageNum: _this.pageNum,
                PageSize: _this.pageSize,
                type: 1,
            };
            let jsonParam = this.GLOBAL.g_paramJson(params, 90004);
            _this.$axios.post("/work/noticeInfo/noticeInfoAllMethod", jsonParam).then(function (res) {
                _this.newsLoading = false;
                if (res.data.head.status == "0") {
                    // 赋值给data
                    _this.goodList = res.data.body.resultList;
                } else {
                    _this.$toast(res.data.head.msg);
                }
            }).catch(function (error) {
                console.log(error);
                // _this.$toast("接口调用失败");
            });
        },
        // 查询店务类别接口
        getCateList() {
            let _this = this;
            let con = {
                "userId": localStorage.userId,
                "brandId": localStorage.brandId,
                "type": "SHOP_AFFAIR",
            }
            let jsonParam = _this.GLOBAL.g_paramJson(con, 100009);
            _this.$axios.post("/goods/dictitemInfo/dictitemInfoAllMethod", jsonParam).then((res) => {
                if (res.data.head.status == 0) {
                    _this.list = res.data.body.result;
                    _this.moduleName = _this.list[0].dicttimeDisplayName;
                    this.getShopList();
                } else {
                    _this.$toast(res.data.head.msg);
                }
            }).catch(err => {
                console.log(err)
            });
        },
    },
};
</script>

<style lang="less" scoped>
#shopKeep {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f3f3f3;

    .mainCon {
        flex: 1;
        overflow: hidden;
        margin-top: 10px;
        margin-bottom: 10px;

        .testCon {
            width: 97%;
            height: 100%;
            display: flex;
            box-sizing: border-box;

            .left {
                width: 135px;
                border-radius: 10px;
                margin-left: 7.5px;
                margin-right: 7.5px;
                background: white;

                .active {
                    position: relative;
                    color: #000;
                    font-size: 16px;
                    font-weight: bolder;

                    .borderActive {
                        width: 5px;
                        height: 15px;
                        background: #5ea1fe;
                        position: absolute;
                        left: 0;
                        top: 16px;
                    }

                }

                li {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    font-size: 14px;
                    padding: 12.5px;
                    color: #999;
                    box-sizing: border-box;
                    margin: 0 15px;
                    height: 0.96rem;
                }
            }

            .right {
                flex: 1;
                border-radius: 10px;
                background: white;

                li {

                    font-size: 14px;
                    padding: 12.5px;
                    padding-right: 0;
                    color: #000000;
                    box-sizing: border-box;
                    margin: 0 15px;
                    height: 0.96rem;

                    .title {
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        display: inline-block;
                        width: 110px;
                    }
                }

                .readed {
                    width: 15px;
                    height: 12.5px;
                    float: right;
                    margin-top: 2.5px;
                }

                .readNo {
                    width: 15px;
                    height: 15px;
                    float: right;
                }
            }
        }

    }
}
</style>
