import '@/scss/main.scss';
import Vue from 'vue';
import App from '@/components/App.vue';
import store from '@/store/index';
import VModal from 'vue-js-modal';
import axios from 'axios';

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');

Vue.config.devtools = true;
Vue.use(VModal);
Vue.prototype.$axios = axios;
Vue.prototype.$apiBasePath = process.env.VUE_APP_API_BASE_PATH;
