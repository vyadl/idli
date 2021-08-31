<template>
  <div
    class="sidebar"
    :class="[
      { shown: isSidebarOpen },
      `${globalTheme}-theme`,
    ]"
  >
    <div
      class="add-item-button"
      v-if="isLoggedIn && currentListObj && !isFocusOnList"
    >
      <ButtonSign
        style-type="plus"
        big
        title="new item"
        @click="isItemFormInSidebar ? createNewItem() : openItemModal()"
      />
    </div>
    <div class="sidebar-buttons">
      <div class="mode-buttons">
        <ButtonText
          class="mode-button"
          v-for="mode in sidebarModes"
          :key="mode"
          :text="mode"
          :style-type="mode === 'bin' ? 'underline' : 'bordered'"
          :small="mode === 'bin'"
          :active="sidebarMode === mode"
          @click="_openSidebar(mode)"
        />
      </div>
      <div
        class="state-button"
        v-if="!isFocusOnList"
      >
        <ButtonSign
          style-type="arrow"
          @click="changeSidebarState"
        />
      </div>
    </div>
    <div class="sidebar-content">
      <ListVisualization v-if="sidebarMode === 'visualization'" />
      <FiltersList v-if="sidebarMode === 'filters'" />
      <AppLists v-if="sidebarMode === 'lists'" />
      <AppSettings v-if="sidebarMode === 'settings'"/>
      <RegistrationForm v-if="sidebarMode === 'sign up'" />
      <AuthForm v-if="sidebarMode === 'sign in'" />
      <AppBin v-if="sidebarMode === 'bin'" />
      <ItemSidebar v-if="sidebarMode === 'item'" />
    </div>
  </div>
</template>

<script>
import FiltersList from '@/components/sidebarContent/FiltersList.vue';
import ListVisualization from '@/components/sidebarContent/ListVisualization.vue';
import AppLists from '@/components/sidebarContent/AppLists.vue';
import AppBin from '@/components/sidebarContent/bin/AppBin.vue';
import AppSettings from '@/components/sidebarContent/AppSettings.vue';
import RegistrationForm from '@/components/sidebarContent/auth/RegistrationForm.vue';
import AuthForm from '@/components/sidebarContent/auth/AuthForm.vue';
import ItemSidebar from '@/components/sidebarContent/ItemSidebar.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ListVisualization,
    FiltersList,
    AppLists,
    AppSettings,
    RegistrationForm,
    AuthForm,
    AppBin,
    ItemSidebar,
    ButtonText,
    ButtonSign,
  },
  computed: {
    ...mapGetters({
      currentListObj: 'currentListObj',
      isItemFormInSidebar: 'isItemFormInSidebar',
      isFocusOnList: 'isFocusOnList',
      isSidebarOpen: 'isSidebarOpen',
      sidebarMode: 'sidebarMode',
      isLoggedIn: 'auth/isLoggedIn',
    }),
    sidebarModes() {
      return this.isLoggedIn
        ? ['filters', 'visualization', 'lists', 'profile', 'settings', 'bin']
        : ['sign up', 'sign in'];
    },
  },
  methods: {
    ...mapActions({
      _setItemForEditting: '_setItemForEditting',
      _openSidebar: '_openSidebar',
      _closeSidebar: '_closeSidebar',
    }),
    openItemModal() {
      this.$modal.show('itemModal');
    },
    changeSidebarState() {
      this.isSidebarOpen
        ? this._closeSidebar()
        : this._openSidebar(this.isLoggedIn ? this.sidebarMode : 'sign up');
    },
    createNewItem() {
      this._setItemForEditting(null);
      this._openSidebar('item');
    },
  },
};
</script>

<style lang="scss">
  .sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100vh;
    background-color: map-get($colors, 'white');
    transform: translateX(300px);
    transition:
      transform .5s,
      box-shadow .7s;

    &.shown {
      box-shadow: 15px 0 30px 0 map-get($colors, 'gray-light');
      transform: translateX(0);

      .mode-buttons {
        transform: translateX(-100%) translateX(-15px);
      }

      .state-button {
        transform: translateX(-110%) rotate(180deg);
      }
    }

    .sidebar-content {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 30px;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: map-get($colors, 'white');
    }

    .sidebar-buttons {
      position: fixed;
      bottom: 40px;
    }

    .mode-buttons {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-bottom: 10px;
      transition: transform .4s;
    }

    .mode-button {
      position: relative;
      margin-bottom: 8px;

      &::before {
        content: '';
        z-index: -1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-shadow: -5px 0 12px 12px map-get($colors, 'white');
      }
    }

    .state-button {
      width: fit-content;
      transition: transform .4s;
      transform: translateX(-100%);
    }

    .add-item-button {
      position: fixed;
      top: 5px;
      transform: translateX(-100%) translateX(-5px);
    }

    &.inverted-theme {
      background-color: map-get($colors, 'black');
      color: map-get($colors, 'white');

      &.shown {
        box-shadow: none;
      }

      .sidebar-content {
        border-left: 1px solid map-get($colors, 'gray-light');
        background-color: map-get($colors, 'black');
      }

      .mode-button {
        &::before {
          box-shadow: -5px 0 12px 12px map-get($colors, 'black');
        }
      }
    }
  }
</style>
