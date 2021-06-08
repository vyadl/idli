<template>
  <div
    class="app"
    :class="{
      'cloud-mode': isCloudModeOn || isStarsModeOn,
      'invert': isInvert,
    }"
  >
    <div class="list-title">{{ currentList ? currentList.name : '' }}</div>
    <settings></settings>
    <transition name="fade">
      <save-item v-if="isChangingActive"></save-item>
    </transition>
    <main-list></main-list>
  </div>
</template>

<script>
import SaveItem from '@/components/SaveItem.vue';
import MainList from '@/components/MainList.vue';
import Settings from '@/components/Settings.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SaveItem,
    MainList,
    Settings,
  },

  created() {
    this._getInitialData();
  },

  computed: {
    ...mapGetters(['isCloudModeOn', 'isStarsModeOn', 'isInvert', 'isChangingActive', 'currentList']),
  },

  methods: {
    ...mapActions(['_getInitialData']),
  },
};
</script>

<style lang="scss">
  .app {
    &.cloud-mode {
      position: fixed;
      width: 100%;
      height: 100%;
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
  }
</style>
