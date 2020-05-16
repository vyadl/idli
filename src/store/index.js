import Vue from 'vue';
import Vuex, { Store } from 'vuex';

import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

const store = new Store({
  state,
  mutations,
  actions,
  getters,
});

export default store;
