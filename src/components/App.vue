<template>
  <div
    class="app"
    :class="{
      'cloud-mode': isCloudModeOn || isStarsModeOn,
      'invert': isInvert,
    }"
  >
    <div class="list-title">{{ currentListObj.name || '' }}</div>
    <Settings />
    <transition name="fade">
      <SaveItem v-if="isChangingActive" />
    </transition>
    <MainList />
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
  computed: {
    ...mapGetters([
      'isCloudModeOn',
      'isStarsModeOn',
      'isInvert',
      'isChangingActive',
      'currentListObj',
    ]),
  },
  created() {
    this._getInitialData();
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
