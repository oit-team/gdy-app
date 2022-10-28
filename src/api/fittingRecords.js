import { post } from './index'

export function getFitGoodsInfo(params) {
  return post('/liveBroadcast/device/getFitGoodsInfo', params)
}

