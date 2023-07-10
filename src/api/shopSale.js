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

/*
  流量监测数据
*/
export function getPeopleTraffic(params) {
  return post('/data/reportSales/getPeopleTraffic', params)
}

/*
  查询波段列表
*/
export function normalList(params) {
  return post('/api/dic/normalList', params, { wrap: false })
}

/*
  查询品类列表
*/
export function getSeriesListById(params) {
  return post('/api/series/getSeriesListById', params, { wrap: false })
}


/*
  查询品类列表
*/
export function seriesAllMethod(params) {
  return post('/goods/series/seriesAllMethod', params)
}

// 以下是报销售改版后的新接口

/*
  查询日历选择任一一天展示的销售额看板
*/
export function getDailyReport(params) {
  return post('/data/reportSales/getDailyReport', params)
}

/*
  查询近七天日历上每日对应的销售额
*/
export function getDaysSaleAccount(params) {
  return post('/data/reportSales/getDaysSaleAccount', params)
}
