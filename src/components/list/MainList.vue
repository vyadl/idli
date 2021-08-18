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
    <div
      class="items-container"
      :class="{ parallax: isSidebarOpen }"
    >
      <template v-if="mode === 'list'">
        <div class="list-mode">
          <ListItem
            v-for="item in finalList"
            :key="item.id"
            :item="item"
          />
        </div>
      </template>
      <template v-else>
        <ListItem
          v-for="item in finalList"
          :key="item.id"
          :item="item"
        />
      </template>
    </div>
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
    min-height: 100vh;

    .list-title {
      padding: 10px;
      font-size: map-get($text, 'title-font-size');
      color: map-get($colors, 'gray-light');
    }

    .items-container {
      transition: transform .5s;

      &.parallax {
        transform: translateX(-20px);
      }
    }

    .list-mode {
      display: flex;
      flex-direction: column;
      padding: 50px;
    }
  }
</style>
