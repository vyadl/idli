<template>
  <div
    class="main-list"
    @click="_closeSidebar"
  >
    <div
      class="list-title"
      :class="{ hidden: mode === 'focus' }"
      v-if="currentListObj"
    >
      {{ currentListObj.title }}
    </div>
    <div
      class="items-container"
      :class="{
        parallax: isSidebarOpen,
        'list-principle': listModePrinciple === 'list',
        'cloud-principle': listModePrinciple === 'cloud',
      }"
    >
      <ListItem
        v-for="item in finalList"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
import ListItem from '@/components/list/ListItem.vue';
import { shuffleArray } from '@/utils/utils';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ListItem,
  },
  data: () => ({
    finalList: [],
  }),
  computed: {
    ...mapGetters({
      currentListObj: 'currentListObj',
      filteredList: 'filteredList',
      isSidebarOpen: 'isSidebarOpen',
      sorting: 'sorting',
      mode: 'mode',
      shuffleTrigger: 'shuffleTrigger',
    }),
    listModePrinciple() {
      return ['list', 'focus'].includes(this.mode) ? 'list' : 'cloud';
    },
    shuffledList() {
      this.shuffleTrigger; // eslint-disable-line no-unused-expressions

      return shuffleArray(this.filteredList);
    },
    computedList() {
      return this.sorting === 'shuffled' ? this.shuffledList : this.filteredList;
    },
  },
  watch: {
    computedList: {
      handler: function computedListHandler() {
        this.finalList = [];
        this.finalList = this.computedList;
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      _closeSidebar: '_closeSidebar',
    }),
  },
};
</script>

<style lang="scss">
  .main-list {
    width: 100%;
    min-height: 100vh;

    .list-title {
      padding: 10px;
      font-size: map-get($text, 'title-font-size');
      color: map-get($colors, 'gray-light');

      &.hidden {
        opacity: 0;
      }
    }

    .focus-mode-message {
      position: absolute;
      top: 0;
      left: 50%;
      padding: 20px;
      transform: translateX(-50%);
    }

    .items-container {
      transition: transform .5s;

      &.parallax {
        transform: translateX(-20px);
      }

      &.list-principle {
        display: flex;
        flex-direction: column;
        padding: 50px;
      }

      &.cloud-principle {
        position: fixed;
        overflow: hidden;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 100vh;
      }
    }
  }
</style>
