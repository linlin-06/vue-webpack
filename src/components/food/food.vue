<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image" alt=""/>
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="catControl-wrapper">
              <cartControl :food="food"></cartControl>
            </div>
            <transition name="fade">
              <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst($event)">加入购物车</div>
            </transition>
          </div>
          <split v-show="food.info"></split>
          <div class="info" v-show="food.info">
            <h1 class="title">商品信息</h1>
            <div class="text">{{food.info}}</div>
          </div>
          <split></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <ratingSelect @increment="incrementTotal" :select-type="selectType" :only-content="onlyContent" :desc="desc"  :ratings="food.ratings"></ratingSelect>
            <div class="rating-wrapper">
              <!--判断评价存在 且是不为空的情况-->
              <ul v-show="food.ratings && food.ratings.length">
                <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img :src="rating.avatar" width="12px" height="12px" class="avatar"/>
                  </div>
                  <div class="time">{{rating.rateTime | formatDate}}</div>
                  <p class="text">
                    <i :class="{'icon-thumb_up' :rating.rateType===0,'icon-thumb_down':rating.rateType===1}" class="iconfont"></i>
                    {{rating.text}}
                  </p>
                </li>
              </ul>
              <div class="no-rating" v-show="!food.ratings && food.ratings.length === 0">暂无评价</div>
            </div>
          </div>
        </div>
    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import Vue from 'vue';
import cartControl from '../cartControl/cartControl.vue';
import split from '../split/split.vue';
import ratingSelect from '../ratingselect/ratingselect.vue';
import {formatDate} from '../../common/js/date.js';
const ALL = 2;
export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
    // 定义food组件传到ratingselect中的初始值
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
      }
    };
  },
  methods: {
    show() {
      this.showFlag = true;
      this.selectType = ALL;
      this.onlyContent = true;
      this.$nextTick (() => {
        if (!this.scroll) {
          this.scroll = new BScroll (this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh ();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(event) {
      if (!event._constructed) {
      // 去掉自带click的点击事件
        return;
        }
        this.$emit ('increment', event.target);
        Vue.set (this.food, 'count', 1);
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
    },
    incrementTotal(type, data) {
        this[type] = data;
        this.$nextTick (() => {
          this.scroll.refresh ();
        });
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date (time);
      return formatDate (date, 'yyyy-MM-dd hh:mm');
    }
  },
  components: {
    cartControl,
    split,
    ratingSelect
  }
};

</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './food.styl';
</style>
