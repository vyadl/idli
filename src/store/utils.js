import store from '@/store/index'; // eslint-disable-line import/no-cycle

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
