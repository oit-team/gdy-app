import VueActions, { component, directive } from '@oit/vue-actions'
import { addUserBehaviorRecord } from '@/api/common'
import Vue from 'vue'

Vue.use(VueActions, {
  onRecords(data, otherData) {
    if (otherData === undefined) {
      console.error('组件 VueActions 必须提供data参数')
      return
    }
    // 1分钟-- 超过一分钟按一分钟处理
    const max = 1000 * 60 * 1
    data.page = otherData
    data.duration = Math.min(max, data.duration)
    // 过滤无效数据
    data.records = data.records.filter(({ actions }) => {
      const valid = !!(actions.click + actions.duration)

      if (valid)
        actions.duration = Math.min(max, actions.duration)

      return valid
    })
    addUserBehaviorRecord(data)
  }
})

Vue.component('VueActions', component)
Vue.directive('Actions', directive)
