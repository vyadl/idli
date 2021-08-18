<template>
  <div
    class="app"
    :class="{
      'cloud-mode': mode === 'cloud' || mode === 'stars',
      'inverted-theme': isInverted,
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
      isLoggedIn: 'auth/isLoggedIn',
      mode: 'mode',
      theme: 'theme',
    }),
  },
  created() {
    axiosSettings.initAxios();
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

    &.cloud-mode {
      position: fixed;
      overflow: hidden;
      top: 0;
      left: 0;
    }

    &.inverted-theme {
      background-color: map-get($colors, 'black');
      color: map-get($colors, 'white');
    }
  }
</style>
