import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let store = new Vuex.Store({
  // 数据仓库
  state:{
    recommentReason:"",    // 推荐理由,
    collImgList:[],  // 搭配照

  },
  getters:{

  },
  // 修改数据仓库的事件
  mutations: {
    delUpImg (state,detail) {
      state.collImgList.splice(detail.index,1);
    }
  },
  // 异步修改数据仓库
  actions:{
    // setNewsNum(context,val){
    //   context.commit("changeNewsNum",val)
    // }

  }

})

export default store;