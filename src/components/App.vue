<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import AuthPageLayout from '@/components/layouts/AuthPageLayout.vue';
import WithSidebarLayout from '@/components/layouts/WithSidebarLayout.vue';
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue';
import ListModal from '@/components/modals/ListModal.vue';
import ItemModal from '@/components/modals/ItemModal.vue';
import PasswordChangeModal from '@/components/modals/PasswordChangeModal.vue';
import AppNotification from '@/components/textElements/AppNotification.vue';
import { initHotkeys } from '@/settings/hotkeysSettings';
import checkAppVersion from '@/settings/appVersion';
import { handleQueryOnLoad } from '@/router/utils';

export default {
  components: {
    AuthPageLayout,
    WithSidebarLayout,
    ConfirmationModal,
    ListModal,
    ItemModal,
    PasswordChangeModal,
    AppNotification,
  },
  computed: {
    ...mapGetters('auth', [
      'isLoggedIn',
    ]),
    ...mapGetters('lists', [
      'isPublicView',
    ]),
    ...mapGetters('sidebar', [
      'sidebarMode',
      'currentSidebarView',
    ]),
    ...mapGetters([
      'notification',
      'modalNameToShow',
      'explicitRequestsNumber',
    ]),
    layout() {
      return `${this.$route.meta.layout}`;
    },
  },
  watch: {
    modalNameToShow() {
      if (this.modalNameToShow) {
        this.$vfm.show(this.modalNameToShow);
      }
    },
  },
  created() {
    checkAppVersion();

    this._setUserFromLocalStorage();
    this._setUnitsFromLocalStorage(['settings']);
    this._fetchTestLists();

    initHotkeys();

    const queryOptions = {
      sidebar: {
        callback: sidebar => {
          this.openSidebar();
          this.changeSidebarMode(sidebar);
        },
      },
      view: {
        callback: view => {
          this.setCurrentListView(view);
        },
      },
    };

    this.$watch(
      () => this.$route.query,
      query => {
        handleQueryOnLoad(queryOptions, query);

        if (this.isPublicView && this.sidebarMode === 'lists') {
          this.changeSidebarMode('filters');
          this._closeSidebar();
        }
      },
    );
  },
  methods: {
    ...mapMutations('sidebar', [
      'openSidebar',
      'changeSidebarMode',
    ]),
    ...mapMutations('lists', [
      'setCurrentListView',
    ]),
    ...mapActions('auth', [
      '_setUserFromLocalStorage',
    ]),
    ...mapActions('lists', [
      '_fetchTestLists',
    ]),
    ...mapActions('sidebar', [
      '_closeSidebar',
    ]),
    ...mapActions([
      '_setUnitsFromLocalStorage',
    ]),
  },
};
</script>

<template>
  <div
    class="app"
    :class="`${globalTheme}-theme`"
  >
    <transition name="fade">
      <div
        v-if="explicitRequestsNumber"
        class="preloader"
      />
    </transition>
    <component :is="layout">
      <router-view v-slot="{ Component }">
        <transition
          :name="$route.meta.transition"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </component>
    <ListModal />
    <ItemModal />
    <ConfirmationModal />
    <PasswordChangeModal />
    <AppNotification v-if="notification" />
  </div>
</template>

<style lang="scss">
  .app {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;

    .preloader {
      position: fixed;
      z-index: 1000;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: map-get($colors, 'white');

      &::before {
        content: '';
        position: absolute;
        height: 2px;
        background-color: map-get($colors, 'black');
        animation: loading  2s infinite cubic-bezier(0.45, 0, 0.55, 1);
      }
    }

    &.inverted-theme {
      background-color: map-get($colors, 'black');
      color: map-get($colors, 'white');

      .preloader {
        background-color: map-get($colors, 'black');

        &::before {
          background-color: map-get($colors, 'white');
        }
      }
    }
  }
</style>
