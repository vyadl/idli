<template>
  <div
    class="app"
    :class="`${globalTheme}-theme`"
  >
    <transition name="fade">
      <div
        class="preloader"
        v-if="requestsNumber"
      ></div>
    </transition>
    <EnterScreen v-if="!isLoggedIn"/>
    <MainList v-else />
    <Sidebar />
    <ListModal />
    <ItemModal />
    <AppNotification v-if="notification" />
  </div>
</template>

<script>
import EnterScreen from '@/components/mainPages/EnterScreen.vue';
import MainList from '@/components/list/MainList.vue';
import Sidebar from '@/components/mainPages/Sidebar.vue';
import ListModal from '@/components/modals/ListModal.vue';
import ItemModal from '@/components/modals/ItemModal.vue';
import AppNotification from '@/components/textElements/AppNotification.vue';
import { initAxios } from '@/settings/axiosSettings';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    EnterScreen,
    MainList,
    Sidebar,
    ListModal,
    ItemModal,
    AppNotification,
  },
  computed: {
    ...mapGetters({
      notification: 'notification',
      modalNameToShow: 'modalNameToShow',
      requestsNumber: 'requestsNumber',
      isLoggedIn: 'auth/isLoggedIn',
    }),
  },
  created() {
    initAxios();
    this._setUserFromLocalStorage();
    this._setSettingsFromLocalStorage();
    this._fetchTestLists();

    if (this.isLoggedIn) {
      setTimeout(this._fetchListsForUser, 500);
    }
  },
  watch: {
    modalNameToShow: function modalNameToShowHandler() {
      if (this.modalNameToShow) {
        this.$modal.show(this.modalNameToShow);
      }
    },
  },
  methods: {
    ...mapActions({
      _setSettingsFromLocalStorage: '_setSettingsFromLocalStorage',
      _fetchListsForUser: '_fetchListsForUser',
      _fetchTestLists: '_fetchTestLists',
      _setUserFromLocalStorage: 'auth/_setUserFromLocalStorage',
    }),
  },
};
</script>

<style lang="scss">
  .app {
    width: 100%;
    min-height: 100vh;

    .preloader {
      position: fixed;
      z-index: 100;
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
