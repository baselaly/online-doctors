require('./bootstrap');
// window.Vue = require('vue');
import Vue from 'vue';
import VueRouter from 'vue-router'; // importing Vue router
import { routes } from './routes';
import Vuex from 'vuex';
import Vuetify from 'vuetify'
import storeData from './store'
import 'vuetify/dist/vuetify.min.css';
import colors from 'vuetify/es5/util/colors'

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Vuetify, {
  theme: {
    primary: colors.shades.black,
    secondary: colors.grey.darken1,
    accent: colors.shades.black,
    error: colors.red.accent3
  }
});

Vue.config.productionTip = false

const store = new Vuex.Store(storeData);

const router = new VueRouter({
  mode: 'history',
  routes
})

//Vue.component('example', require('./components/Example.vue'));

const app = new Vue({
  el: '#app',
  store,
  router
});
