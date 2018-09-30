<template>
    <div class="mathDiv">
        <p class="titleP">推荐比赛</p>
        <img src="/static/icon/details_qust.png" alt="" @click="showHong(true)" class="qra_img">
        <div class="mathInfoDiv" v-for="(match,index) in projectdata.matcharray" :key="index">
            <div class="teamMathDiv">
                <img v-if="match.hit===0" src="/static/images/details_hit_no.png" class="resultImgIcon">
                <!--右上角图标 未中-->
                <img v-if="match.hit===1" src="/static/images/details_hit.png" class="resultImgIcon">
                <!--右上角图标 命中-->
                <img v-if="false" src="/static/images/details_recommend2.png" class="resultImgIcon">
                <!--右上角图标 推荐-->
                <div class="teamMathDiv_1">
                    <div v-if="projectdata.gameid==='70'">
                        <img :src="match.hid" />
                        <p>{{match.hn}}</p>
                    </div>
                    <div v-else>
                        <img :src="match.gid" />
                        <p>{{match.gn}}</p>
                    </div>
                </div>
                <div class="teamMathDiv_2">
                    <p class="p1">
                        <span>{{match.name}}</span>
                        <span style="margin-left:20rpx">{{match.leagueName}}</span>
                    </p>
                    <p class="p1">{{match.matchDates}}</p>
                    <p class="score" v-if="match.state>=3&&match.score">
                        {{match.scoreFor}}
                    </p>
                    <p class="p2">
                        <span class="SpanNoStart" v-if="match.cancel==1">已取消</span>
                        <span class="SpanNoStart" :class="{'finish':match.state>2}" v-else-if="match.state>=0">{{match.state>2?'已完赛':(match.state>0?'进行中':'未开赛')}}</span>
                    </p>
                    <!--SpanOver 灰色 已完赛-->
                </div>
                <div class="teamMathDiv_1">
                    <div v-if="projectdata.gameid==='70'">
                        <img :src="match.gid" />
                        <p>{{match.gn}}</p>
                    </div>
                    <div v-else>
                        <img :src="match.hid" />
                        <p>{{match.hn}}</p>
                    </div>
                </div>
            </div>
            <ul class="mathUl" v-if="projectdata.gameid==='70'">
                <li :class="{blueLi:match.CodeData.SPF[0]==='3',redLi:match.resultData.spf==='3'}">
                    <img src="/static/images/details_recommend.png" v-if="match.CodeData.SPF[0]==='3'" />
                    <span>主胜</span>
                    <span>{{match.getspf[0]||'--'}}</span>
                </li>
                <li :class="{blueLi:match.CodeData.SPF[1]==='1',redLi:match.resultData.spf==='1'}">
                    <img src="/static/images/details_recommend.png" v-if="match.CodeData.SPF[1]==='1'" />
                    <span>平</span>
                    <span>{{match.getspf[1]||'--'}}</span>
                </li>
                <li :class="{blueLi:match.CodeData.SPF[2]==='0',redLi:match.resultData.spf==='0'}">
                    <img src="/static/images/details_recommend.png" v-if="match.CodeData.SPF[2]==='0'" />
                    <span>客胜</span>
                    <span>{{match.getspf[2]||'--'}}</span>
                </li>
                <li :class="{blueLi:match.CodeData.RQSPF[0]==='3',redLi:match.resultData.rqspf==='3'}">
                    <img src="/static/images/details_recommend.png" v-if="match.CodeData.RQSPF[0]==='3'" />
                    <span>({{((match.rq-0
                        <0)?match.rq: '+'+match.rq)}})主胜</span>
                            <span>{{match.getrqspf[0]||'--'}}</span>
                </li>
                <li :class="{blueLi:match.CodeData.RQSPF[1]==='1',redLi:match.resultData.rqspf==='1'}">
                    <img src="/static/images/details_recommend.png" v-if="match.CodeData.RQSPF[1]==='1'" />
                    <span>平</span>
                    <span>{{match.getrqspf[1]||'--'}}</span>
                </li>
                <li :class="{blueLi:match.CodeData.RQSPF[2]==='0',redLi:match.resultData.rqspf==='0'}">
                    <img src="/static/images/details_recommend.png" v-if="match.CodeData.RQSPF[2]==='0'" />
                    <span>客胜</span>
                    <span>{{match.getrqspf[2]||'--'}}</span>
                </li>
            </ul>
            <ul class="mathUl css_basketBall" v-else>
                <li :class="{blueLi:match.CodeData.RFSF[2]==='0',redLi:match.resultData.rfsf==='0'}">
                    <img src="/static/images/details_recommend.png" v-if="match.CodeData.RFSF[2]==='0'" />
                    <span>让客胜</span>
                    <span>{{match.getrfsf[0]}}</span>
                </li>
                <li :class="{blueLi:match.CodeData.RFSF[0]==='3',redLi:match.resultData.rfsf==='3'}">
                    <img src="/static/images/details_recommend.png" v-if="match.CodeData.RFSF[0]==='3'" />
                    <span>{{'('+match.position1+')'+'让主胜'}}</span>
                    <span>{{match.getrfsf[1]}}</span>
                </li>
            </ul>
            <ul class="mathUl css_basketBall" v-if="projectdata.gameid==='71'">
                <li :class="{blueLi:match.CodeData.DXF[0]==='3',redLi:match.resultData.dxf==='3'}">
                    <img src="/static/images/details_recommend.png" v-if="match.CodeData.DXF[0]==='3'" />
                    <span>大于{{match.position2}}</span>
                    <span>{{match.getdxf[0]}}</span>
                </li>
                <li :class="{blueLi:match.CodeData.DXF[2]==='0',redLi:match.resultData.dxf==='0'}">
                    <img src="/static/images/details_recommend.png" v-if="match.CodeData.DXF[2]==='0'" />
                    <span>小于{{match.position2}}</span>
                    <span>{{match.getdxf[1]}}</span>
                </li>
            </ul>
        </div>
        <!-- 弹框 -->
        <div class="weui-mask" style="position: fixed;z-index: 20;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0,0,0,.6)" v-show="showDialog"></div>
        <div class="hitDialog" v-show="showDialog">
            <p class="p1">关于“命中”</p>
            <div>
                <p class="p2">当回报率≥100时,该场比赛即视为命中</p>
                <p class="p2">回报率按该场比赛专家推荐玩法的返奖金额除以投注金额计算</p>
            </div>
            <p class="p1">关于“连红”</p>
            <div>
                <p class="p2">
                    针对专家发布的方案，推荐比赛的命中率≥50%，则连红计为1；如果推荐比赛的命中率﹤50%，则连红数计为0，重新开始计算
                </p>
            </div>
            <img src="/static/icon/details_delet.png" alt="" class="closeP" @click="showHong(false)">
        </div>
        <!-- 弹框end -->
    </div>
