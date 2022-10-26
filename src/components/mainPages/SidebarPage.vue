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
import { sidebarModesForViews } from '@/store/config';
import { mapGetters, mapActions, mapMutations } from 'vuex';

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
  computed: {
    ...mapGetters('auth', [
      'isLoggedIn',
    ]),
    ...mapGetters('lists', [
      'isUserOwnsCurrentList',
      'currentListObj',
      'isPublicView',
      'isOwnerView',
    ]),
    ...mapGetters('settings', [
      'isItemFormInSidebar',
      'isFocusOnList',
    ]),
    ...mapGetters('sidebar', [
      'isSidebarOpen',
      'sidebarMode',
      'currentSidebarView',
    ]),
    sidebarModes() {
      return sidebarModesForViews[this.currentSidebarView]?.sidebarModes;
    },
    isAddItemPossible() {
      return this.isLoggedIn 
        && this.currentListObj 
        && !this.isFocusOnList 
        && this.isOwnerView;
    },
  },
  mounted() {
    this.$refs.edgeMoveCatcher.addEventListener('mouseover', () => {
      if (!this.isSidebarOpen) {
        this._openSidebar(sidebarModesForViews[this.currentSidebarView]?.default);
      }
    });
  },
  methods: {
    ...mapMutations([
      'setModalNameToShow',
    ]),
    ...mapActions('lists', [
      '_setCurrentListView',
    ]),
    ...mapActions('items', [
      '_addNewItemPlaceholder',
    ]),
    ...mapActions('sidebar', [
      '_openSidebar',
      '_closeSidebar',
    ]),
    openItemModal() {
      this.setModalNameToShow('itemModal');
    },
    exitPublicView() {
      this._setCurrentListView('owner');
    },
    changeSidebarState() {
      this.isSidebarOpen
        ? this._closeSidebar()
        : this._openSidebar(this.isLoggedIn 
          ? this.sidebarMode : sidebarModesForViews.authPageView.default);
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
      ref="edgeMoveCatcher"
      class="edge-move-catcher"
    />
    <div
      v-if="isAddItemPossible"
      class="add-item-button"
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
      <router-link
        :to="{ name: 'auth', query: { sidebar: 'sign up' }}"
        target="_blank"
      >
        sign up
      </router-link>
      or
      <router-link
        :to="{ name: 'auth', query: { sidebar: 'sign in' }}"
        target="_blank"
      >
        sign in
      </router-link>
    </div>
    <div class="sidebar-buttons">
      <div class="mode-buttons">
        <ButtonText
          v-for="mode in sidebarModes"
          :key="mode"
          class="mode-button"
          :text="mode"
          :style-type="mode === 'bin' ? 'underline' : 'bordered'"
          :small="mode === 'bin'"
          :active="sidebarMode === mode"
          @click="_openSidebar(mode)"
        />
      </div>
      <div
        v-if="!isFocusOnList"
        class="state-button"
      >
        <ButtonSign
          style-type="arrow"
          @click="changeSidebarState"
        />
      </div>
    </div>
    <div
      ref="sidebarContent"
      class="sidebar-content"
    >
      <SidebarVisualization v-if="sidebarMode === 'visualization'" />
      <SidebarFilters v-if="sidebarMode === 'filters'" />
      <SidebarLists v-if="sidebarMode === 'lists'" />
      <SidebarSettings v-if="sidebarMode === 'settings'" />
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
      transform 0.5s,
      box-shadow 0.7s;

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
      transition: transform 0.4s;
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
      transition: transform 0.4s;
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
