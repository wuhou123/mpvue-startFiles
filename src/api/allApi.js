import config from '../config'
const host = config.host
import { GET, POST} from '../utils'
export default class AllApi {
  //获取用户信息
  static getInfo (params){
    const url = `${host}/wxxcx/login.do`
    return POST(url,params)
  }
  //修改小程序头像和昵称
  static modifyuserinfo (params){
    const url = `${host}/wxxcx/modifyuserinfo.do`
    return POST(url,params)
  }
  //首页列表
  static wxxcxlist (params){
    const url = `${host}/wxxcx/wxxcxlist.do`
    return GET(url,params)
  }
  //方案详情
  static projinfolook (params){
    const url = `${host}/wxxcx/projinfolook.do`
    return POST(url,params)
  }   
}