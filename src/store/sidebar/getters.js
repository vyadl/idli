import { router } from '@/router'; // eslint-disable-line import/no-cycle

export default {
  isSidebarOpen: state => state.sidebar.isOpen,
  sidebarMode: state => state.sidebar.mode,

  loggedInView: (state, getters, rootState, rootGetters) => rootGetters['auth/isLoggedIn']
    && !rootGetters['lists/isPublicView'],

  authPageView: (state, getters, rootState, rootGetters) => !rootGetters['auth/isLoggedIn']
    && !rootGetters['items/currentItemObj']
    && !rootGetters.currentListItems?.length,

  itemPublicView: (state, getters, rootState, rootGetters) => !rootGetters['auth/isLoggedIn']
    && !!rootGetters['items/currentItemObj']
    && router.currentRoute._value.name === 'item',

  listPublicView: (state, getters, rootState, rootGetters) => (
    !rootGetters['auth/isLoggedIn'] 
    && !!rootGetters.currentListItems?.length
    && router.currentRoute._value.name === 'list'
  ) || (
    rootGetters['auth/isLoggedIn'] 
    && rootGetters['lists/isPublicView']
    && router.currentRoute._value.name === 'list'
  ),

  currentSidebarView: (state, getters) => {
    const sidebarPossibleViews = {
      loggedInView: getters.loggedInView,
      authPageView: getters.authPageView,
      itemPublicView: getters.itemPublicView,
      listPublicView: getters.listPublicView,
    };
    
    return Object.keys(sidebarPossibleViews).find(
      key => sidebarPossibleViews[key],
    );
  },
};
