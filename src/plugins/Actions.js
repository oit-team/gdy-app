import VueActions, { component, directive } from '@oit/vue-actions'
import { addUserBehaviorRecord } from '@/api/common'
import Vue from 'vue'

Vue.use(VueActions, {
  onRecords(data, otherData) {
    if (otherData === undefined) {
      console.error('组件 VueActions 必须提供data参数')
      return
    }
    data.page = otherData
    data.records = data.records.filter(({ actions }) => !!(actions.click + actions.duration))
    addUserBehaviorRecord(data)
  }
})

Vue.component('VueActions', component)
Vue.directive('Actions', directive)
