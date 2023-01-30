<script>
import SidebarFilters from '@/components/sidebarContent/filters/SidebarFilters.vue';
import SidebarVisualization from '@/components/sidebarContent/visualization/SidebarVisualization.vue';
import SidebarLists from '@/components/sidebarContent/lists/SidebarLists.vue';
import SidebarBin from '@/components/sidebarContent/bin/SidebarBin.vue';
import SidebarSettings from '@/components/sidebarContent/settings/SidebarSettings.vue';
import SidebarItem from '@/components/sidebarContent/item/SidebarItem.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';
import SearchVault from '@/components/functionElements/SearchVault.vue';
import PopupBox from '@/components/wrappers/PopupBox.vue';
import { sidebarModesForViews } from '@/store/config';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarVisualization,
    SidebarFilters,
    SidebarLists,
    SidebarSettings,
    SidebarBin,
    SidebarItem,
    ButtonText,
    ButtonSign,
    CustomLink,
    SearchVault,
    PopupBox,
  },
  computed: {
    ...mapGetters('appearance', [
      'isMobileScreen',
    ]),
    ...mapGetters('auth', [
      'isLoggedIn',
    ]),
    ...mapGetters('lists', [
      'isUserOwnsCurrentList',
      'isPublicView',
      'currentListObj',
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
    isAddUnitPossible() {
      return this.currentListObj 
        && !this.isFocusOnList 
        && this.isOwnerView;
    },
    sidebarModes() {
      return sidebarModesForViews[this.currentSidebarView]?.sidebarModes;
    },
  },
  mounted() {
    this.$refs.edgeMoveCatcher.addEventListener('mouseover', () => {
      if (!this.isSidebarOpen) {
        this._openSidebar(
          this.sidebarMode || sidebarModesForViews[this.currentSidebarView]?.default,
        );
      }
    });
  },
  methods: {
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
    openListModal() {
      this.$vfm.show('listModal');
    },
    defineButtonStyleType(mode) {
      if (mode === 'bin' && !this.isMobileScreen) {
        return 'underline';
      }

      return this.isMobileScreen ? 'brick' : 'bordered';
    },
    exitPublicView() {
      this._setCurrentListView('owner');
    },
    changeSidebarState() {
      this.isSidebarOpen
        ? this._closeSidebar()
        : this._openSidebar(this.sidebarMode);
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
    class="sidebar-page"
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
      v-if="isOwnerView"
      class="search-button"
    >
      <SearchVault />
    </div>
    <PopupBox
      v-if="isAddUnitPossible"
      class="add-unit-button"
      button-style-type="plus"
      :position="isMobileScreen ? 'upper-right' : 'left'"
      stop-propagation
      content-type="functional"
    >
      <ButtonText
        text="new item"
        style-type="brick"
        size="small"
        @click="_addNewItemPlaceholder"
      />
      <ButtonText
        text="new list"
        style-type="brick"
        size="small"
        @click="openListModal"
      />
    </PopupBox>
    <div
      v-if="isPublicView && isLoggedIn"
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
      <CustomLink
        :to="{ name: 'requestRegistration' }"
        title="sign up"
      />
      or
      <CustomLink
        :to="{ name: 'signIn' }"
        title="sign in"
      />
    </div>
    <div class="sidebar-buttons">
      <div class="mode-buttons">
        <ButtonText
          v-for="mode in sidebarModes"
          :key="mode"
          :class="{
            'mode-button' : !isMobileScreen && mode !== 'bin',
            'bin-mode-button' : mode === 'bin',
          }"
          :with-box-shadow="!isMobileScreen && mode !== 'bin'"
          :text="mode"
          :style-type="defineButtonStyleType(mode)"
          :size="mode === 'bin' || isMobileScreen ? 'small' : ''"
          :active="sidebarMode === mode"
          @click="_openSidebar(mode)"
        />
      </div>
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
    <div
      ref="sidebarContent"
      class="sidebar-content"
    >
      <SidebarVisualization v-if="sidebarMode === 'visualization'" />
      <SidebarFilters v-if="sidebarMode === 'filters'" />
      <SidebarLists v-if="sidebarMode === 'lists'" />
      <SidebarSettings v-if="sidebarMode === 'settings'" />
      <SidebarBin v-if="sidebarMode === 'bin'" />
      <SidebarItem
        v-if="sidebarMode === 'item'"
        @scroll-sidebar-to-top="scrollSidebarToTop"
      />
    </div>
  </div>
</template>

<style lang="scss">
  .sidebar-page {
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    width: 300px;
    height: 100vh;
    background-color: map-get($colors, 'white');
    transform: translateX(300px);
    transition:
      transform 0.3s,
      box-shadow 0.7s;

    &.shown {
      box-shadow: 15px 0 25px 0 map-get($colors, 'gray-light');
      transform: translateX(0);

      .mode-buttons {
        transform: translateX(-105%) translateX(-15px);
      }

      .state-button {
        transform: translateX(-130%) rotate(180deg);
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
      padding: 25px;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: map-get($colors, 'white');
    }

    .sidebar-buttons {
      position: fixed;
      bottom: 85px;
    }

    .mode-buttons {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-bottom: 10px;
      transform: translateX(10px);
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
      }
    }

    .bin-mode-button {
      padding: 10px;
      transform: translateX(5px);
    }

    .state-button {
      position: fixed;
      bottom: 40px;
      width: fit-content;
      background-color: map-get($colors, 'white');
      transition: transform 0.4s;
      transform: translateX(-100%);
    }

    .search-button {
      position: fixed;
      z-index: 100;
      top: 15px;
      padding: 5px;
      background-color: map-get($colors, 'white');
      transform: translateX(-100%) translateX(-15px);
    }

    .add-unit-button {
      position: fixed;
      z-index: 100;
      top: 50px;
      padding: 5px;
      background-color: map-get($colors, 'white');
      transform: translateX(-100%) translateX(-13px);
    }

    &.inverted-theme {
      background-color: map-get($colors, 'black');
      color: map-get($colors, 'white');
      border-left: 1px solid map-get($colors, 'gray-light');

      &.shown {
        box-shadow: none;
      }

      .add-unit-button,
      .search-button,
      .state-button,
      .sidebar-content {
        background-color: map-get($colors, 'black');
      }
    }
  }

  @media #{breakpoints.$s-media} {
    .sidebar-page {
      &.shown {
        .mode-buttons {
          transform: none;
        }

        .exit-public-view-button,
        .auth-buttons {
          display: none;
        }
      }

      .search-button {
        top: 80px;
      }

      .sidebar-buttons {
        position: fixed;
        z-index: 9;
        top: 0;
        bottom: unset;
        padding-bottom: 30px;
      }

      .mode-buttons {
        flex-flow: row wrap;
        justify-content: flex-end;
        align-items: center;
        gap: 2px;
        padding: 10px 20px;
        background-color: map-get($colors, 'white');
      }

      .sidebar-content {
        padding-top: 80px;
        padding-bottom: 100px;
      }

      .state-button {
        bottom: 120px;
      }
    }

    .inverted-theme {
      .mode-buttons {
        background-color: map-get($colors, 'black');
      }
    }
  }
</style>
