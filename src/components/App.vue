<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import SidebarPage from '@/components/mainPages/SidebarPage.vue';
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
    SidebarPage,
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
    isSidebarActive() {
      return this.$route.name === 'home'
        || this.$route.name === 'list'
        || this.$route.name === 'item';
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
    <router-view class="view main-content" />
    <router-view 
      v-slot="{ Component, route }"
      class="view logo" 
      name="logo"
    >
      <transition 
        :name="'slide-fade-delayed'"
        mode="out-in"
      >
        <component
          :is="Component" 
          :key="route.path"
        />
      </transition>
    </router-view>
    <router-view 
      v-slot="{ Component, route }"
      class="view form" 
      name="form"
    >
      <transition 
        name="slide-fade"
        mode="out-in"
      >
        <component
          :is="Component"
          :key="route.path"
        />
      </transition>
    </router-view>
    <SidebarPage v-if="isSidebarActive" />
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

    .slide-fade {
      &-enter-active {
        transition: all 0.2s ease-out 0.1s;
      }

      &-leave-active {
        transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
      }

      &-enter-from,
      &-leave-to {
        transform: translateX(20px);
        opacity: 0;
      }
    }

    .slide-fade-delayed {
      &-enter-active {
        transition: all 0.2s ease-out 0.2s;
      }

      &-leave-active {
        transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
      }

      &-enter-from,
      &-leave-to {
        transform: translateX(20px);
        opacity: 0;
      }
    }
  }
</style>
