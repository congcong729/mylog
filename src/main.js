import Vue from 'vue'
import App from './App.vue'
import { DatePicker } from 'element-ui';
import './mock/mock-server.js'


Vue.config.productionTip = false
Vue.use(DatePicker, DatePicker);

new Vue({
  render: h => h(App),
}).$mount('#app')
