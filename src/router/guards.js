import store from '@/store/index';

export function beforeEach(router) {
  router.beforeEach(to => {
    const isRedirectToAuthNeeded = to.name === 'auth'
      ? !['sign in', 'sign up', undefined].includes(to.query.sidebar)
      : to.meta.isLoginRequired
        && !store.getters['auth/isLoggedIn'];

    if (isRedirectToAuthNeeded) {
      return { name: 'auth' };
    } 
  });
}
