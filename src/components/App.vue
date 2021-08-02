<template>
  <div
    class="app"
    :class="{
      'cloud-mode': isCloudModeOn || isStarsModeOn,
      'invert': isInvert,
    }"
  >
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
import axiosSettings from '@/settings/axiosSettings';
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
