<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import AuthPageLayout from '@/components/layouts/AuthPageLayout.vue';
import WithSidebarLayout from '@/components/layouts/WithSidebarLayout.vue';
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue';
import ListModal from '@/components/modals/ListModal.vue';
import ItemModal from '@/components/modals/ItemModal.vue';
import BulkItemsModal from '@/components/modals/BulkItemsModal.vue';
import AboutModal from '@/components/modals/AboutModal.vue';
import PasswordChangeModal from '@/components/modals/PasswordChangeModal.vue';
import ItemConflictModal from '@/components/modals/ItemConflictModal.vue';
import AppNotification from '@/components/textElements/AppNotification.vue';
import { initHotkeys } from '@/settings/hotkeysSettings';
import checkAppVersion from '@/settings/appVersion';

export default {
  components: {
    AuthPageLayout,
    WithSidebarLayout,
    ConfirmationModal,
    ListModal,
    ItemModal,
    BulkItemsModal,
    AboutModal,
    PasswordChangeModal,
    ItemConflictModal,
    AppNotification,
  },
  computed: {
    ...mapGetters('auth', [
      'isLoggedIn',
    ]),
    ...mapGetters('lists', [
      'isPublicView',
      'isUserOwnsCurrentList',
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
    modalNameToShow(value) {
      if (value) {
        this.$vfm.show(value);
      }
    },
    isLoggedIn: {
      handler(value) {
        if (value) {
          this._fetchTestLists();
          this._fetchListsForUser();
        }
      },
      immediate: true,
    },
  },
  created() {
    this.$watch(
      () => this.$route.name,
      name => {
        this.setCurrentRouteName(name);
      },
    );
    
    this._checkAndSetIsMobileScreen();
    window.addEventListener(
      'resize',
      this._debouncedCheckAndSetIsMobileScreen,
    );

    checkAppVersion();

    this._setUserFromLocalStorage();
    this._setUnitsFromLocalStorage(['settings']);
    this._setItemsCacheFromLocalStorage();
    this._setListsLogFromLocalStorage();

    initHotkeys();
  },
  methods: {
    ...mapMutations([
      'setCurrentRouteName',
    ]),
    ...mapMutations('sidebar', [
      'changeSidebarMode',
    ]),
    ...mapActions('auth', [
      '_setUserFromLocalStorage',
    ]),
    ...mapActions('lists', [
      '_fetchTestLists',
      '_fetchListsForUser',
    ]),
    ...mapActions('cache', [
      '_setItemsCacheFromLocalStorage',
      '_setListsLogFromLocalStorage',
    ]),
    ...mapActions('sidebar', [
      '_closeSidebar',
      '_openSidebar',
    ]),
    ...mapActions('appearance', [
      '_checkAndSetIsMobileScreen',
      '_debouncedCheckAndSetIsMobileScreen',
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
    <BulkItemsModal />
    <AboutModal />
    <ConfirmationModal />
    <PasswordChangeModal />
    <ItemConflictModal />
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
