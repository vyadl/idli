<template>
  <div
    class="app"
    :class="{
      'cloud-mode': isCloudModeOn || isStarsModeOn,
      'invert': isInvert,
    }"
  >
    <EnterScreen v-if="!isLoggedIn"/>
    <UserScreen v-else />
    <Sidebar />
  </div>
</template>

<script>
import EnterScreen from '@/components/mainPages/EnterScreen.vue';
import UserScreen from '@/components/mainPages/UserScreen.vue';
import Sidebar from '@/components/mainPages/Sidebar.vue';
import axiosSettings from '@/settings/axiosSettings';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    EnterScreen,
    UserScreen,
    Sidebar,
  },
  computed: {
    ...mapGetters({
      isCloudModeOn: 'isCloudModeOn',
      isStarsModeOn: 'isStarsModeOn',
      isInvert: 'isInvert',
      isLoggedIn: 'auth/isLoggedIn',
    }),
  },
  created() {
    axiosSettings.initAxios();
    this._initUser();
    this._getInitialData();
  },
  methods: {
    ...mapActions({
      _initUser: 'auth/_initUser',
      _getInitialData: '_getInitialData',
    }),
  },
};
</script>

<style lang="scss">
  .app {
    width: 100%;
    height: 100vh;

    &.cloud-mode {
      position: fixed;
      overflow: hidden;
      top: 0;
      left: 0;
    }

    &.invert {
      background-color: #000;
      color: #fff;
    }
  }
</style>
