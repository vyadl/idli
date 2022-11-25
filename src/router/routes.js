import EnterScreen from '@/components/mainPages/EnterScreen.vue';
import RegistrationForm from '@/components/auth/RegistrationForm.vue';
import AuthForm from '@/components/auth/AuthForm.vue';
import PasswordReset from '@/components/auth/PasswordReset.vue';
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
    },
  },
  {
    path: '/auth/sign-up/request-registration',
    name: 'requestRegistration',
    components: {
      logo: AppLogo,
      form: RegistrationForm,
    },
    meta: {
      isLoginRequired: false,
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
    },
  },
  {
    path: '/auth/reset-password',
    name: 'resetPassword',
    components: {
      logo: AppLogo,
      form: PasswordReset,
    },
    meta: {
      isLoginRequired: false,
    },
  },
  {
    path: '/auth/request-reset-password',
    name: 'requestResetPassword',
    components: {
      logo: AppLogo,
      form: PasswordReset,
    },
    meta: {
      isLoginRequired: false,
    },
  },
  {
    path: '/list/:id',
    name: 'list',
    component: MainList,
    meta: {
      isLoginRequired: false,
    },
  },
  { 
    path: '/item/:id',
    name: 'item',
    component: SingleItem,
    meta: {
      isLoginRequired: false,
    },
  },
];
