import store from '@/store/index'; // eslint-disable-line import/no-cycle
import { GENERATED_ITEM_TITLE_MAX_LENGTH, API_REQUEST_DELAY } from '@/store/config';
import { debounce } from 'throttle-debounce';

export function dispatchFromRoot(actionName, payload = null) {
  store.dispatch(actionName, payload, { root: true });
}

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

export const callActionDebounced = debounce(
  API_REQUEST_DELAY,
  (action, item) => {
    const source = this.$config.axios.CancelToken.source();

    this.serverRequests.push(source);
    this[action]({ item, cancelToken: source.token });
    // .finally(() => {
    //   this.serverRequests = [];
    // });
  },
);
