export default {
  settings: state => state.settings,
  isItemFormInSidebar: state => state.settings.isItemFormInSidebar,
  isFocusOnList: state => state.settings.isFocusOnList,
  isListUnderSidebar: state => state.settings.isListUnderSidebar,
  isUsingHotkeys: state => state.settings.isUsingHotkeys,
  theme: state => state.settings.theme,
};
