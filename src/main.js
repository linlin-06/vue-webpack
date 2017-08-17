// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import goods from 'components/goods/goods.vue';
import seller from 'components/seller/seller.vue';
import ratings from 'components/ratings/ratings.vue';
import VueResource from 'vue-resource';
import 'common/stylus/index.styl';

Vue.use (VueRouter);
Vue.use (VueResource);

let routes = [
  {path: '/', name: 'index', component: App, children: [{path: '/goods', component: goods}, {path: '/ratings', component: ratings}, {path: '/seller', component: seller}]}
];
let router = new VueRouter ({
  linkActiveClass: 'active',
  routes
});
let app = new Vue ({
  router
}).$mount ('#app');
// 路由的初始值
  router.push ('/goods');
export default app;

