<template>
<div class="main-list">
  <div
    v-if="false"
    class="main-list__add"
    @click="_startCreatingItem"
  ></div>
  <transition name="fade">
    <div 
      class="main-list__preloader"
      v-if="listChanging"
    >
    </div>
  </transition>
  <template v-if="isCloudModeOn && !isStarsModeOn">
    <list-item
      v-for="item in finalList"
      :key="item.id"
      :item="item"
    ></list-item>
  </template>
  <template v-else>
    <transition-group class="main-list__list-wrap" name="item">
      <list-item
        v-for="item in finalList"
        :key="item.id"
        :item="item"
      ></list-item>
    </transition-group>
  </template>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Utils from '../utils/utils';
import ListItem from './ListItem.vue';

export default {
  name: 'MainList',
  components: {
    ListItem,
  },

  computed: {
    ...mapGetters([
      'filteredList', 
      'shuffleTrigger',
      'isCloudModeOn',
      'isStarsModeOn',
      'listChanging',
      'isShuffled'
    ]),
    shuffledList() {
      this.shuffleTrigger;

      return Utils.shuffleArray(this.filteredList);
    },

    finalList() {
      return this.isShuffled ? this.shuffledList : this.filteredList;
    },

    transitionName() {
      return this.isCloudModeOn ? 'none' :'item';
    },
  },

  methods: {
    ...mapActions(['_startCreatingItem', '_changeCloudMode']),
  },
};
</script>

<style scoped lang="scss">
.main-list {
  text-align: center;
  padding-top: 40px;

  &__list-wrap {
    display: flex;
    flex-direction: column;
  }

  &__preloader {
    position: fixed;
    z-index: 100;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    background-color: rgba(#fff, .3);
  }

  &__add {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    z-index: 2;
    transition: .2s opacity;
    opacity: .7;
    &:hover {
      opacity: 1;
    }

    &::after,
    &::before {
      content: '';
      position: absolute;
      background-color: #333;
    }

    &::before {
      width: 2px;
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &::after {
      width: 100%;
      height: 2px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.item-move {
  transition: transform .5s;
}

.none-move {
}
</style>
