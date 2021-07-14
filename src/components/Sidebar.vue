<template>
  <div
    class="sidebar"
    :class="{ 'show': isSidebarOpen }"
  >
    <div class="add-item-button">
      <ButtonIcon
        icon-name="add"
        @click="_startCreatingItem"
      />
    </div>
    <div class="open-sidebar-buttons">
      <ButtonIcon
        v-for="mode in sidebarModes"
        :key="mode"
        :class="{ 'active': sidebarMode === mode }"
        :icon-name="mode"
        @click="_openSidebar(mode)"
      />
      <ButtonText
        style-type="solid"
        text="registration"
        :class="{ 'active': sidebarMode === 'registration' }"
        @click="_openSidebar('registration')"
      />
      <ButtonText
        style-type="solid"
        text="log in"
        :class="{ 'active': sidebarMode === 'auth' }"
        @click="_openSidebar('auth')"
      />
    </div>
    <div class="sidebar-content">
      <Filters v-if="sidebarMode === 'filters'" />
      <Visualization v-if="sidebarMode === 'visualization'" />
      <Lists v-if="sidebarMode === 'lists'" />
      <RegistrationForm v-if="sidebarMode === 'registration'" />
      <AuthForm v-if="sidebarMode === 'auth'" />
    </div>
  </div>
</template>

<script>
import Filters from '@/components/settings/Filters.vue';
import Visualization from '@/components/settings/Visualization.vue';
import Lists from '@/components/settings/Lists.vue';
import RegistrationForm from '@/components/auth/RegistrationForm.vue';
import AuthForm from '@/components/auth/AuthForm.vue';
import ButtonIcon from '@/components/formElements/ButtonIcon.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    Filters,
    Visualization,
    Lists,
    RegistrationForm,
    AuthForm,
    ButtonIcon,
    ButtonText,
  },
  data: () => ({
    sidebarModes: ['filters', 'visualization', 'lists'],
  }),
  computed: {
    ...mapGetters([
      'isSidebarOpen',
      'sidebarMode',
    ]),
  },
  mounted() {
    document.addEventListener('click', event => {
      if (!event.target.closest('.sidebar')) {
        this._closeSidebar();
      }
    });
  },
  methods: {
    ...mapActions([
      '_startCreatingItem',
      '_openSidebar',
      '_closeSidebar',
    ]),
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

    .open-sidebar-buttons {
      position: fixed;
      bottom: 30px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      transform: translateX(-120%);
    }

    .add-item-button {
      position: fixed;
      top: 20px;
      transform: translateX(-120%);
    }
  }
</style>
