export default {
  isSidebarOpen: state => state.sidebar.isOpen,
  sidebarMode: state => state.sidebar.mode,

  loggedInView: (state, getters, rootState, rootGetters) => rootGetters['auth/isLoggedIn']
    && !rootGetters['lists/isPublicView'],

  itemPublicView: (state, getters, rootState, rootGetters) => !rootGetters['auth/isLoggedIn']
    && rootGetters.currentRouteName === 'item',

  listPublicView: (state, getters, rootState, rootGetters) => (
    !rootGetters['auth/isLoggedIn'] 
    && rootGetters.currentRouteName === 'list'
  ) || (
    rootGetters['auth/isLoggedIn'] 
    && rootGetters['lists/isPublicView']
    && rootGetters.currentRouteName === 'list'
  ),

  currentSidebarView: (state, getters) => {
    const sidebarPossibleViews = {
      loggedInView: getters.loggedInView,
      itemPublicView: getters.itemPublicView,
      listPublicView: getters.listPublicView,
    };
    
    return Object.keys(sidebarPossibleViews).find(
      key => sidebarPossibleViews[key],
    );
  },
};
