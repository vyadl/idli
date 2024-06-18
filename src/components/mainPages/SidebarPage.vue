<script>
import SidebarFilters from '@/components/sidebarContent/filters/SidebarFilters.vue';
import SidebarVisualization from '@/components/sidebarContent/visualization/SidebarVisualization.vue';
import SidebarLists from '@/components/sidebarContent/lists/SidebarLists.vue';
import SidebarBin from '@/components/sidebarContent/bin/SidebarBin.vue';
import SidebarSettings from '@/components/sidebarContent/settings/SidebarSettings.vue';
import SidebarItem from '@/components/sidebarContent/item/SidebarItem.vue';
import SidebarList from '@/components/sidebarContent/list/SidebarList.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';
import SearchVault from '@/components/functionElements/SearchVault.vue';
import PopupBox from '@/components/wrappers/PopupBox.vue';
import { sidebarModesForViews, sidebarWidthValues } from '@/store/config';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { deleteFromQuery } from '@/router/utils';

export default {
  components: {
    SidebarVisualization,
    SidebarFilters,
    SidebarLists,
    SidebarList,
    SidebarSettings,
    SidebarBin,
    SidebarItem,
    ButtonText,
    ButtonSign,
    CustomLink,
    SearchVault,
    PopupBox,
  },
  emits: ['resize'],
  data() {
    return {
      dividerPosition: sidebarWidthValues.main,
      compactLayout: false,
    };
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
      'currentListId',
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
    sidebarStyles() {
      const styles = {};

      styles.width = `${this.dividerPosition}px`;
      styles.transform = this.isSidebarOpen
        ? 'translateX(0)'
        : `translateX(${this.dividerPosition}px)`;

      return styles;
    },
    isSidebarBreakpointReached() {
      return this.dividerPosition > sidebarWidthValues.breakpoint;
    },
  },
  created() {
    const { sidebar } = this.$route.query;
    
    if (sidebar) {
      this._openSidebar(sidebar);
    }

    if (this.$route.query.item && this.$route.name !== 'list') {
      deleteFromQuery('item');
    }

    if (this.isPublicView && this.sidebarMode === 'lists') {
      this.changeSidebarMode('filters');
      this._closeSidebar();
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleWindowResize);
    window.addEventListener('mouseup', this.endResize);
  },
  methods: {
    ...mapMutations('lists', [
      'setParentListIdForNewList',
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
    ...mapActions(['_globalBlockSelecting', '_globalAllowSelecting']),
    catchEdgeMove() {
      if (!this.isSidebarOpen) {
        this._openSidebar(
          this.sidebarMode || sidebarModesForViews[this.currentSidebarView]?.default,
        );
      }
    },
    handleWindowResize() {
      const isRemainingSpaceEnoughForSidebarButtons = window.innerWidth > this.dividerPosition 
        + sidebarWidthValues.buttons;
      const isSidebarButtonsBreakpointReached = window.innerWidth < this.dividerPosition 
        + sidebarWidthValues.buttons * 2;

      if (!isRemainingSpaceEnoughForSidebarButtons && !this.isMobileScreen) {
        this.dividerPosition = window.innerWidth - sidebarWidthValues.buttons;
      }

      if (this.isMobileScreen) {
        this.dividerPosition = sidebarWidthValues.main;
      }

      this.compactLayout = isSidebarButtonsBreakpointReached;
      this.$emit('resize', this.dividerPosition);
    },
    handleSidebarResize(event) {
      event.preventDefault();

      const newPosition = window.innerWidth - event.pageX;
      const isRemainingSpaceEnoughForSidebarButtons = event.pageX >= sidebarWidthValues.buttons;
      const isSidebarButtonsBreakpointReached = event.pageX < sidebarWidthValues.buttons * 2;
      const isNewPositionValid = newPosition >= sidebarWidthValues.main 
        && isRemainingSpaceEnoughForSidebarButtons;

      if (isNewPositionValid) {
        this.dividerPosition = newPosition;
      }

      if (!isRemainingSpaceEnoughForSidebarButtons) {
        this.dividerPosition = window.innerWidth - sidebarWidthValues.buttons;
        this.endResize();
      }

      this.compactLayout = isSidebarButtonsBreakpointReached;
      this.$emit('resize', this.dividerPosition);
    },
    startResize() {
      document.addEventListener('mousemove', this.handleSidebarResize);
      this._globalBlockSelecting();
    },
    endResize() {
      document.removeEventListener('mousemove', this.handleSidebarResize);
      this._globalAllowSelecting();
    },
    openModal(name, parentListId) {
      if (parentListId) {
        this.setParentListIdForNewList(parentListId);
      }

      this.$vfm.show(name);
    },
    defineButtonStyleType(mode) {
      if (mode === 'bin' && !this.isMobileScreen && !this.compactLayout) {
        return 'underline';
      }

      return this.isMobileScreen || this.compactLayout
        ? 'brick'
        : 'bordered';
    },
    isMainModeButton(mode) {
      return !this.isMobileScreen && !this.compactLayout && mode !== 'bin';
    },
    exitPublicView() {
      this._setCurrentListView('owner');
      this._closeSidebar();
    },
    changeSidebarState() {
      this.isSidebarOpen
        ? this._closeSidebar()
        : this._openSidebar(this.sidebarMode);
    },
  },
};
</script>

<template>
  <div
    class="sidebar-page"
    :class="[
      {
        shown: isSidebarOpen,
        compact: compactLayout,
      },
      `${globalTheme}-theme`,
    ]"
    :style="sidebarStyles"
  >
    <div
      v-show="!isSidebarOpen"
      class="edge-move-catcher"
      @mouseover="catchEdgeMove"
      @focus="catchEdgeMove"
    />
    <div
      v-if="isSidebarOpen && !isMobileScreen"
      class="divider-container"
      @mousedown="startResize"
    >
      <div class="divider" />
    </div>
    <div
      v-if="isOwnerView || $route.name === 'home'"
      class="search-button"
    >
      <SearchVault />
    </div>
    <PopupBox
      v-if="isAddUnitPossible"
      class="add-unit-button"
      button-style-type="plus"
      :position="isMobileScreen || compactLayout ? 'upper-right' : 'left'"
      stop-propagation
      content-type="functional"
    >
      <ButtonText
        text="add item"
        style-type="brick"
        size="small"
        @click="_addNewItemPlaceholder"
      />
      <ButtonText
        text="add list"
        style-type="brick"
        size="small"
        @click="openModal('listModal', currentListId)"
      />
      <ButtonText
        text="add bulk items"
        style-type="brick"
        size="small"
        @click="openModal('bulkItemsModal')"
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
            'mode-button' : isMainModeButton(mode),
            'bin-mode-button' : mode === 'bin',
          }"
          :with-box-shadow="isMainModeButton(mode)"
          :text="mode"
          :style-type="defineButtonStyleType(mode)"
          :size="isMainModeButton(mode) ? '' : 'small'"
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
      <SidebarVisualization
        v-if="sidebarMode === 'visualization'"
        :is-sidebar-breakpoint-reached="isSidebarBreakpointReached"
      />
      <SidebarFilters
        v-if="sidebarMode === 'filters'"
        :is-sidebar-breakpoint-reached="isSidebarBreakpointReached"
      />
      <SidebarLists
        v-if="sidebarMode === 'lists'"
        :is-sidebar-breakpoint-reached="isSidebarBreakpointReached"
      />
      <SidebarList
        v-if="sidebarMode === 'list'"
        :is-sidebar-breakpoint-reached="isSidebarBreakpointReached"
      />
      <SidebarSettings v-if="sidebarMode === 'settings'" />
      <SidebarBin
        v-if="sidebarMode === 'bin'"
        :is-sidebar-breakpoint-reached="isSidebarBreakpointReached"
      />
      <SidebarItem
        v-if="sidebarMode === 'item'"
        :is-sidebar-breakpoint-reached="isSidebarBreakpointReached"
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
    height: 100vh;
    background-color: map-get($colors, 'white');
    overflow: visible;
    transition: transform 0.3s;

    &.shown {
      .mode-buttons {
        transform: translateX(-105%) translateX(-15px);
      }

      .state-button {
        transform: translateX(-130%) rotate(180deg);
      }
    }

    .edge-move-catcher {
      position: absolute;
      z-index: 15;
      height: 100vh;
      width: 1px;
      left: -1px;
    }

    .divider-container {
      --padding-right: 8px;
      position: absolute;
      z-index: 10;
      height: 100vh;
      right: calc(100% - var(--padding-right));
      display: flex;
      justify-content: flex-end;
      padding-right: var(--padding-right);
      width: calc(var(--padding-right) * 2);
      background-color: transparent;
      cursor: ew-resize;

      &:hover {
        .divider {
          width: 4px;
        }
      }
    }

    .divider {
      top: 0;
      height: 100vh;
      width: 2px;
      background: map-get($colors, 'gray-light');
      transition: width 0.2s;
    }

    .exit-public-view-button,
    .auth-buttons {
      position: fixed;
      top: 10px;
      transform: translateX(-100%) translateX(-20px);
    }

    .sidebar-content {
      position: relative;
      z-index: 200;
      width: 100%;
      height: 100%;
      padding: 25px;
      overflow: auto;
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
      z-index: 50;
      top: 15px;
      padding: 5px;
      background-color: map-get($colors, 'white');
      transform: translateX(-100%) translateX(-15px);
    }

    .add-unit-button {
      position: fixed;
      z-index: 50;
      top: 50px;
      padding: 5px;
      background-color: map-get($colors, 'white');
      transform: translateX(-100%) translateX(-13px);
    }

    &.inverted-theme {
      background-color: map-get($colors, 'black');
      color: map-get($colors, 'white');

      .add-unit-button,
      .search-button,
      .state-button,
      .sidebar-content {
        background-color: map-get($colors, 'black');
      }

      .divider {
        background-color: map-get($colors, 'gray-dark');
      }
    }

    &.compact {
      &.shown {
        border-left: 1px solid map-get($colors, 'gray-light');

        .mode-buttons {
          transition: none;
          transform: none;
        }

        .exit-public-view-button,
        .auth-buttons {
          display: none;
        }
      }

      .sidebar-buttons {
        position: fixed;
        z-index: 9;
        top: 0;
        bottom: unset;
        width: 100%;
        padding-bottom: 30px;
      }

      .mode-buttons {
        flex-flow: row wrap;
        justify-content: flex-start;
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
  }

  @media #{breakpoints.$s-media} {
    .sidebar-page {
      &.shown {
        border-left: 1px solid map-get($colors, 'gray-light');

        .mode-buttons {
          transform: none;
        }

        .exit-public-view-button,
        .auth-buttons {
          display: none;
        }
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
      border-left: 1px solid map-get($colors, 'gray-dark');

      .mode-buttons {
        background-color: map-get($colors, 'black');
      }
    }
  }
</style>
