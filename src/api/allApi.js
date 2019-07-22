import config from '../config'
import { request } from '../utils'
const host = config.HOST
export default class AllApi {
  // demo api
  static demo (params) {
    const url = `${host}/demo.do`
    return request.get(url, params)
  }
  static demo2 (params) {
    const url = `${host}/demo2.do`
    return request.post(url, params)
  }
}
