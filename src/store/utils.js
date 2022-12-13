import { debounce } from 'throttle-debounce';
import { sMedia } from '@/scss/style.module.scss';
import store from '@/store/index'; // eslint-disable-line import/no-cycle
import {
  GENERATED_ITEM_TITLE_MAX_LENGTH,
  SCREEN_SIZE_CHECK_DELAY,
  settingsValuesForMobileScreen,
} from '@/store/config';

export function commitFromRoot(mutationName, payload = null) {
  store.commit(mutationName, payload, { root: true });
}

export function dispatchFromRoot(actionName, payload = null) {
  store.dispatch(actionName, payload, { root: true });
}

export function notifyAboutError(error) {
  const isResponseMessage = error.response?.data?.message && error.response.status !== 500;

  store.commit('setNotification', { 
    text: isResponseMessage
      ? error.response.data.message : 'Something went wrong',
  });
}

export function generateTitleFromDetails(details) {
  return details.length <= GENERATED_ITEM_TITLE_MAX_LENGTH
    ? details
    : details.slice(0, GENERATED_ITEM_TITLE_MAX_LENGTH).concat('...');
}

function checkGroupingFieldsTitlesIntersections(listObj, groupingFieldType, groupingFieldsTitles) {
  return listObj[groupingFieldType]
    .some(groupingField => {
      const isSameTitleGroupingField = groupingFieldsTitles.has(groupingField.title);

      if (!isSameTitleGroupingField) {
        groupingFieldsTitles.add(groupingField.title);
      }

      return isSameTitleGroupingField;
    });
}

export function validateGroupingFieldsTitles(listObj) {
  let isValid = true;
  const groupingFieldsTitles = new Set();

  isValid = !checkGroupingFieldsTitlesIntersections(listObj, 'tags', groupingFieldsTitles);

  if (isValid) {
    isValid = !checkGroupingFieldsTitlesIntersections(listObj, 'categories', groupingFieldsTitles);
  }

  return isValid;
}

export function getParsedValue(value) {
  return typeof value === 'string' ? JSON.parse(value) : value;
}

export function checkAndSetIsMobileScreen() {
  const isMatchMedia = window.matchMedia(JSON.parse(sMedia)).matches;
  
  if (isMatchMedia !== store.getters.isMobileScreen) {
    store.commit('setIsMobileScreen', isMatchMedia);
  }
}

export const debouncedCheckAndSetIsMobileScreen = debounce(
  SCREEN_SIZE_CHECK_DELAY,
  checkAndSetIsMobileScreen,
);

export function getSettingValueForScreenSize(settingName) {
  return store.getters.isMobileScreen
    ? settingsValuesForMobileScreen[settingName]
    : store.state.settings.settings[settingName];
}
