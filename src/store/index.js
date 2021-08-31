import Vue from 'vue';
import Vuex, { Store } from 'vuex';

import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import auth from './auth'; // eslint-disable-line import/no-cycle

Vue.use(Vuex);

const store = new Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    auth,
  },
});

export default store;
