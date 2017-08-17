<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li  v-for="(item, index) in goods" class="menu-item " :class="{'current' :currentIndex === index}" @click="selectMenu(index, $event)">
          <span class="text border-1px" >
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]" ></span>{{item.name}}
          </span>
        </li>
      </ul>

    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
              <div class="icon" width="57px">
                <img :src="food.icon" alt=""/>
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span>月售{{food.sellCount}}份</span><span class="count">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <!--@increment是接收cartControl的事件入口？？-->
                  <cartControl :food="food" @increment="incrementTotal"></cartControl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div>
      <shopCart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :selectFoods ="selectFoods" ref="shopCart"></shopCart>
      <food :food="selectedFood" ref="food" ></food>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import shopCart from '../shopCart/shopCart.vue';
import cartControl from '../cartControl/cartControl.vue';
import food from '../food/food.vue';
const ERR_OK = 0;
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    };
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
    // 先遍历食物 或发现存在count 这存入foods中 送到shopCart组件中
      let foods = [];
      this.goods.forEach ((good) => {
        good.foods.forEach ((food) => {
          if (food.count) {
            foods.push (food);
          }
        });
      });
      return foods;
    }
  },
  created() {
  this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];

    this.$http.get ('/api/goods').then ((response) => {
      response = response.body;
      if (response.error === ERR_OK) {
          this.goods = response.data;
          this.$nextTick (() => {
              this._initScroll ();
              this._calculateHeight ();
          });
      }
    });
  },
  methods: {
    _initScroll() {
      this.menuScroll = new BScroll (this.$refs.menuWrapper, {
        click: true
      });

      this.foodsScroll = new BScroll (this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      });

      this.foodsScroll.on ('scroll', (pos) => {
        this.scrollY = Math.abs (Math.round (pos.y));
      });
    },
    _calculateHeight() {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName ('food-list-hook');
      let height = 0;
      this.listHeight.push (height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push (height);
      }
    },
    selectMenu(index, event) {
      // index是获得点击的下标
      if (!event._constructed) {
      // 去掉自带click的点击事件
        return;
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName ('food-list-hook');
      let el = foodList[index];
      this.foodsScroll.scrollToElement (el, 300);
    },
    incrementTotal(target) {
        // 处理shopCart送过来的事件
        // 异步执行下落动画防止卡顿 体验优化
        this.$nextTick (() => {
         this.$refs.shopCart.drop (target);
        });
    },
    selectFood(food, $event) {
         if (!event._constructed) {
      // 去掉自带click的点击事件
        return;
        }
        this.selectedFood = food;
        this.$refs.food.show ();
    }
  },
  components: {
    shopCart,
    cartControl,
    food
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "./goods.styl";
</style>
