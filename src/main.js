import '@/scss/main.scss';
import { createApp } from 'vue';
import App from '@/components/App.vue';
import store from '@/store/index';
import { vfmPlugin } from 'vue-final-modal';
import VueMasonry from 'vue-masonry-css';
import themes from '@/mixins/themes';
import { initAxios } from '@/settings/axiosSettings';

export const app = createApp(App);

const { axios, apiBasePath } = initAxios(store);

store.$conf = {
  axios,
  apiBasePath,
};
app.config.globalProperties.$conf = {
  axios,
  apiBasePath,
};

app.use(store);
app.use(VueMasonry);
app.mixin(themes);
app.use(vfmPlugin({
  key: '$vfm',
  componentName: 'VueFinalModal',
  dynamicContainerName: 'ModalsContainer',
}));

app.mount('#app');

//  Vue.use(VModal);
