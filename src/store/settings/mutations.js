export default {
  setSettings(state, settings) {
    state.settings = settings;
  },
  toggleItemFormLocation(state) {
    state.settings.isItemFormInSidebar = !state.settings.isItemFormInSidebar;
  },
  toggleListFormLocation(state) {
    state.settings.isListFormInSidebar = !state.settings.isListFormInSidebar;
  },
  toggleFocusMode(state) {
    state.settings.isFocusOnList = !state.settings.isFocusOnList;
  },
  toggleSidebarAndListIntersection(state) {
    state.settings.isListUnderSidebar = !state.settings.isListUnderSidebar;
  },
  toggleUsingHotkeys(state) {
    state.settings.isUsingHotkeys = !state.settings.isUsingHotkeys;
  },
  setTheme(state, theme) {
    state.settings.theme = theme;
  },
};
