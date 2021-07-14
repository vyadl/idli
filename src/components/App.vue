<template>
  <div
    class="app"
    :class="{
      'cloud-mode': isCloudModeOn || isStarsModeOn,
      'invert': isInvert,
    }"
  >
    <div
      class="list-title"
      v-if="currentListName"
    >
      {{ currentListName }}
    </div>
    <transition name="fade">
      <SaveItem v-if="isChangingActive" />
    </transition>
    <div
      class="main-content"
      :class="{ parallax: isSidebarOpen }"
    >
      <MainList />
    </div>
    <Sidebar />
  </div>
</template>

<script>
import SaveItem from '@/components/SaveItem.vue';
import MainList from '@/components/MainList.vue';
import Sidebar from '@/components/Sidebar.vue';
import axiosSettings from '@/settings/axiosSettings';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SaveItem,
    MainList,
    Sidebar,
  },
  computed: {
    ...mapGetters([
      'isCloudModeOn',
      'isStarsModeOn',
      'isInvert',
      'isChangingActive',
      'currentListObj',
      'isSidebarOpen',
    ]),
    currentListName() {
      return this.currentListObj?.name;
    },
  },
  created() {
    axiosSettings.initAxios();
    this._getInitialData();
  },
  methods: {
    ...mapActions(['_getInitialData']),
  },
};
</script>

<style lang="scss">
  .app {
    width: 100%;
    height: 100vh;

    &.cloud-mode {
      position: fixed;
      overflow: hidden;
      top: 0;
      left: 0;
    }

    &.invert {
      background-color: #000;
      color: #fff;
    }

    .list-title {
      color: #bbb;
      font-size: 14px;
      padding: 10px;
    }

    .main-content {
      transition: transform .5s;

      &.parallax {
        transform: translateX(-20px);
      }
    }
  }
</style>
