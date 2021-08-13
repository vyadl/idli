<template>
  <div
    class="app"
    :class="{
      'cloud-mode': theme === 'cloud' || theme === 'stars',
      'invert': theme === 'invert',
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
      mode: 'mode',
      theme: 'theme',
      isLoggedIn: 'auth/isLoggedIn',
    }),
  },
  created() {
    axiosSettings.initAxios();
    this._setUserFromLocalStorage();

    if (this.isLoggedIn) {
      this._fetchListsForUser();
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
