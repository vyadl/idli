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
          class="mode-button"
          style-type="solid"
          v-for="mode in sidebarModes"
          :key="mode"
          :active="sidebarMode === mode"
          :text="mode"
          @click="_openSidebar(mode)"
        />
      </div>
      <div class="state-button">
        <ButtonSign
          style-type="arrow"
          @click="changeSidebarState"
        />
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
import ButtonSign from '@/components/formElements/ButtonSign.vue';
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
    ButtonSign,
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
    changeSidebarState() {
      if (this.isSidebarOpen) {
        this._closeSidebar();
      } else {
        this._openSidebar(this.isLoggedIn ? 'lists' : 'sign up');
      }
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

      .state-button {
        transform: translateX(-200%) rotate(180deg);
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
      margin-bottom: 8px;
      transition: transform .4s;
    }

    .mode-button {
      position: relative;
      margin-bottom: 5px;

      &::before {
        content: '';
        z-index: -1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-shadow: -5px 0 12px 12px white;
      }
    }

    .state-button {
      width: fit-content;
      transition: transform .4s;
      transform: translateX(-150%);
    }

    .add-item-button {
      position: fixed;
      top: 20px;
      transform: translateX(-120%);
    }
  }
</style>
