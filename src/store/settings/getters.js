import { getSettingValueForScreenSize } from '@/store/utils';

export default {
  settings: state => state.settings,
  isItemFormInSidebar: state => state.settings.isItemFormInSidebar,
  isListFormInSidebar: state => state.settings.isListFormInSidebar,
  isFocusOnList: () => getSettingValueForScreenSize('isFocusOnList'),
  isListUnderSidebar: () => getSettingValueForScreenSize('isListUnderSidebar'),
  isUsingHotkeys: () => getSettingValueForScreenSize('isUsingHotkeys'),
  theme: state => state.settings.theme,
};
