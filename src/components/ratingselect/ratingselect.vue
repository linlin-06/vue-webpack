<template>
  <div class="ratingSelect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block positive" :class="{'active' : selectType === 2}">{{desc.all}}<span  class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active' : selectType === 0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType === 1}">{{desc.negative}} <span class="count">{{negative.length}}</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent}" @click="toggleContent($event)">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const POSITIVE = 0;
const NEGATIVE = 1;
// const ALL = 2;

export default {
  props: {
    ratings: {
      type: Array
    },
    selectType: {
      type: Number
    },
    onlyContent: {
      type: Boolean
    },
    desc: {
      type: Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '吐槽'
        };
      }
    }
  },
  computed: {
    positives() {
      return this.ratings.filter ((rating) => {
        return rating.rateType === POSITIVE;
      });
    },
    negative() {
      return this.ratings.filter ((rating) => {
        return rating.rateType === NEGATIVE;
      });
    }
  },
  methods: {
    select(type, event) {
      if (!event._constructed) {
        return;
      }
      this.selectType = type;
       this.$emit ('increment', 'selectType', type);
    },
    toggleContent(event) {
      if (!event._constructed) {
        return;
      }
      this.onlyContent = !this.onlyContent;
      this.$emit ('increment', 'onlyContent', this.onlyContent);
    }
  }
};

</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './ratingselect.styl';
</style>
