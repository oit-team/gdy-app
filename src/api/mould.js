import { post } from './index'

/**
 * 店铺广告模板列表
 * @param params
 */
export function getAdvertsShopAll(params) {
  return post('/liveBroadcast/advertsShop/getAdvertsShopAll', params)
}

/**
 * 新增模板
 * @param params
 * @returns {Promise<*>}
 */
export function addAdvertsShop(params) {
  return post('/liveBroadcast/advertsShop/addAdvertsShop', params)
}

/**
 * 查看模板详情
 * @param params
 * @returns {Promise<*>}
 */
export function getAdvertsShopById(params) {
  return post('/liveBroadcast/advertsShop/getAdvertsShopById', params)
}

/**
 * 修改模板
 * @param params
 * @returns {Promise<*>}
 */
export function updateAdvertsShop(params) {
  return post('/liveBroadcast/advertsShop/updateAdvertsShop', params)
}

/**
 * 删除模板
 * @param params
 * @returns {Promise<*>}
 */
export function deleteAdvertsShop(params) {
  return post('/liveBroadcast/advertsShop/deleteAdvertsShop', params)
}

/**
 * 获取商品分类
 * @param params
 * @returns {Promise<*>}
 */
export function dictitemInfoAllMethod(params, config) {
  return post('/liveBroadcast/adverts/getStyleType', params, config)
}

/**
 * 根据分类获取商品列表
 * @param params
 * @returns {Promise<*>}
 */
export function getCollocationList(params) {
  return post('/liveBroadcast/adverts/getCollocationList', params)
}
