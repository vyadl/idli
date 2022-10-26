import { DeferredBoolean } from '@/utils/misc';
import store from '@/store/index';

// eslint-disable-next-line import/no-mutable-exports
export let confirmationPromise;

export function isConfirmed(confirmationModalTitle = 'are you sure?') {
  store.commit('setModalNameToShow', 'confirmationModal');
  store.commit('setConfirmationModalTitle', confirmationModalTitle);
  confirmationPromise = new DeferredBoolean();

  return confirmationPromise.promise;
}
