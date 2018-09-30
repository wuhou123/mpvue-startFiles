<template>
  <div class="wxDetails">
    <div class="infoDiv">
      <p class="p1">{{projectdata.title}}</p>
      <p class="p2">{{projectdata.pubDates}}发布</p>
    </div>
    <!--专家展示-->
    <detailsAuthor :dataList = "projectdata"></detailsAuthor>
    <!--推荐比赛-->
    <detailResult :projectdata = "projectdata"></detailResult>
    <!--推荐理由-->
    <div class="reasonDiv">
      <p class="title">推荐理由</p>
      <div v-if="projectdata.state>=3||(projectdata.price==0||projectdata.pay==1)" class="wordDiv">
        <wxParse :content="article" />
      </div>
      <div v-else class="lockDiv">
        <img src="/static/images/word_picture.png" class="word_picture" />
        <img src="/static/images/details_lock@2x.png" class="details_lock" />
        <p>支付后，可查看推荐结果和理由</p>
      </div>
    </div>
    <!--infoUl-->
    <ul class="infoUl">
      <li>
        <span class="span1">推荐编号</span>
        <span class="span2">{{projectdata.projid}}</span>
      </li>
      <li>
        <span class="span1">发布时间</span>
        <span class="span2">{{projectdata.getDate}}</span>
      </li>
      <li>
        <span class="span1">支付金额</span>
        <span class="span2 redSpan">{{projectdata.price===0?'免费':'¥' + projectdata.price}}</span>
      </li>
    </ul>
    <!--protocol-->
    <div class="protocolDiv" v-if="projectdata.price!==0&&projectdata.pay!=1&&projectdata.state===0">
      <img src="/static/images/careOver.png" v-if="selectType" @click='changeSelect' />
      <img src="/static/images/kuang2.png" style="width:26rpx;height:26rpx;vertical-algin:middle" @click='changeSelect' v-else/> 我已阅读并同意
      <a href="../../pages/counter/main">《专家解读和推荐服务协议》</a>
    </div>
    <!--已开通订阅
    <div v-if="false" class="footerFixed openFooter">
      <p class="p1">已开通订阅</p>
      <p class="p2">免费查看推荐</p>
    </div>-->
    <!--lockFooter-->
    <div class="footerFixed lockFooter" v-if="projectdata.price>0&&projectdata.pay===0&&projectdata.state===0">
      <div class="lockFooter_1">
        <p class="p1">¥{{projectdata.price}}
          <span v-if="projectdata.refund">(不中包退)</span>
        </p>
        <p class="p2">查看推荐需支付</p>
      </div>
      <div class="lockFooter_2" @click="showModel">
        <span>立即支付</span>
      </div>
    </div>
    <!--lockFooter end-->
  </div>
</template>

<script>
import Request from "@/api/allApi";
import wxParse from "mpvue-wxparse";
import detailsAuthor from '@/components/detailAuthor'
import detailResult from '@/components/detailResult'


