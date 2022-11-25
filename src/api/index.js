import Vue from 'vue'
import Axios from 'axios'
import API_STATUS from '@/api/API_STATUS'
import ApiError from './ApiError'
import {Toast} from 'vant'

// axios配置
const axiosConfig = {
  // 请求超时时间
  timeout: 60000,
  baseURL: process.env.NODE_ENV === 'production' ? './mta-api' : '/api',
}

// 创建axios实例
const axiosInstance = Axios.create(axiosConfig)

// 创建接口错误封装对象
function createApiError(option) {
  return new ApiError(option).reject()
}

// 添加请求拦截器
axiosInstance.interceptors.request.use((config) => {
  config.headers.userId = localStorage.userId
  config.headers.token = localStorage.accessToken
  return config
}, (error) => {
  return createApiError({ error })
})

// 添加响应拦截器
axiosInstance.interceptors.response.use((response) => {
  if (response.data && response.data.head.status !== API_STATUS.OK) {
    return createApiError({
      url: response.config.url,
      status: response.config.statusCode,
      response,
      message: response.data.head.msg,
      code: response.data.head.status,
    })
  }
  return response
}, async (error) => {
  return createApiError({
    error,
    response: error.response,
    url: error.config.url,
    message: error.message,
  })
})

/**
 * post封装
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 * @param {object} config 配置
 */
export function post(url, params = {}, config = { tips: true }) {
  const userData = {
    userId: localStorage.userId,
    orgId: localStorage.brandId,
  }

  const formattedParams = {
    head: {
      aid: userData.userId,
      ver: '1.0',
      ln: 'cn',
      mod: 'app',
      de: '2019-10-16',
      sync: 1,
      cmd: config.cmd,
      uuid: userData.orgId,
      chcode: 'ef19843298ae8f2134f',
    },
    con: params,
  }

  return axiosInstance({
    url,
    method: 'post',
    data: formattedParams,
  }).then(res => res.data)
}

window.addEventListener('unhandledrejection', ({ reason }) => {
  if (reason instanceof ApiError) {
    // 处理接口错误
    Toast.fail(reason.message)
  }
})

Vue.config.errorHandler = (err, vm, info) => {
  console.error(err)
  Vue.util.warn(err, vm)

  if (err instanceof ApiError) {
    return Promise.reject(err)
  }
}

export default axiosInstance
