import { createStore } from 'vuex';

import state from './state';
import mutations from './mutations';
import actions from './actions'; // eslint-disable-line import/no-cycle
import getters from './getters';
import auth from './auth'; // eslint-disable-line import/no-cycle
import bin from './bin';
import filters from './filters';
import lists from './lists';
import settings from './settings';
import sidebar from './sidebar';
import visualization from './visualization';

const store = createStore({
  state,
  mutations,
  actions,
  getters,
  modules: {
    auth,
    bin,
    filters,
    lists,
    settings,
    sidebar,
    visualization,
  },
});

export default store;
