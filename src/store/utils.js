import store from '@/store/index'; // eslint-disable-line import/no-cycle
import { GENERATED_ITEM_TITLE_MAX_LENGTH } from '@/store/config';

export function commitFromRoot(mutationName, payload = null) {
  store.commit(mutationName, payload, { root: true });
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
