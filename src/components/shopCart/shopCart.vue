<template>
  <div>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'heightlight': totalCount>0}">
            <i class="icon-shopping_cart" :class="{'heightlight': totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'heightlight': totalPrice>0}">
          ￥{{totalPrice}}
        </div>
        <div class="desc">
          另需配送费{{deliveryPrice}}元
        </div>
      </div>
      <div class="content-right" @click.stop.prevent="pay" >
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <div v-for="ball in balls">
        <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <div v-show="ball.show" class="ball">
            <div class="inner inner-hook">
            </div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fold">
    <div class="shopcart-list" v-show="listShow">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="empty">清空</span>
      </div>
      <div class="list-content" ref="listContent">
        <ul>
          <li class="food" v-for="food in selectFoods">
            <span class="name">{{food.name}}</span>
            <div class="price">
              <span>{{food.price* food.count}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartControl :food="food"></cartControl>
            </div>
          </li>
        </ul>
      </div>
    </div>
    </transition>
  </div>
    <transition name="fade">
      <div class="list-mask"  v-show="listShow" @click="hideList()"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import cartControl from '../cartControl/cartControl.vue';
export default {
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      balls: [
        {
        show: false
      },
      {
        show: false
      },
      {
        show: false
      },
      {
        show: false
      },
      {
        show: false
      }
      ],
      dropBalls: [ ],
      fold: true
    };
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach ((food) => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach ((food) => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元`;
      } else {
        return '去结算';
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false;
      }
      let show = !this.fold;
      if (show) {
      // this.$nextTick监听dom的变化
        this.$nextTick (() => {
        if (!this.scroll) {
          this.scroll = new BScroll (this.$refs.listContent, {
            click: true
          });
          } else {
            this.scroll.refresh ();
          }
        });
      }
      return show;
    }
  },
  methods: {
    pay() {
      if (this.totalPrice < this.minPrice) {
        return;
      }

      window.alert (`支付${this.totalPrice}`);
    },
    hideList() {
      this.fold = !this.fold;
    },
    empty() {
      this.selectFoods.forEach ((food) => {
        food.count = 0;
      });
    },
    toggleList() {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    drop(el) {
      // 找到目标元素之后进行遍历
      for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push (ball);
            return;
          }
        }
    },
    beforeEnter(el) {
    // 找到所有为true的小球
     let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
          // 找到目标元素相对与视口的位置
            let rect = ball.el.getBoundingClientRect ();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName ('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
    },
    enter(el) {
    /* eslint-disable no-unused-vars */
    let rf = el.offsetHeight;
    this.$nextTick (() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName ('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
    },
    afterEnter(el) {
      let ball = this.dropBalls.shift ();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
    }
  },
  components: {
    cartControl
  }
};

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./shopCart.styl";
</style>
