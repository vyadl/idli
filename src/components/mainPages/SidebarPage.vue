<script>
import SidebarFilters from '@/components/sidebarContent/filters/SidebarFilters.vue';
import SidebarVisualization from '@/components/sidebarContent/visualization/SidebarVisualization.vue';
import SidebarLists from '@/components/sidebarContent/lists/SidebarLists.vue';
import SidebarBin from '@/components/sidebarContent/bin/SidebarBin.vue';
import SidebarSettings from '@/components/sidebarContent/settings/SidebarSettings.vue';
import RegistrationForm from '@/components/sidebarContent/auth/RegistrationForm.vue';
import AuthForm from '@/components/sidebarContent/auth/AuthForm.vue';
import SidebarItem from '@/components/sidebarContent/item/SidebarItem.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarVisualization,
    SidebarFilters,
    SidebarLists,
    SidebarSettings,
    RegistrationForm,
    AuthForm,
    SidebarBin,
    SidebarItem,
    ButtonText,
    ButtonSign,
  },
  LOGGED_IN_DEFAULT_SIDEBAR: 'lists',
  LOGGED_OUT_DEFAULT_SIDEBAR: 'sign in',
  LOGGED_OUT_PUBLIC_SIDEBAR: 'settings',
  computed: {
    ...mapGetters({
      isUserOwnsCurrentList: 'isUserOwnsCurrentList',
      currentListObj: 'currentListObj',
      isItemFormInSidebar: 'isItemFormInSidebar',
      isFocusOnList: 'isFocusOnList',
      isSidebarOpen: 'isSidebarOpen',
      sidebarMode: 'sidebarMode',
      isLoggedIn: 'auth/isLoggedIn',
      isPublicView: 'isPublicView',
    }),
    sidebarModes() {
      let modes = [];

      if (this.isLoggedIn && !this.isPublicView) {
        modes = ['filters', 'visualization', 'lists', 'settings', 'bin'];
      } else if (this.$route.name === 'auth') {
        modes = ['sign up', 'sign in'];
      } else if (!this.isLoggedIn && this.$route.name === 'item') {
        modes = ['settings'];
      } else {
        modes = ['filters', 'visualization', 'settings'];
      }

      return modes;
    },
  },
  mounted() {
    this.$refs.edgeMoveCatcher.addEventListener('mouseover', () => {
      if (!this.isSidebarOpen) {
        let mode = '';
        
        if (!this.isLoggedIn && this.$route.name !== 'auth') {
          mode = this.$options.LOGGED_OUT_PUBLIC_SIDEBAR;
        } else if (!this.isLoggedIn) {
          mode = this.$options.LOGGED_OUT_DEFAULT_SIDEBAR;
        } else {
          mode = this.sidebarMode ? this.sidebarMode : this.$options.LOGGED_IN_DEFAULT_SIDEBAR;
        }

        this._openSidebar(mode);
      }
    });
  },
  methods: {
    ...mapActions([
      '_addNewItemPlaceholder',
      '_openSidebar',
      '_closeSidebar',
      '_setCurrentListView',
    ]),
    openItemModal() {
      this.$vfm.show('itemModal');
    },
    exitPublicView() {
      this._setCurrentListView('owner');
    },
    changeSidebarState() {
      this.isSidebarOpen
        ? this._closeSidebar()
        : this._openSidebar(this.isLoggedIn 
          ? this.sidebarMode : this.$options.LOGGED_OUT_DEFAULT_SIDEBAR);
    },
    createNewItem() {
      this._addNewItemPlaceholder();
      this.isItemFormInSidebar ? this._openSidebar('item') : this.openItemModal();
    },
    scrollSidebarToTop() {
      this.$refs.sidebarContent.scroll({
        top: 0,
        behavior: 'smooth',
      });
    },
  },
};
</script>

<template>
  <div
    class="sidebar"
    :class="[
      { shown: isSidebarOpen },
      `${globalTheme}-theme`,
    ]"
  >
    <div
      class="edge-move-catcher"
      ref="edgeMoveCatcher"
    ></div>
    <div
      class="add-item-button"
      v-if="isLoggedIn 
        && currentListObj 
        && !isFocusOnList 
        && isUserOwnsCurrentList 
        && !isPublicView"
    >
      <ButtonSign
        style-type="plus"
        big
        title="new item"
        @click="createNewItem"
      />
    </div>
    <div
      v-if="isPublicView"
      class="exit-public-view-button"
    >
      <ButtonText
        text="back to profile"
        style-type="underline"
        @click="exitPublicView"
      />
    </div>
    <div
      v-if="!isLoggedIn && $route.name !== 'auth'"
      class="auth-buttons"
    >
      <router-link :to="{ name: 'auth', query: { sidebar: 'sign up' }}">
        sign up
      </router-link>
      or
      <router-link :to="{ name: 'auth', query: { sidebar: 'sign in' }}">
        sign in
      </router-link>
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
    <div 
      class="sidebar-content"
      ref="sidebarContent"
    >
      <SidebarVisualization v-if="sidebarMode === 'visualization'" />
      <SidebarFilters v-if="sidebarMode === 'filters'" />
      <SidebarLists v-if="sidebarMode === 'lists'" />
      <SidebarSettings v-if="sidebarMode === 'settings'"/>
      <RegistrationForm v-if="sidebarMode === 'sign up'" />
      <AuthForm v-if="sidebarMode === 'sign in'" />
      <SidebarBin v-if="sidebarMode === 'bin'" />
      <SidebarItem
        v-if="sidebarMode === 'item'"
        @scroll-sidebar-to-top="scrollSidebarToTop"
      />
    </div>
  </div>
</template>

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

    .edge-move-catcher {
      position: absolute;
      z-index: 20;
      height: 100vh;
      width: 1px;
      left: -1px;
    }

    .exit-public-view-button,
    .auth-buttons {
      position: fixed;
      top: 10px;
      transform: translateX(-100%) translateX(-20px);
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
        position: absolute;
        z-index: -1;
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
