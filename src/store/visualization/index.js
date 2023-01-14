import state from './state';
import mutations from './mutations';
// eslint-disable-next-line import/no-cycle
import actions from './actions';
import getters from './getters';

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
