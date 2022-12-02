import EnterScreen from '@/components/mainPages/EnterScreen.vue';
import RequestRegistration from '@/components/auth/RequestRegistration.vue';
import RegistrationForm from '@/components/auth/RegistrationForm.vue';
import AuthForm from '@/components/auth/AuthForm.vue';
import RequestResetPassword from '@/components/auth/RequestResetPassword.vue';
import ResetPassword from '@/components/auth/ResetPassword.vue';
import AppLogo from '@/components/auth/AppLogo.vue';
import MainList from '@/components/list/MainList.vue';
import SingleItem from '@/components/item/SingleItem.vue';

export const routes = [
  { 
    path: '/',
    name: 'home',
    component: MainList,
    meta: {
      isLoginRequired: true,
      isAuthPage: false,
    },
  },
  {
    path: '/auth',
    name: 'auth',
    components: {
      logo: AppLogo,
      form: EnterScreen,
    },
    meta: {
      isLoginRequired: false,
      isAuthPage: true,
    },
  },
  {
    path: '/auth/sign-up/request-registration',
    name: 'requestRegistration',
    components: {
      logo: AppLogo,
      form: RequestRegistration,
    },
    meta: {
      isLoginRequired: false,
      isAuthPage: true,
    },
  },
  {
    path: '/auth/sign-up',
    name: 'signUp',
    props: true,
    components: {
      logo: AppLogo,
      form: RegistrationForm,
    },
    meta: {
      isLoginRequired: false,
      isAuthPage: true,
    },
  },
  {
    path: '/auth/sign-in',
    name: 'signIn',
    components: {
      logo: AppLogo,
      form: AuthForm,
    },
    meta: {
      isLoginRequired: false,
      isAuthPage: true,
    },
  },
  {
    path: '/auth/reset-password',
    name: 'resetPassword',
    components: {
      logo: AppLogo,
      form: ResetPassword,
    },
    meta: {
      isLoginRequired: false,
      isAuthPage: true,
    },
  },
  {
    path: '/auth/request-reset-password',
    name: 'requestResetPassword',
    components: {
      logo: AppLogo,
      form: RequestResetPassword,
    },
    meta: {
      isLoginRequired: false,
      isAuthPage: true,
    },
  },
  {
    path: '/list/:id',
    name: 'list',
    component: MainList,
    meta: {
      isLoginRequired: false,
      isAuthPage: false,
    },
  },
  { 
    path: '/item/:id',
    name: 'item',
    component: SingleItem,
    meta: {
      isLoginRequired: false,
      isAuthPage: false,
    },
  },
];
