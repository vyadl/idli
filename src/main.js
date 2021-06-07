import '@/scss/main.scss';
import Vue from 'vue';
import App from './components/App.vue';
import store from './store/index';

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');

Vue.config.devtools = true;
