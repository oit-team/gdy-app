import VueActions from 'vue-actions'
import { addUserBehaviorRecord } from '@/api/common'
import Vue from 'vue'
import { component, directive } from 'vue-actions'

Vue.use(VueActions, {
  onRecords(data, otherData) {
    if (otherData === undefined) {
      console.error('组件 VueActions 必须提供data参数')
      return
    }
    data.page = otherData
    console.log(data.records)
    data.records = data.records.filter(({ actions }) => !!(actions.click + actions.duration))
    console.log(data.records)
    // if (!data.records.length) return
    addUserBehaviorRecord(data)
  }
})

Vue.component('VueActions', component)
Vue.directive('Actions', directive)