</template>

<script>
export default {
  name: "detailResult",
  props: ["projectdata"],
  data() {
    return {
      showDialog: false
    };
  },
  methods: {
    showHong(type) {
      this.showDialog = type;
    }
  }
};
</script>

<style lang="less" scoped>
/**/
.mathInfoDiv {
  box-shadow: 0 1px 16px 0 rgba(214, 221, 229, 0.5);
  border-radius: 2px;
  margin-bottom: 30rpx;
}
.mathInfoDiv:last-child {
  margin-bottom: 0;
}
.resultImgIcon {
  position: absolute;
  right: 0;
  z-index: 10;
  top: -20rpx;
  right: -20rpx;
  width: 80rpx;
  height: 80rpx;
}
/*弹层*/
.hitDialog {
  position: absolute;
  top: 20%;
  left: calc(50% - 270rpx);
  width: 540rpx;
  height: 646rpx;
  background: #fff;
  margin: 0 auto;
  border-radius: 8rpx;
  z-index: 99;
  p.p1 {
    font-size: 34rpx;
    color: #333333;
    text-align: center;
    font-weight: bold;
    padding: 40rpx 0 30rpx;
  }
  div {
    box-sizing: border-box;
    padding: 0 56rpx;
  }
  p.p2 {
    position: relative;
    font-size: 28rpx;
    color: #333333;
    text-align: left;
    line-height: 40rpx;
    margin-bottom: 20rpx;
    padding-left: 30rpx;
    &:after {
      position: absolute;
      top: 15rpx;
      left: 0;
      content: "";
      width: 10rpx;
      height: 10rpx;
      border-radius: 10rpx;
      background: #ec4927;
    }
  }
  .closeP {
    position: absolute;
    top: -83rpx;
    right: 0;
    width: 51rpx;
    height: 83rpx;
  }
}
.qra_img {
  width: 30rpx;
  height: 30rpx;
  vertical-align: middle;
  margin-left: 20rpx;
}
.mathDiv {
  width: 100%;
  box-sizing: border-box;
  padding: 0 30rpx;
  margin-bottom: 40rpx;
  background:#fff
}
.mathDiv .titleP {
  font-size: 34rpx;
  color: #333333;
  letter-spacing: 1.6px;
  padding: 30rpx 0 24rpx;
  display: inline-block;
}
.teamMathDiv {
  position: relative;
  overflow: hidden;
  display: flex;
  padding: 41rpx 0;
}
.teamMathDiv_1 {
  flex: 2;
  text-align: center;
}
.teamMathDiv_1 img {
  width: 90rpx;
  height: 90rpx;
  border-radius: 100%;
  margin: 0 auto;
}
.teamMathDiv_1 p {
  font-size: 28rpx;
  color: #333333;
  font-weight: bold;
  padding-top: 10rpx;
}
.teamMathDiv_2 {
  flex: 2;
  text-align: center;
  padding-top: 6rpx;
}
.teamMathDiv_2 p.p1 {
  font-size: 24rpx;
  color: #999999;
  padding-top: 6rpx;
}
.teamMathDiv_2 p.p2 {
  padding-top: 16rpx;
}
.teamMathDiv_2 p.p2 span.SpanNoStart {
  font-size: 22rpx;
  color: #f05b5b;
}
.teamMathDiv_2 p.p2 span.SpanOver {
  font-size: 22rpx;
  color: #999999;
}
.teamMathDiv_2 p.p2 span.finish {
  font-size: 22rpx;
  color: #999999;
  letter-spacing: 0;
}
.mathUl {
  width: 96%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}
.mathUl li {
  position: relative;
  float: left;
  width: 30%;
  padding: 0 1%;
  height: 68rpx;
  line-height: 68rpx;
  font-size: 26rpx;
  color: #999999;
  background: #f5f6f7;
  border-radius: 2px;
  margin-bottom: 10rpx;
}
.mathUl li.blueLi {
  background: #699cdf;
  color: #fff;
}
.mathUl li.redLi {
  background: #e86f6f;
  color: #fff;
}
.mathUl li img {
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
  width: 54rpx;
  height: 54rpx;
}
.mathUl li:nth-child(3n + 2) {
  margin: 0 2%;
}
.mathUl li span:first-child {
  float: left;
}
.mathUl li span:last-child {
  float: right;
}
.css_basketBall li {
  width: 47%;
}
.css_basketBall li:nth-child(3n + 2) {
  margin: 0;
}
.css_basketBall li:nth-child(2n + 2) {
  margin-left: 2%;
}
</style>
