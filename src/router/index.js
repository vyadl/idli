import { createRouter, createWebHistory } from 'vue-router';
import { routes } from '@/router/routes';
// eslint-disable-next-line import/no-cycle
import { beforeEach } from '@/router/guards';

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

function initRouter() {
  beforeEach(router);
}

initRouter();
