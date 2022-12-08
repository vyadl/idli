import '@/scss/main.scss';
import { createApp } from 'vue';
import { vfmPlugin } from 'vue-final-modal';
import MasonryWall from '@yeger/vue-masonry-wall';
import store from '@/store/index';
import { initAxios } from '@/settings/axiosSettings';
import themes from '@/mixins/themes';
import App from '@/components/App.vue';
import { router } from '@/router';
import AuthPage from '@/components/layouts/AuthPage.vue';
import WithSidebar from '@/components/layouts/WithSidebar.vue';

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

app.component('auth-page-layout', AuthPage);
app.component('with-sidebar-layout', WithSidebar);

app.use(router);
app.use(store);
app.use(MasonryWall);
app.use(
  vfmPlugin({
    key: '$vfm',
    componentName: 'VueFinalModal',
    dynamicContainerName: 'ModalsContainer',
  }),
);
app.mixin(themes);

app.mount('#app');
