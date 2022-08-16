import EnterScreen from '@/components/mainPages/EnterScreen.vue';
import MainList from '@/components/list/MainList.vue';

export const routes = [
  { 
    path: '/',
    name: 'home',
    component: MainList,
    meta: {
      isLoginRequired: true,
    },
  },
  {
    path: '/auth',
    name: 'auth',
    component: EnterScreen,
    meta: {
      isLoginRequired: false,
    },
  },
  { 
    path: '/list/:id',
    name: 'list',
    component: MainList,
    meta: {
      isLoginRequired: true,
    },
  },
];
