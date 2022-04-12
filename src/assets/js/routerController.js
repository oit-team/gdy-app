import { Form } from "vant";

var controller = function(vue){
    this.vue = vue;
    this.history = [];
    this.curr = null;
    this.isGo = null;
    let _this = this;

    vue.mixin({
        beforeRouteLeave (to, from, next) {

            if(_this.history.length>0&&_this.history[_this.history.length-1].fullPath==to.fullPath){
                _this.history.pop();
                _this.isGo = false;
            }else{
                let fromPath = from.fullPath.split("?")[0];
                let toPath = to.fullPath.split("?")[0];
                console.log(fromPath,toPath)

                // 有些页面go(-1)它不符合逻辑，push跳转的话页面左右滑动效果不对，需要针对某些push跳转路径做排除
                // 搭配路由跳转判断
                if((fromPath == '/myCollocation' && toPath == '/index') || (fromPath == '/addCollocation' && toPath == '/myCollocation') || 
                // 微课堂路由跳转判断
                (fromPath == '/classList' && toPath == '/index') || (fromPath == '/checkRecord' && toPath == '/classList') || (fromPath == '/taskTest' && toPath == '/checkRecord') ||

                (fromPath == '/taskReport' && toPath == '/checkRecord') ||(fromPath == '/checkRecord' && toPath == '/taskGoodsTask')|| 

                (fromPath == '/taskTestTopic' && toPath == '/taskReport') || (fromPath == '/taskReport' && toPath == '/taskCheckTask') ||
                (fromPath == '/taskCheckTask' && toPath == '/taskGoodsTask') || (fromPath == '/taskGoodsTask' && toPath == '/index') || (fromPath == '/taskBatch' && toPath == '/taskCheckTask') || (fromPath == '/taskCheckTask' && toPath == '/index') || (fromPath == '/taskReport' && toPath == '/taskBatch') || (fromPath == '/taskTestTopic' && toPath == '/taskBatch')){
                
                  _this.isGo = false;
                }else{
                    _this.history.push(from);
                    _this.isGo = true;
                }
                // _this.history.push(from);
                // _this.isGo = true;
            }
            _this.curr = to;
            // console.log(_this.history,_this.history.length,_this.history.length-1)
            next();
        }
    });

    _this.getHistoryLast=function(){
        if(_this.history.length==0){
            return null;
        }
        return _this.history[_this.history.length-1];
    }
}

export default{
    routerController:controller
}
