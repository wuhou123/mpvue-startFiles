import Vue from 'vue'
import App from './App'
import store from './store/index'

Vue.prototype.$store = store

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    pages: ['^pages/home/main', 'pages/details/main', 'pages/counter/main'],
    window: {
      navigationBarBackgroundColor: '#F73240',
      navigationBarTextStyle: 'white',
      navigationBarTitleText: '',
      backgroundColor: '#F7F8F9',
      backgroundTextStyle: 'dark',
      enablePullDownRefresh: false
    },
    tabBar: {
      color: '#666666',
      selectedColor: '#D62B2B',
      borderStyle: 'white',
      backgroundColor: '#fff',
      list: [
        {
          text: '发现啦',
          pagePath: 'pages/home/main',
          iconPath: 'static/icon/weding.png',
          selectedIconPath: 'static/icon/weding_focus.png'
        },
        {
          text: '我的',
          pagePath: 'pages/my/main',
          iconPath: 'static/icon/my.png',
          selectedIconPath: 'static/icon/my_focus.png'
        }
      ]
    }
  }
}
