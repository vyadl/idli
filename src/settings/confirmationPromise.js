import { DeferredBoolean } from '@/utils/utils';
import store from '@/store/index';

// eslint-disable-next-line import/no-mutable-exports
export let confirmationPromise;

export function ask() {
  store.dispatch('_setModalNameToShow', 'confirmationModal');
  confirmationPromise = new DeferredBoolean();

  return confirmationPromise.promise;
}
