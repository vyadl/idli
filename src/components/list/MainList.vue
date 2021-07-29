<template>
  <div class="main-list">
    <transition name="fade">
      <div
        class="preloader"
        v-if="listChanging"
      >
      </div>
    </transition>
    <template v-if="isCloudModeOn && !isStarsModeOn">
      <ListItem
        v-for="item in finalList"
        :key="item.id"
        :item="item"
      />
    </template>
    <template v-else>
      <div class="inner">
        <transition name="fade">
          <div v-if="isListShown">
            <ListItem
              v-for="item in finalList"
              :key="item.id"
              :item="item"
            />
          </div>
        </transition>
      </div>
    </template>
  </div>
</template>

<script>
import ListItem from '@/components/list/ListItem.vue';
import Utils from '@/utils/utils';
import { mapGetters } from 'vuex';

export default {
  components: {
    ListItem,
  },
  data: () => ({
    isListShown: false,
    finalList: [],
  }),
  computed: {
    ...mapGetters({
      filteredList: 'filteredList',
      shuffleTrigger: 'shuffleTrigger',
      isCloudModeOn: 'isCloudModeOn',
      isStarsModeOn: 'isStarsModeOn',
      listChanging: 'listChanging',
      isShuffled: 'isShuffled',
    }),
    shuffledList() {
      this.shuffleTrigger; // eslint-disable-line no-unused-expressions

      return Utils.shuffleArray(this.filteredList);
    },
    computedList() {
      return this.isShuffled ? this.shuffledList : this.filteredList;
    },
  },
  watch: {
    computedList: {
      handler: function computedListHanler() {
        this.isListShown = false;

        setTimeout(() => {
          this.finalList = [];
          this.finalList = this.computedList;
          this.isListShown = true;
        }, 200);
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss">
  .main-list {
    padding-top: 40px;
    text-align: center;

    .inner {
      display: flex;
      flex-direction: column;
    }

    .preloader {
      position: fixed;
      z-index: 100;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(#fff, .3);
    }
  }
</style>