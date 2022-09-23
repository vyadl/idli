import { createStore } from 'vuex';

import state from './state';
import mutations from './mutations'; // eslint-disable-line import/no-cycle
import actions from './actions'; // eslint-disable-line import/no-cycle
import getters from './getters';
import auth from './auth'; // eslint-disable-line import/no-cycle

const store = createStore({
  state,
  mutations,
  actions,
  getters,
  modules: {
    auth,
  },
});

export default store;
