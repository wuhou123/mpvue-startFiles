<template>
  <div class="wxIndex">
    <p class="titleMain">今日推荐</p>
    <ul class="listUl">

      <li class="listUl_li" @tap="bindViewTap(item.projid)" v-for="item in list" :key="item">
        <!--精选-->
        <img src="/static/images/recommendIcon.png" class="recommendIcon" v-show="item.projindex>0" />
        <!--头像-->
        <div class="div1">
          <div><img :src="item.photo || '/static/images/expertDefalut.png'" /></div>
          <div class="div11">
            <p class="p1">{{item.nickid}}</p>
            <p class="p2">
              <span class="graySpan">{{item.level}}</span>
              <span class="blueSpan" v-show="item.lasthit/item.lastpub>=0.6">近{{item.lastpub}}中{{item.lasthit}}</span>
              <span class="redSpan" v-if="item.label">{{item.label}}</span>
            </p>
          </div>
          <div class="div12" v-if="item.lasthitrate>=0.6">
            <p>
              <span class="span1">
                <em class="em1">{{item.lasthitrate*1000/10}}</em>
                <em class="em2">命中率</em>
              </span>
              <span class="span2">%</span>
            </p>

          </div>
        </div>
        <!--评论-->
        <div class="div2">{{item.title}}</div>
        <!--球队-->
        <ul class="ul3">
          <li class="li1">
            <span>{{item.match.name}}</span>
            <span class="span1">{{item.match.leagueName}}</span>
          </li>
          <li class="li2">
            <span>{{item.gameid==='70'?item.match.hn:item.match.gn}}</span>
            <span>VS</span>
            <span>{{item.gameid==='70'?item.match.gn:item.match.hn}}</span>
          </li>
        </ul>
        <!--时间-->
        <div class="div4">
          <span class="redSpan">{{item.price===0?'免费':'¥' + item.price}}
            <em style="display: inline-block;vertical-align: middle;">{{item.refund?'(不中包退)':''}}</em>
          </span>
          <span class="graySpanLine">|</span>
          <span class="graySpan">{{item.pubdate}}发布</span>
        </div>
      </li>

    </ul>
    <!--到底啦-->
    <div class="footerBg" v-if="list.length>0">
      <img src="/static/images/overall_end.png" class="hasIcon" />
    </div>
    <!-- 遮罩层弃用 -->
    <div class="mark" v-if="showModalStatus">
        <!-- <button class="css-button" lang="zh_CN" open-type="getUserInfo" @getuserinfo="getUserInfo">授权体验</button> -->
    </div>

    <!--使用animation属性指定需要执行的动画-->
    <div :animation="animationData" class="drawer_box" v-if="showModalStatus">
      <!--drawer content-->
      <!-- <div class="drawer_title">弹窗标题</div> -->
      <div class="drawer_content">
        <div>为了给您带来更好的体验，我们申请获得您的公开信息（昵称、头像等）</div>
      </div>
      <button class="btn_ok" lang="zh_CN" open-type="getUserInfo" @getuserinfo="getUserInfo">好的</button>
      <!-- <div class="btn_ok" data-statu="close">好的</div> -->
    </div>
  </div>
</template>

