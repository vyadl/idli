import EnterScreen from '@/components/mainPages/EnterScreen.vue';
import RequestRegistration from '@/components/auth/RequestRegistration.vue';
import RegistrationForm from '@/components/auth/RegistrationForm.vue';
import AuthForm from '@/components/auth/AuthForm.vue';
import RequestResetPassword from '@/components/auth/RequestResetPassword.vue';
import ResetPassword from '@/components/auth/ResetPassword.vue';
import MainList from '@/components/list/MainList.vue';
import SingleItem from '@/components/item/SingleItem.vue';

export const routes = [
  { 
    path: '/',
    name: 'home',
    component: MainList,
    meta: {
      isLoginRequired: true,
      layout: 'WithSidebarLayout',
    },
  },
  {
    path: '/auth',
    name: 'auth',
    component: EnterScreen,
    meta: {
      isLoginRequired: false,
      layout: 'AuthPageLayout',
      transition: 'slide-fade',
    },
  },
  {
    path: '/auth/sign-up/request-registration',
    name: 'requestRegistration',
    component: RequestRegistration,
    meta: {
      isLoginRequired: false,
      layout: 'AuthPageLayout',
      transition: 'slide-fade',
    },
  },
  {
    path: '/auth/sign-up',
    name: 'signUp',
    props: true,
    component: RegistrationForm,
    meta: {
      isLoginRequired: false,
      layout: 'AuthPageLayout',
      transition: 'slide-fade',
    },
  },
  {
    path: '/auth/sign-in',
    name: 'signIn',
    component: AuthForm,
    meta: {
      isLoginRequired: false,
      layout: 'AuthPageLayout',
      transition: 'slide-fade',
    },
  },
  {
    path: '/auth/request-reset-password',
    name: 'requestResetPassword',
    component: RequestResetPassword,
    meta: {
      isLoginRequired: false,
      layout: 'AuthPageLayout',
      transition: 'slide-fade',
    },
  },
  {
    path: '/auth/reset-password',
    name: 'resetPassword',
    component: ResetPassword,
    meta: {
      isLoginRequired: false,
      layout: 'AuthPageLayout',
      transition: 'slide-fade',
    },
  },
  {
    path: '/list/:id',
    name: 'list',
    component: MainList,
    meta: {
      isLoginRequired: false,
      layout: 'WithSidebarLayout',
    },
  },
  { 
    path: '/item/:id',
    name: 'item',
    component: SingleItem,
    meta: {
      isLoginRequired: false,
      layout: 'WithSidebarLayout',
    },
  },
];
