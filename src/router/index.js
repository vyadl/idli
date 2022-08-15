import { createRouter, createWebHistory } from 'vue-router';
// eslint-disable-next-line import/no-cycle
import store from '@/store/index';
import EnterScreen from '@/components/mainPages/EnterScreen.vue';
import MainList from '@/components/list/MainList.vue';

const routes = [
  { 
    path: '/',
    name: 'home',
    component: MainList,
    meta: {
      isLoginRequired: true,
    },
  },
  {
    path: '/auth',
    name: 'auth',
    component: EnterScreen,
    meta: {
      isLoginRequired: false,
    },
  },
  { 
    path: '/list/:id',
    name: 'list',
    component: MainList,
    meta: {
      isLoginRequired: true,
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

function getQuery() {
  return router.currentRoute._value.query;
}

export function changeRoute(name, params, query = getQuery()) {
  router.push({
    name,
    params,
    query,
  });
}

export function addQueryItems(additionalQuery) {
  router.push({
    query: {
      ...getQuery(),
      ...additionalQuery,
    },
  });
}

export function deleteQueryItems(...keysToDelete) {
  const query = { ...getQuery() };

  keysToDelete.forEach(key => {
    delete query[key];
  });

  router.push({ query });
}

router.beforeEach(to => {
  const isRedirectToAuthNeeded = to.name !== 'auth' 
    && to.meta.isLoginRequired 
    && !store.getters['auth/isLoggedIn'];
  const relevantSidebarValues = ['sign in', 'sign up', undefined];
  const isSidebarValueRelevant = relevantSidebarValues.includes(to.query.sidebar);
  const isSidebarClosingNeeded = !isSidebarValueRelevant && to.name === 'auth';

  if (isRedirectToAuthNeeded || isSidebarClosingNeeded) {
    return { name: 'auth' };
  } 
});
