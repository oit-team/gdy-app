import { post } from './index'

export function getAppDevList(params) {
  return post('/liveBroadcast/device/getAppDevList', params)
}

// 查询设备
export function getDevState(params) {
  return post('/liveBroadcast/device/getDevState', params)
}

// 发布
export function addAppPublishDeviceAds(params) {
  return post('/liveBroadcast/device/addAppPublishDeviceAds', params)
}

// 添加草稿
export function addAdvertsTemp(params) {
  return post('/liveBroadcast/adverts/addAdvertsTemp', params)
}

// 回退配置
export function getRollbackAdverts(devId) {
  return post('/liveBroadcast/adverts/getRollbackAdverts', { devId })
}

// 查询设备详情
export function getAppDevInfo(devId) {
  return post('/liveBroadcast/device/getAppDevInfo', { devId })
}