<script>
import Request from "@/api/allApi";
import { SET_LOGIN, SET_CODE, SET_USERINFO } from "../../store/mutation-types";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      list: [],
      userInfo: {},
      total: 0,
      pageSize: 20,
      pageNum: 1,
      showModalStatus: false,
      animationData: ""
    };
  },

  methods: {
    ...mapMutations({
      setLogin: "SET_LOGIN",
      setCode: "SET_CODE",
      setUserInfo: "SET_USERINFO"
    }),
    setAnimation() {
      /* 动画部分 */

      // 第1步：创建动画实例
      var animation = wx.createAnimation({
        duration: 1000, //动画时长
        timingFunction: "linear", //线性
        delay: 0 //0则不延迟
      });

      // 第2步：这个动画实例赋给当前的动画实例
      this.animation = animation;

      // 第3步：执行第一组动画
      animation
        .opacity(0)
        .rotateX(-100)
        .scale(0.5,0.5)
        .step();

      // 第4步：导出动画对象赋给数据对象储存
      this.animationData = animation.export()
      setTimeout(() => {
        animation
          .opacity(1)
          .rotateX(360)
          .scale(1,1)
          .step();
        this.animationData = animation;
      },500);
    },
    bindViewTap(id) {
      const url = "../details/main?projid=" + id;
      wx.navigateTo({ url });
    },
    login() {
      wx.login({
        success: res => {
          if (res.code) {
            this.setCode(res.code);
            // 登录后台，获取openId
            let datas = {
              jsCode: res.code
            };
            Request.getInfo(datas).then(res => {
              if (res.data.code == 0) {
                this.setLogin(res.data.data);
                this.getList();
                //判断是否需要授权
                if (!this.userInfo.nickName) {
                  this.showModalStatus = true;
                  // this.setAnimation();
                }
              }
            });
          } else {
            this.getList();
            this.$store.commit("showToast", {
              icon: "none",
              text: "登录失败请重试"
            });
            console.log("获取用户登录态失败！" + res.errMsg);
          }
        },
        fail: err => {
          this.getList();
        }
      });
    },
    getUserInfo(e) {
      this.showModalStatus = false;
      this.getList();
      let that = this;
      if (e.mp.detail.errMsg.includes("ok")) {
        that.userInfo = e.mp.detail.userInfo;
        that.setUserInfo(e.mp.detail.userInfo);
        //授权成功 修改默认昵称和头像
        let datas = {
          nickId: e.mp.detail.userInfo.nickName,
          headImgpath: e.mp.detail.userInfo.avatarUrl
        };
        Request.modifyuserinfo(datas).then(res => {
          if (res.data.code == 0) {
            let realdata = res.data.data || "";
            that.setUserInfo({
              nickName: realdata.nickId,
              avatarUrl: realdata.headImgpath
            });
          }
        });
      } else {
        //授权失败,保存默认昵称和头像
        that.userInfo = {
          nickName: that.$store.state.loginMsg.nickid,
          avatarUrl: that.$store.state.loginMsg.headImgPath
        };
        that.setUserInfo({
          nickName: that.$store.state.loginMsg.nickid,
          avatarUrl: that.$store.state.loginMsg.headImgPath
        });
      }
    },
    getList() {
      if (this.total && this.total > this.list.length) this.pageNum++;
      let datas = {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      Request.wxxcxlist(datas).then(res => {
        if (res.data.code == 0) {
          res.data.data.list.map((v, i) => {
            v.level = this.levelTag([v.level, v.special]);
            v.pubdate = this.dateFormateChange(v);
            v.match = v.match ? JSON.parse(v.match) : "";
          });
          if (this.pageNum == 1) this.list = res.data.data.list;
          else this.list = [...this.list, ...res.data.data.list];
          this.total = res.data.data.total;
        }
      });
    },
    levelTag: function([level, special]) {
      if (special === 0) {
        const leveltag = ["牛人", "红人", "有料专家"];
        return leveltag[level];
      } else {
        const sleveltag = ["", "特邀红人", "有料专家"];
        return sleveltag[level];
      }
    },
    dateFormateChange: function(item) {
      var pldate = new Date(item.pubdate);
      let serverdate = new Date();
      if (item.matchtime < serverdate) {
        //截取到年月日分钟
        let monthSign = pldate.getMonth() + 1
        let month = monthSign<10?'0'+monthSign:monthSign
        let date = pldate.getDate()<10?'0'+pldate.getDate():pldate.getDate()
        let hour = pldate.getHours()<10?'0'+pldate.getHours():pldate.getHours()
        let minute = pldate.getMinutes()<10?'0'+pldate.getMinutes():pldate.getMinutes()
        return `${month}-${date} ${hour}:${minute}`;
      }

      // let serverdate= new Date()
      // var pldate=new Date(datapldate)
      var date = parseInt(serverdate - pldate) / 1000; //时间是秒
      if (0 < date && date < 60) {
        return "刚刚";
      } else if (date > 60 && date < 3600) {
        return parseInt(date / 60) + "分钟前";
      } else if (date < 60 * 60 * 24 && date > 3600) {
        return parseInt(date / (60 * 60)) + "小时前";
      } else if (
        date > 60 * 60 * 24 &&
        serverdate.getYear() == pldate.getYear()
      ) {
        //截取到年月日分钟
        let monthSign = pldate.getMonth() + 1
        let month = monthSign<10?'0'+monthSign:monthSign
        let date = pldate.getDate()<10?'0'+pldate.getDate():pldate.getDate()
        let hour = pldate.getHours()<10?'0'+pldate.getHours():pldate.getHours()
        let minute = pldate.getMinutes()<10?'0'+pldate.getMinutes():pldate.getMinutes()
        return `${month}-${date} ${hour}:${minute}`;
      } else if (serverdate.getYear() != pldate.getYear()) {
        return pldate;
      } else {
        return "";
      }
    }
  },
  onPageScroll(e) {
    if (e.scrollTop > 65&&e.scrollTop<300) {
      //减少内存占用
      wx.setNavigationBarTitle({
        title: "今日推荐"
      });
    }
    if(e.scrollTop <= 65){
      wx.setNavigationBarTitle({
        title: ""
      });
    }
  },
  onLoad() {
    //是否需要授权
    this.login();
  },
  onShow() {
    this.userInfo = this.$store.state.userInfo;
  },

  async onPullDownRefresh() {
    this.pageNum = 1;
    await this.getList();
    wx.stopPullDownRefresh();
  },

  // 上拉加载，拉到底部触发
  onReachBottom() {
    console.log("chudi");
    if (this.total && this.total > this.list.length) this.getList();
    else return;
  }
};
</script>

<style scoped lang="less">
//弹框start
.btn {
  width: 80%;
  padding: 20rpx 0;
  border-radius: 10rpx;
  text-align: center;
  margin: 40rpx 10%;
  background: #000;
  color: #fff;
}

