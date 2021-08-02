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
        @click="openItemForm"
      />
    </div>
    <div class="sidebar-buttons">
      <div class="mode-buttons">
        <ButtonText
          style-type="solid"
          v-for="mode in sidebarModes"
          :key="mode"
          :active="sidebarMode === mode"
          :text="mode"
          @click="_openSidebar(mode)"
        />
      </div>
      <div
        class="open-button"
        @click="isSidebarOpen ? _closeSidebar() : _openSidebar(isLoggedIn ? 'lists' : 'sign up')"
      >
        <div class="arrow"></div>
      </div>
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
  methods: {
    ...mapActions({
      _openSidebar: '_openSidebar',
      _closeSidebar: '_closeSidebar',
    }),
    openItemForm() {
      this.$modal.show('itemForm');
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
    background-color: white;
    transform: translateX(300px);
    transition:
      transform .5s,
      box-shadow .7s;

    &.show {
      box-shadow: 15px 0 30px 0 gray;
      transform: translateX(0);

      .mode-buttons {
        transform: translateX(-110%);
      }

      .open-button {
        transform: translateX(-180%);
      }

      .arrow {
        transform: rotate(135deg);
      }
    }

    .sidebar-content {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 30px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .sidebar-buttons {
      position: fixed;
      bottom: 30px;
    }

    .mode-buttons {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-bottom: 15px;
      transition: transform .4s;
    }

    .open-button {
      width: 25px;
      height: 25px;
      cursor: pointer;
      transform: translateX(-100%);
    }

    .arrow {
      width: 100%;
      height: 100%;
      border-left: 5px solid map-get($colors, 'black');
      border-top: 5px solid map-get($colors, 'black');
      transition: transform .4s;
      transform-origin: center center;
      transform: rotate(-45deg);
    }

    .add-item-button {
      position: fixed;
      top: 20px;
      transform: translateX(-120%);
    }
  }
</style>
