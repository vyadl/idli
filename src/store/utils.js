import store from '@/store/index'; // eslint-disable-line import/no-cycle
import { getErrorMessage } from '@/backendInteraction/serverErrors';
import {
  GENERATED_ITEM_TITLE_MAX_LENGTH,
  settingsValuesForMobileScreen,
} from '@/store/config';

export function commitFromRoot(mutationName, payload = null) {
  store.commit(mutationName, payload, { root: true });
}

export function dispatchFromRoot(actionName, payload = null) {
  store.dispatch(actionName, payload, { root: true });
}

export function notifyAboutError(error) {
  const errorMessage = error.response?.status === 500 
    ? 'Something went wrong'
    : getErrorMessage(error.response?.data);

  store.commit('setNotification', { text: errorMessage });
}

export function generateTitleFromDetails(details) {
  return details.length <= GENERATED_ITEM_TITLE_MAX_LENGTH
    ? details
    : details.slice(0, GENERATED_ITEM_TITLE_MAX_LENGTH).concat('...');
}

export function getParsedValue(value) {
  return typeof value === 'string' ? JSON.parse(value) : value;
}

export function getSettingValueForScreenSize(settingName) {
  return store.getters['appearance/isMobileScreen']
    ? settingsValuesForMobileScreen[settingName]
    : store.state.settings.settings[settingName];
}