export default {
  data() {
    return {
      id: "",
      projectdata: {},
      gameid: "",
      article: "",
      selectType: true,
    };
  },

  components: {
    wxParse,
    detailsAuthor,
    detailResult
  },

  methods: {
    getList() {
      this.projectdata = {};
      let datas = {
        projid: this.id
      };
      console.log('shuju',datas)
      Request.projinfolook(datas).then(res => {
        console.log('1111',res)
        if (res.data.code == 0) {
          this.gameid = res.data.data.gameid;
          console.log('11jinru',this.timeFormateChange(res.data.data.pubDate))
          let changeData = {
            pubDates: this.dateFormateChange(res.data.data.pubDate),
            getDate: this.timeFormateChange(res.data.data.pubDate),
            getLevel: this.levelTag([
              res.data.data.level,
              res.data.data.special
            ])
          };
          console.log('2222',changeData)
          this.projectdata = res.data.data;
          Object.assign(res.data.data, changeData);
          this.projectdata.matcharray.map((v, i) => {
            let scoreFor;
            if (v.state >= 3 && v.score) scoreFor = v.score.replace(":", " - ");
            let getDatas = {
              CodeData: this.CodeFormate(v.code),
              resultData: this.mathResult(v),
              scoreFor: scoreFor,
              getrfsf: v.rfsf ? v.rfsf.split(",") : [],
              getdxf: v.rfsf ? v.rfsf.split(",") : [],
              getspf: v.spf ? v.spf.split(",") : [],
              getrqspf: v.rqspf ? v.rqspf.split(",") : [],
              matchDates: this.timeFormate(v.mt)
            };
            v = Object.assign(v, getDatas);
          });
          this.article = this.projectdata.content;
          console.log(this.projectdata);
        }
      });
    },
    CodeFormate(code) {
      let getCode = code;
      let SPF = ["", "", ""],
        RQSPF = ["", "", ""],
        DXF = ["", "", ""],
        RFSF = ["", "", ""];
      //未登录不展示
      // if(!this.token)  return {SPF,RQSPF,RFSF,DXF}
      if (!getCode) {
        return {
          SPF,
          RQSPF,
          RFSF,
          DXF
        };
      }

      if (getCode.split(">")[1].split("+").length > 1) {
        getCode
          .split(">")[1]
          .split("+")
          .map((item, index) => {
            // console.log(item)
            switch (item.split("=")[0]) {
              case "SPF":
                item.split("=")[1] === "3"
                  ? (SPF[0] = "3")
                  : item.split("=")[1] === "1"
                    ? (SPF[1] = "1")
                    : (SPF[2] = "0");
                break;
              case "RQSPF":
                item.split("=")[1] === "3"
                  ? (RQSPF[0] = "3")
                  : item.split("=")[1] === "1"
                    ? (RQSPF[1] = "1")
                    : (RQSPF[2] = "0");
                break;
              case "DXF":
                item.split("=")[1] === "3"
                  ? (DXF[0] = "3")
                  : item.split("=")[1] === "1"
                    ? (DXF[1] = "1")
                    : (DXF[2] = "0");
                break;
              case "RFSF":
                item.split("=")[1] === "3"
                  ? (RFSF[0] = "3")
                  : item.split("=")[1] === "1"
                    ? (RFSF[1] = "1")
                    : (RFSF[2] = "0");
                break;
            }
          });
      } else {
        switch (getCode.split(">")[1].split("=")[0]) {
          case "SPF":
            getCode
              .split(">")[1]
              .split("=")[1]
              .split("/")
              .map(item => {
                item === "3"
                  ? (SPF[0] = "3")
                  : item === "1" ? (SPF[1] = "1") : (SPF[2] = "0");
              });
            break;
          case "RQSPF":
            getCode
              .split(">")[1]
              .split("=")[1]
              .split("/")
              .map(item => {
                item === "3"
                  ? (RQSPF[0] = "3")
                  : item === "1" ? (RQSPF[1] = "1") : (RQSPF[2] = "0");
              });
            break;
          case "DXF":
            getCode
              .split(">")[1]
              .split("=")[1]
              .split("/")
              .map(item => {
                item === "3"
                  ? (DXF[0] = "3")
                  : item === "1" ? (DXF[1] = "1") : (DXF[2] = "0");
              });
            break;
          case "RFSF":
            getCode
              .split(">")[1]
              .split("=")[1]
              .split("/")
              .map(item => {
                item === "3"
                  ? (RFSF[0] = "3")
                  : item === "1" ? (RFSF[1] = "1") : (RFSF[2] = "0");
              });
            break;
        }
      }

      //  console.log('返回对象',{
      //         SPF,
      //         RQSPF,
      //         RFSF,
      //         DXF
      //       })
      return {
        SPF,
        RQSPF,
        RFSF,
        DXF
      };

      // this.SPF=SPF;
      // this.RQSPF=RQSPF;
      // this.RFSF=RFSF;
      // this.DXF=DXF;
    },
    mathResult(matchObj) {
      let getScore = matchObj.score;
      //未登录不展示
      // if(!this.token)  return {'spf':'','rqspf':'','dxf':''}
      if (!getScore)
        return {
          spf: "",
          rqspf: "",
          dxf: ""
        };
      // console.log("code解析",matchObj)
      let obj = {};
      if (this.gameid == "70") {
        let lefResult = parseFloat(getScore.split(":")[0]);
        let rigResult = parseFloat(getScore.split(":")[1]);
        let getResult = lefResult - rigResult;
        getResult > 0
          ? (obj["spf"] = "3")
          : getResult === 0
            ? (obj["spf"] = "1")
            : getResult < 0 ? (obj["spf"] = "0") : "";

        let getRq = parseFloat(matchObj.rq);
        let getRqResult = lefResult - rigResult + getRq;
        getRqResult > 0
          ? (obj["rqspf"] = "3")
          : getRqResult === 0
            ? (obj["rqspf"] = "1")
            : getRqResult < 0 ? (obj["rqspf"] = "0") : "";
      } else if (this.gameid == "71") {
        // position1--盘口
        let lefResult = parseFloat(getScore.split(":")[0]);
        let rigResult = parseFloat(getScore.split(":")[1]);
        let position1 = parseFloat(matchObj.position1);
        let position2 = parseFloat(matchObj.position2);
        let RFResult = rigResult - lefResult + position1;
        RFResult > 0
          ? (obj["rfsf"] = "3")
          : RFResult === 0
            ? (obj["rfsf"] = "1")
            : RFResult < 0 ? (obj["rfsf"] = "0") : "";

        let DXFresult = rigResult + lefResult - position2;
        DXFresult > 0
          ? (obj["dxf"] = "3")
          : DXFresult === 0
            ? (obj["dxf"] = "1")
            : DXFresult < 0 ? (obj["dxf"] = "0") : "";
      }
      return obj;
    },
    dateFormateChange: function(datapldate) {
      let serverdate = new Date();
      var pldate = new Date(datapldate);
      var date = parseInt(serverdate - pldate) / 1000;
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
    },
    timeFormateChange: function(datapldate) {
      let time = new Date(datapldate);
      let year1 = time.getFullYear();
      let monthSign = time.getMonth() + 1
      let month1 = monthSign<10?'0'+ monthSign:monthSign
      let date1 = time.getDate()<10?'0'+time.getDate():time.getDate()
;
      let hour1 = time.getHours()<10?'0'+time.getHours():time.getHours()

      let minute1 = time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes()
      return `${year1}-${month1}-${date1} ${hour1}:${minute1}`;
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
    timeFormate: function(data) {
      let time = new Date(data);
      let monthSign = time.getMonth() + 1
      let month1 = monthSign<10?'0'+monthSign:monthSign;
      let date1 = time.getDate()<10?'0'+time.getDate():time.getDate()
      let hour1 = time.getHours()<10?'0'+time.getHours():time.getHours()
      let minute1 = time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes()
      return `${month1}-${date1} ${hour1}:${minute1}`;
    },
    showModel() {
      let msg = this.selectType?"暂未开通微信支付，敬请期待":'未勾选同意协议'
      wx.showModal({
        tilte: "支付提示",
        content: msg,
        showCancel: false
      });
    },
    changeSelect() {
      this.selectType = !this.selectType;
    }
  },
  onLoad(option) {
    console.log('获取id:',this.$root.$mp.query,option.projid)
    this.id = this.$root.$mp.query.projid;
    this.getList();
  }
  // onHide(){
  //   this.id= ""
  //   this.projectdata= {}
  //   this.gameid=''
  //   this.article=''
  // },
  // onShow(){
  //   this.getList();
  // }
};
</script>

<style scoped lang="less">
@import url("~mpvue-wxparse/src/wxParse.css");
.score {
  color: #333;
  font-weight: 700;
}
.wxDetails {
  background: #f7f8f9;
  padding-bottom: 100rpx;
}
.infoDiv {
  width: 100%;
  box-sizing: border-box;
  padding: 32rpx 30rpx 30rpx;
  background: #fff;
  margin-bottom: 20rpx;
}
.infoDiv p.p1 {
  font-size: 34rpx;
  color: #333333;
  line-height: 50rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.infoDiv p.p2 {
  font-size: 24rpx;
  color: #999999;
}

.reasonDiv {
  width: 100%;
  box-sizing: border-box;
  padding: 0 30rpx 20rpx;
  background: #fff;
  margin-bottom: 20rpx;
}
.reasonDiv p.title {
  font-size: 32rpx;
  color: #333333;
  padding: 40rpx 0 10rpx;
  font-weight: bold;
}
.reasonDiv div.wordDiv {
  font-size: 32rpx;
  color: #333333;
  line-height: 54rpx;
  /*padding-top: 10rpx;*/
  padding-bottom: 20rpx;
}

.reasonDiv div.lockDiv {
  position: relative;
  width: 100%;
  height: 410rpx;
}
.word_picture {
  position: absolute;
  z-index: 10;
  width: 690rpx;
  height: 410rpx;
}
.details_lock {
  position: absolute;
  z-index: 11;
  top: 93rpx;
  left: 300rpx;
  width: 90rpx;
  height: 90rpx;
}
.lockDiv p {
  position: absolute;
  z-index: 11;
  width: 100%;
  text-align: center;
  top: 213rpx;
  font-size: 28rpx;
  color: #999999;
}
/*infoUl*/
.infoUl {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  padding: 40rpx 30rpx 10rpx;
}
.infoUl li {
  position: relative;
  padding-bottom: 30rpx;
}
.infoUl span.span1 {
  font-size: 28rpx;
  color: #999999;
}
.infoUl span.span2 {
  position: absolute;
  right: 0;
  font-size: 28rpx;
  color: #333333;
}
.infoUl span.span2.redSpan {
  color: #e83535;
}
/*protocolDiv*/
.protocolDiv {
  width: 100%;
  height: 120rpx;
  line-height: 120rpx;
  font-size: 28rpx;
  color: #999999;
  text-align: center;
}
.protocolDiv img {
  width: 26rpx;
  height: 26rpx;
}
.protocolDiv a {
  color: #638cc2;
  display: inline-block;
}
/**/
.footerFixed {
  position: fixed;
  width: 100%;
  height: 100rpx;
  z-index: 100;
  bottom: 0;
  left: 0;
}
.openFooter {
  background: #d7d8db;
  text-align: center;
}
.openFooter p.p1 {
  padding-top: 14rpx;
  padding-bottom: 0rpx;
  font-size: 30rpx;
  color: #ffffff;
}
.openFooter p.p2 {
  font-size: 20rpx;
  color: #ffffff;
}
/**/
.lockFooter {
  width: 100%;
  background: #fff;
  padding: 0 30rpx;
  box-sizing: border-box;
}
.lockFooter_1 {
  p.p1 {
    padding-top: 14rpx;
    font-size: 36rpx;
    color: #e83535;
    font-weight: bold;
    span {
      font-size: 20rpx;
      font-weight: normal;
    }
  }
  p.p2 {
    font-size: 20rpx;
    color: #999999;
    margin-top:-6rpx;
  }
}
.lockFooter_2 {
  position: absolute;
  right: 30rpx;
  top: 12rpx;
}
.lockFooter_2 span {
  width: 200rpx;
  height: 76rpx;
  display: block;
  line-height: 76rpx;
  text-align: center;
  background: #eb5454;
  font-size: 30rpx;
  color: #ffffff;
  border-radius: 100rpx;
}
</style>
