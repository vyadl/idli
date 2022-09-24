<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import SidebarPage from '@/components/mainPages/SidebarPage.vue';
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue';
import ListModal from '@/components/modals/ListModal.vue';
import ItemModal from '@/components/modals/ItemModal.vue';
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
    AppNotification,
  },
  computed: {
    ...mapGetters([
      'notification',
      'modalNameToShow',
      'explicitRequestsNumber',
      'isPublicView',
      'sidebarMode',
    ]),
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
  watch: {
    modalNameToShow() {
      if (this.modalNameToShow) {
        this.$vfm.show(this.modalNameToShow);
      }
    },
  },
  methods: {
    ...mapMutations([
      'openSidebar',
      'changeSidebarMode',
      'setCurrentListView',
    ]),
    ...mapActions({
      _closeSidebar: '_closeSidebar',
      _setUnitsFromLocalStorage: '_setUnitsFromLocalStorage',
      _fetchTestLists: '_fetchTestLists',
      _setUserFromLocalStorage: 'auth/_setUserFromLocalStorage',
    }),
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
        class="preloader"
        v-if="explicitRequestsNumber"
      ></div>
    </transition>
    <router-view></router-view>
    <SidebarPage />
    <ListModal/>
    <ItemModal/>
    <ConfirmationModal/>
    <AppNotification v-if="notification" />
  </div>
</template>

<style lang="scss">
  .app {
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
