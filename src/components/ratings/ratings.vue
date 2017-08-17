<template>
<div class="ratings">
  <div class="ratings-content">
    <div class="overview">
      <div class="overview-left">
        <h1 class="score">{{seller.score}}</h1>
        <div class="title">综合评分</div>
        <div class="rank">高于周边商家{{seller.rankRate}}%</div>
      </div>
      <div class="overview-right">
        <div class="score-wrapper">
          <span class="title">服务态度</span>
          <star :size="36" :score="seller.serviceScore"></star>
          <span class="score">{{seller.serviceScore}}</span>
        </div>
        <div class="score-wrapper">
          <span class="title">商品评分</span>
          <star :size="36" :score="seller.foodScore"></star>
          <span class="score">{{seller.foodScore}}</span>
        </div>
        <div class="delivery-wrapper">
          <span class="title">送达时间</span>
          <span class="delivery">{{seller.deliveryTime}}分钟</span>
        </div>
      </div>
    </div>
    <split></split>
    <ratingSelect :select-type="selectType" :only-content="onlyContent" :ratings="ratings" @increment="incrementTotal"></ratingSelect>
    <div class="rating-wrapper">
      <ul>
        <li class="rating-item" v-for="rating in ratings"  v-show="needShow(rating.rateType,rating.text)">
          <div class="avatar">
            <img :src="rating.avatar" alt="" width="28px" height="28px"/>
          </div>
          <div class="content">
            <h1 class="name">{{rating.username}}</h1>
            <div class="star-wrapper">
              <star :size="24" :score="rating.score"></star>
              <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
            </div>
            <p class="text">{{rating.text}}</p>
            <div class="recommend" v-show="rating.recommend && rating.recommend.length">
              <i class="iconfont icon-thumb_up"></i>
              <span class="item" v-for="item in rating.recommend">{{item}}</span>
            </div>
            <div class="time">{{rating.rateTime | formatDate}}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import star from '../star/star.vue';
import split from '../split/split.vue';
import BScroll from 'better-scroll';
import ratingSelect from '../ratingselect/ratingselect.vue';
import {formatDate} from '../../common/js/date.js';
const ERR_OK = 0;
const ALL = 2;
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      ratings: [],
       selectType: ALL,
       onlyContent: true
    };
  },
  created() {
    this.$http.get ('/api/ratings').then ((response) => {
      response = response.body;
      if (response.error === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick (() => {
            this.scroll = new BScroll (this.$el, {click: true});
          });
        }
    });
  },
  filters: {
    formatDate(time) {
        let date = new Date (time);
        return formatDate (date, 'yyyy-MM-dd hh:mm');
    }
  },
  methods: {
    incrementTotal(type, data) {
     // console.log (type);
     // console.log (data);
       this[type] = data;
       this.$nextTick (() => {
         this.scroll.refresh ();
       });
    },
    needShow(type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    }
  },
  components: {
    star,
    split,
    ratingSelect
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './ratings.styl';
</style>
