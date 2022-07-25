import { DeferredBoolean } from '@/utils/utils';
import store from '@/store/index';

// eslint-disable-next-line import/no-mutable-exports
export let confirmationPromise;

export function isConfirmed(confirmationModalTitle) {
  store.dispatch('_setModalNameToShow', 'confirmationModal');
  store.commit('setconfirmationModalTitle', confirmationModalTitle);
  confirmationPromise = new DeferredBoolean();

  return confirmationPromise.promise;
}
