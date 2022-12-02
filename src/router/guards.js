// eslint-disable-next-line import/no-cycle
import store from '@/store/index';

export function beforeEach(router) {
  router.beforeEach(to => {
    const isRedirectToAuthNeeded = to.meta.isLoginRequired
      && !store.getters['auth/isLoggedIn'];

    if (isRedirectToAuthNeeded) {
      return { name: 'auth' };
    }

    const isRedirectFromAuthNeeded = to.meta.isAuthPage
      && store.getters['auth/isLoggedIn'];

    if (isRedirectFromAuthNeeded) {
      return { name: 'home' };
    }
  });
}
