import '@/scss/main.scss';
import Vue from 'vue';
import App from '@/components/App.vue';
import store from '@/store/index';
import VModal from 'vue-js-modal';
import themes from '@/mixins/themes';

Vue.use(VModal);
Vue.mixin(themes);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');

Vue.config.devtools = true;
