import '@/scss/main.scss';
import { createApp } from 'vue';
import { vfmPlugin } from 'vue-final-modal';
import MasonryWall from '@yeger/vue-masonry-wall';
import store from '@/store/index';
import { initAxios } from '@/settings/axiosSettings';
import themes from '@/mixins/themes';
import App from '@/components/App.vue';

const app = createApp(App);

const { axios, apiBasePath } = initAxios(store);

store.$config = {
  axios,
  apiBasePath,
};
app.config.globalProperties.$config = {
  axios,
  apiBasePath,
};

app.use(store);
app.use(MasonryWall);
app.use(vfmPlugin({
  key: '$vfm',
  componentName: 'VueFinalModal',
  dynamicContainerName: 'ModalsContainer',
}));
app.mixin(themes);

app.mount('#app');
