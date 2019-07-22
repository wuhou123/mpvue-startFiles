<template>
  <div @click="clickHandle">

    <div class="userinfo" @click="bindViewTap">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <img class="userinfo-avatar" src="/static/images/user.png" background-size="cover" />

      <div class="userinfo-nickname">
        <p>mpvue示例模板，即开即用</p>
        <p>集成vuex，request封装promise化</p>
        <p>less,iconfont免配置</p>
        <p>其他待更新。。。</p>
      </div>
    </div>

    <div class="cu-bar bg-white solid-bottom margin-top" @click="goDemo">
        <div class="action">
          <span class="icon-edit text-orange"></span> 
          <a href="/pages/counter/main" class="counter">去往Vuex示例页面</a>
        </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
import AllApi from '@/api/allApi'

export default {
  data () {
    return {
      motto: 'Hello miniprograme',
      userInfo: {
        nickName: 'mpvue',
        avatarUrl: 'http://mpvue.com/assets/logo.png'
      }
    }
  },

  components: {
    card
  },

  methods: {
    bindViewTap () {
      const url = '../logs/main'
      if (mpvuePlatform === 'wx') {
        mpvue.switchTab({ url })
      } else {
        mpvue.navigateTo({ url })
      }
    },
    clickHandle (ev) {
      console.log('clickHandle:', ev)
    },
    goDemo () {
      mpvue.navigateTo({url: '/pages/counter/main'})
    }
  },

  created () {
    // test request demo
    let params = {
      demo: 1
    }
    AllApi.demo('demo.do', params).then(res => {
      console.log(res)
    }).catch(error => console.log(error))

    AllApi.demo2('demo2.do', params).then(res => {
      console.log(res)
    }).catch(error => console.log(error))
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
.all{
  width:7.5rem;
  height:1rem;
  background-color:blue;
}
.all:after{
  display:block;
  content:'';
  clear:both;
}
.left{
  float:left;
  width:3rem;
  height:1rem;
  background-color:red;
}

.right{
  float:left;
  width:4.5rem;
  height:1rem;
  background-color:green;
}
</style>
