import Vue from 'vue'
import App from './App.vue'
import config from "../public/config.json";
import element from '@/assets/js/element'
import 'element-ui/lib/theme-chalk/index.css';
import "@/assets/css/index.scss";
import "@/assets/css/element.scss";
// import http from "@/assets/js/http.js";
import unit from "@/assets/units/unit.js";
let bus = new Vue();
Vue.config.productionTip = false;
// Vue.prototype.$http = http;
Vue.prototype.$unit = unit;
Vue.prototype.$bus = bus;
Vue.prototype.$config = config;
Vue.use(element);

new Vue({
  render: h => h(App),
}).$mount('#app')
