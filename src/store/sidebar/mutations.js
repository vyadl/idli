export default {
  openSidebar(state) {
    state.sidebar.isOpen = true;
  },

  closeSidebar(state) {
    state.sidebar.isOpen = false;
  },
  
  changeSidebarMode(state, mode) {
    state.sidebar.mode = mode;
  },
};
