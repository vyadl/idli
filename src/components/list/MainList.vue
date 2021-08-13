<template>
  <div
    class="main-list"
    @click="_closeSidebar"
  >
    <div
      class="list-title"
      v-if="currentListObj"
    >
      {{ currentListObj.name }}
    </div>
    <template v-if="isCloudModeOn && !isStarsModeOn">
      <ListItem
        v-for="item in finalList"
        :key="item.id"
        :item="item"
      />
    </template>
    <template v-else>
      <div
        class="items-container"
        :class="{ parallax: isSidebarOpen }"
      >
        <div v-if="isListShown">
          <ListItem
            v-for="item in finalList"
            :key="item.id"
            :item="item"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ListItem from '@/components/list/ListItem.vue';
import utils from '@/utils/utils';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ListItem,
  },
  data: () => ({
    isListShown: true,
    finalList: [],
  }),
  computed: {
    ...mapGetters({
      currentListObj: 'currentListObj',
      filteredList: 'filteredList',
      shuffleTrigger: 'shuffleTrigger',
      sorting: 'sorting',
      isCloudModeOn: 'isCloudModeOn',
      isStarsModeOn: 'isStarsModeOn',
      isSidebarOpen: 'isSidebarOpen',
    }),
    currentListName() {
      return this.currentListObj?.name;
    },
    shuffledList() {
      this.shuffleTrigger; // eslint-disable-line no-unused-expressions

      return utils.shuffleArray(this.filteredList);
    },
    computedList() {
      return this.sorting === 'shuffled' ? this.shuffledList : this.filteredList;
    },
  },
  watch: {
    computedList: {
      handler: function computedListHanler() {
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
    height: 100vh;

    .list-title {
      margin-bottom: 40px;
      padding: 10px;
      font-size: map-get($text, 'title-font-size');
      color: map-get($colors, 'gray-light');
    }

    .items-container {
      display: flex;
      flex-direction: column;
      transition: transform .5s;

      &.parallax {
        transform: translateX(-20px);
      }
    }
  }
</style>
