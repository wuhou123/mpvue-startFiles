function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
// request 请求
export const netRequest = function (method, url, params, isShowLoading = true) {
  isShowLoading && wx.showLoading && wx.showLoading({ title: '加载中...' })
  return new Promise((resolve, reject) => {
    // 拦截及token处理
    let accessToken
    if (url.includes('/wxxcx/login.do')) accessToken = ''
    else {
      accessToken = wx.getStorageSync('vuex')
        ? JSON.parse(wx.getStorageSync('vuex')).loginMsg.token
        : ''
    }
    wx.request({
      url: url,
      data: params,
      method: method,
      header: {
        'Content-Type':
          method === 'POST'
            ? 'application/x-www-form-urlencoded'
            : 'application/json',
        accessToken: accessToken
      },
      success: function (res) {
        isShowLoading && wx.hideLoading && wx.hideLoading()
        resolve(res)
      },
      fail: function (err) {
        isShowLoading && wx.hideLoading && wx.hideLoading()
        wx.showToast({
          title: '网络出错了,请重试',
          icon: 'error'
        })
        reject(err)
      },
      complete: function () {}
    })
  })
}
// OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
export const request = {
  get (url, params) {
    return netRequest('GET', url, params)
  },
  post (url, params) {
    return netRequest('POST', url, params)
  }
}

export default {
  formatNumber,
  formatTime,
  request
}