/*mask*/
.drawer_screen {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: #000;
  opacity: 0.5;
  overflow: hidden;
}

/*content*/
.drawer_box {
  width: 650rpx;
  overflow: hidden;
  position: fixed;
  top: 30%;
  left: calc(50% - 355rpx);
  z-index: 99;
  background: #fff;
  // margin: -150px 50rpx 0 50rpx;
  border-radius: 3px;
  font-size: 32rpx;
  padding: 30rpx;
  color: #666;
}
.btn_ok {
  padding: 10rpx 30rpx;
  font: 36rpx "microsoft yahei";
  text-align: right;
  // border-top: 1px solid #e8e8ea;
  color: #3cc51f;
  background:none
}
.btn_ok:after {
  border: none;
}
//弹框end
.css-button {
  width: 150px;
  margin: 50% auto;
  background: #138cff;
  color: #fff;
}
.mark {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  top: 0;
  z-index: 9;
  overflow: hidden;
}
.wxIndex {
  background: #f7f8f9;
}
.titleMain {
  width: 100%;
  height: 130rpx;
  line-height: 130rpx;
  box-sizing: border-box;
  padding-left: 30rpx;
  font-size: 54rpx;
  font-weight: bold;
  color: #ffffff;
  letter-spacing: 2.54px;
  background: #f73240;
  margin-bottom: 30rpx;
}
.footerBg {
  width: 100%;
  height: 120rpx;
  img {
    display: block;
    width: 480rpx;
    height: 40rpx;
    margin: 32rpx auto 0;
  }
}
/**/
.listUl {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20rpx;
}
.listUl_li {
  position: relative;
  width: 100%;
  background: #ffffff;
  border: 1rpx solid #e6e6eb;
  box-shadow: 0 5px 16px 0 rgba(214, 221, 229, 0.29);
  border-radius: 12rpx;
  margin-bottom: 30rpx;
  box-sizing: border-box;
  padding: 0 20rpx 0 24rpx;
}
.recommendIcon {
  position: absolute;
  top: 0;
  right: -2rpx;
  width: 72rpx;
  height: 72rpx;
}
.div1 {
  position: relative;
  width: 100%;
  height: 174rpx;
  padding: 40rpx 0 34rpx;
  box-sizing: border-box;
}
.div1 div {
  float: left;
}
.div1 div img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 100rpx;
}
.div11 {
  padding-left: 20rpx;
}
.div11 p.p1 {
  margin-top: 10rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
}
.div11 p.p2 {
  margin-top: -6rpx;
}
.div11 span.graySpan {
  font-size: 24rpx;
  color: #999999;
  margin-right: 10rpx;
}
.div11 span.redSpan {
  border: 2rpx solid #e86f6f;
  border-radius: 30px;
  font-size: 20rpx;
  color: #e86f6f;
  letter-spacing: 0.94px;
  margin-right: 10rpx;
  padding: 0 12rpx;
}
.div11 span.blueSpan {
  border: 2rpx solid #7b95d1;
  border-radius: 30px;
  font-size: 20rpx;
  color: #7a93cf;
  letter-spacing: 0.94px;
  margin-right: 10rpx;
  padding: 0 12rpx;
}
.div12 {
  position: absolute;
  right: 0;
  color: #f05b5b;
}
.div12 span {
  float: left;
}
.div12 span.span1 {
  text-align: center;
}
.div12 em.em1 {
  font-size: 60rpx;
  font-weight: bold;
}
.div12 em.em2 {
  margin-top: -14rpx;
  font-size: 20rpx;
  letter-spacing: 2rpx;
  font-weight: bold;
}
.div12 span.span2 {
  height: 100rpx;
  line-height: 100rpx;
  font-size: 18rpx;
}

.div2 {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
  letter-spacing: 1.5px;
  padding-right: 30rpx;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  display: -webkit-box;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
.ul3 {
  width: 100%;
  height: 66rpx;
  background: #f5f6f7;
  margin: 14rpx 0 10rpx;
}
.ul3 li {
  height: 66rpx;
  line-height: 66rpx;
  font-size: 26rpx;
  color: #888888;
}
.ul3 li.li1 {
  float: left;
  padding-left: 16rpx;
}
.ul3 li.li1 span.span1 {
  padding-left: 17rpx;
}
.ul3 li.li2 {
  float: right;
  padding-right: 18rpx;
}
.ul3 li.li2 span {
  padding-left: 17rpx;
}
.div4 {
  padding-bottom: 32rpx;
}
.div4 .hasIcon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 5rpx;
  vertical-align: middle;
  margin-top: -2rpx;
}
.div4 .redSpan {
  font-size: 26rpx;
  color: #e86f6f;
  padding-right: 14rpx;
  font-weight: bold;
  vertical-align: middle;
}
.div4 .graySpan {
  font-size: 24rpx;
  color: #999999;
  vertical-align: middle;
}
.div4 .graySpanLine {
  font-size: 24rpx;
  margin-right: 10rpx;
  color: #b0b0b0;
  vertical-align: middle;
}
</style>
