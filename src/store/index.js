import { createStore } from 'vuex';

import state from './state';
import mutations from './mutations';
import actions from './actions'; // eslint-disable-line import/no-cycle
import getters from './getters';
import appearance from './appearance';
import auth from './auth'; // eslint-disable-line import/no-cycle
import bin from './bin';
import cache from './cache';
import filters from './filters';
import lists from './lists';
import items from './items';
import settings from './settings';
import sidebar from './sidebar';
import visualization from './visualization';

const store = createStore({
  state,
  mutations,
  actions,
  getters,
  modules: {
    appearance,
    auth,
    bin,
    cache,
    filters,
    lists,
    items,
    settings,
    sidebar,
    visualization,
  },
});

export default store;
