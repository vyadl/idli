import store from '@/store/index'; // eslint-disable-line import/no-cycle

export function dispatchFromRoot(methodName, payload = null) {
  store.dispatch(methodName, payload, { root: true });
}

export function commitFromRoot(methodName, payload = null) {
  store.commit(methodName, payload, { root: true });
}
