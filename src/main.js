import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import { DatePicker } from 'element-ui';


Vue.config.productionTip = false
Vue.use(DatePicker, DatePicker);

new Vue({
  render: h => h(App),
}).$mount('#app')
