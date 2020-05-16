<template>
  <div 
    class="app"
    :class="{ 
      'app--cloud-mode': isCloudModeOn || isStarsModeOn, 
      'app--invert': isInvert,
    }"
  >
    <div class="app__title">{{ listObj.name }}</div>
    <settings></settings>
    <transition name="fade">
      <save-item v-if="isChangingActive"></save-item>
    </transition>
    <main-list></main-list>
  </div>
</template>

<script>
import SaveItem from './SaveItem.vue';
import MainList from './MainList.vue';
import Settings from './Settings.vue';
import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'App',
    components: {
      SaveItem,
      MainList,
      Settings,
    },

    created() {
      this._getInitialData();
    },

    computed: {
      ...mapGetters(['isCloudModeOn', 'isStarsModeOn', 'isInvert', 'isChangingActive', 'listObj']),
    },

    methods: {
      ...mapActions(['_getInitialData']),
    }
  }
</script>

<style scoped lang="scss">
.app {
  font: 12px Verdana, sans-serif;
  &--cloud-mode {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    top: 0;
    left: 0;
  }
  &--invert {
    background-color: #000;
    color: #fff;
  }

  &__title {
    color: #bbb;
    font-size: 14px;
    padding: 10px;
  }
}
</style>