export default {
  isSidebarOpen: state => state.sidebar.isOpen,
  sidebarMode: state => state.sidebar.mode,

  loggedInView: (state, getters, rootState, rootGetters) => rootGetters['auth/isLoggedIn']
    && !rootGetters.isPublicView,

  authPageView: (state, getters, rootState, rootGetters) => !rootGetters['auth/isLoggedIn']
    && !rootGetters.currentItemObj
    && !rootGetters.currentListItems?.length,

  itemPublicView: (state, getters, rootState, rootGetters) => !rootGetters['auth/isLoggedIn']
    && rootGetters.currentItemObj,

  listPublicView: (state, getters, rootState, rootGetters) => (
    !rootGetters['auth/isLoggedIn'] 
    && rootGetters.currentListItems?.length
  ) || (
    rootGetters['auth/isLoggedIn'] 
    && rootGetters.isPublicView
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
