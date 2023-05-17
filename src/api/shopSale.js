import { post } from './index'

export function getStyleList(params) {
  return post('/liveBroadcast/adverts/getStyleList', params)
}

/*
  查询报表数据
*/
export function getReportFromsSales(params) {
  return post('/data/reportSales/getReportFromsSales', params)
}

/*
  添加报表数据
*/
export function addReportFromsSales(params) {
  return post('/data/reportSales/addReportFromsSales', params)
}

/*
  查询销售看板数据
*/
export function getReportFromsSalesForHome(params) {
  return post('/data/reportSales/getReportFromsSalesForHome', params)
}

/*
  查询店铺销售TOP商品
*/
export function getTopNSaleProducts(params) {
  return post('/data/reportSales/getTopNSaleProducts', params)
}

/*
  查询店铺销售额排名
*/
export function getShopRank(params) {
  return post('/data/reportSales/getShopRank', params)
}

/*
  查询店铺试衣人数
*/
export function getFittingNum(params) {
  return post('/data/reportSales/getFittingNum', params)
}
