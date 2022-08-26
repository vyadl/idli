import store from '@/store/index'; // eslint-disable-line import/no-cycle

export function dispatchFromRoot(actionName, payload = null) {
  store.dispatch(actionName, payload, { root: true });
}

export function commitFromRoot(mutationName, payload = null) {
  store.commit(mutationName, payload, { root: true });
}

export function notifyAboutError(status, message) {
  store.commit('setNotification', { 
    text: status === 500 ? 'Something went wrong' : message,
  });
}
