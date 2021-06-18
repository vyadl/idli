<template>
  <div
    class="sidebar"
    :class="{ 'show': isSidebarOpen }"
  >
    <div class="add-item-button">
      <ButtonIcon
        :icon="'/icons/add.svg'"
        @click="_startCreatingItem"
      />
    </div>
    <div class="open-sidebar-buttons">
      <ButtonIcon
        v-for="mode in sidebarModes"
        :key="mode.mode"
        :class="{ 'active': sidebarMode === mode.mode }"
        :icon="mode.icon"
        @click="_openSidebar(mode.mode)"
      />
    </div>
    <div class="sidebar-content">
      <Filters v-if="sidebarMode === 'filters'" />
      <Visualization v-if="sidebarMode === 'visualization'" />
      <div v-if="sidebarMode === 'lists'">
        <Lists />
        <TestData />
      </div>
    </div>
  </div>
</template>

<script>
import Filters from '@/components/settings/Filters.vue';
import Visualization from '@/components/settings/Visualization.vue';
import TestData from '@/components/settings/TestData.vue';
import Lists from '@/components/settings/Lists.vue';
import ButtonIcon from '@/components/formElements/ButtonIcon.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    Filters,
    Visualization,
    TestData,
    Lists,
    ButtonIcon,
  },
  data: () => ({
    sidebarModes: [
      {
        mode: 'filters',
        icon: '/icons/filters.svg',
      },
      {
        mode: 'visualization',
        icon: '/icons/visualization.svg',
      },
      {
        mode: 'lists',
        icon: '/icons/lists.svg',
      },
    ],
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
      transform: translateX(-120%);
    }

    .add-item-button {
      position: fixed;
      top: 20px;
      transform: translateX(-120%);
    }
  }
</style>
