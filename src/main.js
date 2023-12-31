import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/global.css'
import store from '@/store/index'


Vue.config.productionTip = false
Vue.use(ElementUI,{size:"small"});

new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')
