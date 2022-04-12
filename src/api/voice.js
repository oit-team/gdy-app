import { post } from './index'

/**
 * 查询随机出题
 * @param params
 */
export function getRandomQuestions(params) {
  return post('/work/speechTraining/getRandomQuestions', params)
}
