<template>
    <div class="myIndex">

        <div class="myHead">
          <div class="title">我的</div>
          <div class="info">
            <div class="headImg">
              <img :src="userInfo.avatarUrl" class="myUserImg" v-if="userInfo.avatarUrl"/>
              <img src="/static/images/mine_head_no.png" class="myUserImg" v-else/>
            </div>
            <div class="headNick" v-if = "userInfo.nickName">{{userInfo.nickName}}</div>
            <div class="headNick" v-else>
              <button class="css-button" lang="zh_CN" open-type="getUserInfo" @getuserinfo="getUserInfo">登录/注册</button>
            </div>            
          </div>

        </div>

        <!---->
        <ul class="myUl">
          <li>
            <button open-type="feedback" class="css_my">
              <img src="/static/images/my_suggestion.png" class="listIcon"/>
              产品建议
              <!-- <span>产品建议</span> -->
              <img src="/static/images/rightArrow.png" class="rightArrow"/>
            </button>
          </li>
        </ul>
    </div>

</template>

<script>
import Request from '@/api/allApi'
import { SET_LOGIN, SET_CODE , SET_USERINFO} from '../../store/mutation-types'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      userInfo: {}
    }
  },

  methods: {
    ...mapMutations({
        setLogin: 'SET_LOGIN',
        setCode: 'SET_CODE',
        setUserInfo: 'SET_USERINFO'
    }),
    getUserInfo: function(e) {
      this.login(e)
    },
    login (e) {
      wx.login({
          success: (res) => {
            if (res.code) {
              this.setCode(res.code)
              // 登录后台，获取openId
              let datas = {
                jsCode: res.code
              }
              Request.getInfo(datas).then((res)=>{                
                if(res.data.code==0) {
                  this.setLogin(res.data.data)
                  //登录成功后
                  if(e.mp.detail.errMsg.includes('ok')){
                    this.userInfo = e.mp.detail.userInfo
                    this.setUserInfo(e.mp.detail.userInfo)        
                    //授权成功 修改默认昵称和头像
                    let datas = {
                      nickId: e.mp.detail.userInfo.nickName,
                      headImgpath: e.mp.detail.userInfo.avatarUrl,
                    }
                    Request.modifyuserinfo(datas).then((res)=>{                
                      if(res.data.code==0) {
                        let realdata = res.data.data || ''
                        this.setUserInfo({nickName:realdata.nickId,avatarUrl:realdata.headImgpath})
                      }
                    })        
                  }else{
                    //授权失败,保存默认昵称和头像
                    this.userInfo = {nickName:this.$store.state.loginMsg.nickid,avatarUrl:this.$store.state.loginMsg.headImgPath}
                    this.setUserInfo({nickName:this.$store.state.loginMsg.nickid,avatarUrl:this.$store.state.loginMsg.headImgPath})
                  }
                }
              })
            } else {
              this.$store.commit('showToast',{'icon':'none','text':'登录失败请重试'})
              console.log('获取用户登录态失败！' + res.errMsg)
            }

          },
          fail: err => {

          }
      });

    },
    setTitle(){
      wx.setNavigationBarTitle({
        title: ""
      })
      //防止列表页滑动显示title
      // setTimeout(()=>{
      //   wx.setNavigationBarTitle({
      //     title: ""
      //   })
      // },2000)
    }
  },

  onShow () {
    this.setTitle()
    if(JSON.stringify(this.$store.state.userInfo) == '{}') {
      this.userInfo = {
        nickName:this.$store.state.loginMsg.nickid,
        avatarUrl:this.$store.state.loginMsg.headImgPath,      
      }
    }else{
      this.userInfo = this.$store.state.userInfo
    }

  },

  onLoad(){
    this.setTitle()
  }

}
</script>

<style lang='less' scoped>
  .css_my button{
    display:inline-block;
    border:none;
    background:none;
    border-radius:0;
    font-size: 32rpx;
    color: #333333;
    text-align:left;
    line-height:1.2;
    padding-left:0;
    margin-left:0
  }
  .css_my button:after{border:none;}
  .headNick button{
    border:none;
    background:none;
    border-radius:0;
    font-size: 34rpx;
    color: #FFFFFF;
    text-align:left;
    line-height:2.05;
    padding-left:0;
    margin-left:0;
    margin-top:-10rpx
  }
  .headNick button:after{border:none;}
  .myIndex{
    .myHead{
      width:100%;
      height:300rpx;
      box-sizing:border-box;
      padding-left:30rpx;
      background: #F73240;
      .title{
        font-size: 54rpx;
        color: #FFFFFF;
        letter-spacing: 2.54px;
        font-weight: bold;
      }
      .info{
        margin-top:50rpx;
        .headImg{
          width:100rpx;height:100rpx;float:left;
          border: 4rpx solid rgba(255,255,255,0.2);padding:6rpx;border-radius: 100%;
          img{width:100rpx;height:100rpx;border-radius: 100%;}
        }
        .headNick{
          float:left;
          margin-top:36rpx;
          font-size: 34rpx;
          color: #FFFFFF;
          margin-left:20rpx;
        }
      }

    }
    .myUl{
      margin:30rpx 20rpx 0;
      background: #fff;
      background: #FFFFFF;
      border: 1rpx solid #E6E6EB;
      border-radius: 12rpx;
      li{
        width:100%;
        height: 118rpx;
        line-height: 118rpx;
        padding-left:30rpx;
        box-sizing: border-box;
        &:last-child{
          button{border-bottom:none;}
        }
        button{
          height: 117rpx;
          line-height: 117rpx;
          padding-right:30rpx;
          border:1rpx solid #fff;
          background: none;
          text-align: left;
          border-bottom:1rpx solid #eee;
          outline: none;
          padding-left:0;
          &:after{
            border:0;
          }

        }
        .listIcon{
          width:38rpx;
          height: 38rpx;
          margin-right:10rpx;
          vertical-align: middle;
          // margin-top:-12rpx;
        }
        .rightArrow{
          width:14rpx;
          height: 22rpx;
          margin-top:48rpx;
          float:right;
        }
        span{
          font-size: 32rpx;
          color: #333333;
          letter-spacing: -0.4px;
        }
      }
    }
  }

</style>
