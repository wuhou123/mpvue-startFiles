<template>
    <div class="div1">
      <div><img :src="dataList.headImgPath" /></div>
      <div class="div11">
        <p class="p1">{{dataList.nickid}}</p>
        <p class="p2">
          <span class="graySpan">{{dataList.getLevel}}</span>
          <span class="blueSpan" v-show="dataList.lasthit/dataList.lastpub>=0.6">近{{dataList.lastpub}}中{{dataList.lasthit}}</span>
          <span class="redSpan" v-if="dataList.keephit>=3">{{dataList.keephit>0?dataList.keephit:'0'}}连红</span>
        </p>
      </div>
    </div>
</template>

<script>
export default {
  name:'detailAuthor',
  props: ['dataList']
}
</script>

<style lang="less" scoped>
.div1 {
  position: relative;
  width: 100%;
  height: 174rpx;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;
  background: #fff;
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
  border-radius: 30rpx;
  font-size: 20rpx;
  color: #e86f6f;
  letter-spacing: 0.94px;
  margin-right: 10rpx;
  padding: 0 8rpx;
}
.div11 span.blueSpan {
  border: 2rpx solid #7b95d1;
  border-radius: 30rpx;
  font-size: 20rpx;
  color: #7a93cf;
  letter-spacing: 0.94px;
  margin-right: 10rpx;
  padding: 0 8rpx;
}
</style>
