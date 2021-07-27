import '@/scss/main.scss';
import Vue from 'vue';
import App from '@/components/App.vue';
import store from '@/store/index';
import VModal from 'vue-js-modal';

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');

Vue.config.devtools = true;
Vue.use(VModal);
