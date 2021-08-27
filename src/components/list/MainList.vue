<template>
  <div
    class="main-list"
    :class="`${globalTheme}-theme`"
    @click="_closeSidebar"
  >
    <div
      class="list-title"
      :class="{ hidden: isFocusOnList }"
      v-if="currentListObj"
    >
      {{ currentListObj.title }}
    </div>
    <div
      class="items-container"
      :class="[
        `${mode}-mode`,
        { parallax: isSidebarOpen },
      ]"
      :style="styles"
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
      sorting: 'sorting',
      mode: 'mode',
      shuffleTrigger: 'shuffleTrigger',
      listAlign: 'listAlign',
      areItemDetailsShown: 'areItemDetailsShown',
      isFocusOnList: 'isFocusOnList',
      isSidebarOpen: 'isSidebarOpen',
    }),
    styles() {
      let styles = {};

      if (this.mode === 'list') {
        const alignStyles = {
          left: 'flex-start',
          center: 'center',
          right: 'flex-end',
          random: null,
        };

        styles = { 'align-items': alignStyles[this.listAlign] };
      }

      return styles;
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

    .items-container {
      transition: transform .5s;

      &.list-mode {
        display: flex;
        flex-direction: column;
        padding: 50px;
      }

      &.cloud-mode,
      &.stars-mode {
        position: fixed;
        overflow: hidden;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 100vh;
      }

      &.parallax {
        transform: translateX(-20px);
      }
    }
  }
</style>
