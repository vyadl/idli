<template>
  <div
    class="app"
    :class="{
      'cloud-mode': ['cloud', 'stars'].includes(mode),
      'inverted-theme': isInverted,
    }"
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
    <ListForm />
    <ItemForm />
  </div>
</template>

<script>
import EnterScreen from '@/components/mainPages/EnterScreen.vue';
import MainList from '@/components/list/MainList.vue';
import Sidebar from '@/components/mainPages/Sidebar.vue';
import ListForm from '@/components/list/ListForm.vue';
import ItemForm from '@/components/list/ItemForm.vue';
import { initAxios } from '@/settings/axiosSettings';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    EnterScreen,
    MainList,
    Sidebar,
    ListForm,
    ItemForm,
  },
  computed: {
    ...mapGetters({
      mode: 'mode',
      theme: 'theme',
      requestsNumber: 'requestsNumber',
      isLoggedIn: 'auth/isLoggedIn',
    }),
  },
  created() {
    initAxios();
    this._setUserFromLocalStorage();

    if (this.isLoggedIn) {
      setTimeout(this._fetchListsForUser, 500);
    }
  },
  methods: {
    ...mapActions({
      _setUserFromLocalStorage: 'auth/_setUserFromLocalStorage',
      _fetchListsForUser: '_fetchListsForUser',
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

    &.cloud-mode {
      position: fixed;
      overflow: hidden;
      top: 0;
      left: 0;
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
