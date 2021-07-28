<template>
  <div
    class="sidebar j-sidebar"
    :class="{ 'show': isSidebarOpen }"
  >
    <div
      class="add-item-button"
      v-if="isLoggedIn"
    >
      <ButtonIcon
        icon-name="add"
        @click="_startCreatingItem"
      />
    </div>
    <div
      class="open-sidebar-button"
      :class="{ hide: isSidebarOpen }"
      :disabled="isSidebarOpen"
      @click="_openSidebar(isLoggedIn ? 'lists' : 'sign up')"
    >
      <div class="arrow"></div>
    </div>
    <div
      class="sidebar-mode-buttons"
      :class="{ show: isSidebarOpen }"
    >
      <ButtonText
        style-type="solid"
        v-for="mode in sidebarModes"
        :key="mode"
        :active="sidebarMode === mode"
        :text="mode"
        @click="_openSidebar(mode)"
      />
    </div>
    <div class="sidebar-content">
      <Filters v-if="sidebarMode === 'filters'" />
      <Visualization v-if="sidebarMode === 'visualization'" />
      <ListsList v-if="sidebarMode === 'lists'" />
      <UserProfile v-if="sidebarMode === 'profile'"/>
      <RegistrationForm v-if="sidebarMode === 'sign up'" />
      <AuthForm v-if="sidebarMode === 'sign in'" />
    </div>
  </div>
</template>

<script>
import Filters from '@/components/sidebarContent/Filters.vue';
import Visualization from '@/components/sidebarContent/Visualization.vue';
import ListsList from '@/components/sidebarContent/ListsList.vue';
import UserProfile from '@/components/sidebarContent/UserProfile.vue';
import RegistrationForm from '@/components/sidebarContent/auth/RegistrationForm.vue';
import AuthForm from '@/components/sidebarContent/auth/AuthForm.vue';
import ButtonIcon from '@/components/formElements/ButtonIcon.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    Filters,
    Visualization,
    ListsList,
    UserProfile,
    RegistrationForm,
    AuthForm,
    ButtonIcon,
    ButtonText,
  },
  computed: {
    ...mapGetters({
      isSidebarOpen: 'isSidebarOpen',
      sidebarMode: 'sidebarMode',
      isLoggedIn: 'auth/isLoggedIn',
    }),
    sidebarModes() {
      return this.isLoggedIn
        ? ['filters', 'visualization', 'lists', 'profile']
        : ['sign up', 'sign in'];
    },
  },
  mounted() {
    document.addEventListener('click', event => {
      if (!event.target.closest('.j-sidebar')) {
        this._closeSidebar();
      }
    });
  },
  methods: {
    ...mapActions({
      _startCreatingItem: '_startCreatingItem',
      _openSidebar: '_openSidebar',
      _closeSidebar: '_closeSidebar',
    }),
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
    background-color: white;
    transform: translateX(300px);
    transition:
      transform .5s,
      box-shadow .7s;

    &.show {
      box-shadow: 15px 0 30px 0 gray;
      transform: translateX(0);
    }

    .sidebar-content {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 30px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .open-sidebar-button {
      width: 25px;
      height: 25px;
      position: fixed;
      bottom: 30px;
      cursor: pointer;
      transform: translateX(-120%);
      transition:
        opacity .2s,
        transform .3s;

      &.hide {
        z-index: -10;
        opacity: 0;
        transform: translateX(-200%);
      }
    }

    .arrow {
      width: 100%;
      height: 100%;
      border-left: 5px solid map-get($colors, 'black');
      border-top: 5px solid map-get($colors, 'black');
      transform-origin: center center;
      transform: rotate(-45deg);
    }

    .sidebar-mode-buttons {
      position: fixed;
      bottom: 30px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      transition: transform .4s;

      &.show {
        transform: translateX(-120%);
      }
    }

    .add-item-button {
      position: fixed;
      top: 20px;
      transform: translateX(-120%);
    }
  }
</style>
