import state from './state';
import mutations from './mutations';
import actions from './actions'; // eslint-disable-line import/no-cycle
import getters from './getters';

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
