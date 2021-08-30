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
        {
          'move-to-left': !isListUnderSidebar && isSidebarOpen,
          parallax: isSidebarOpen,
        },
      ]"
      :style="styles"
    >
      <template v-if="mode === 'cards'">
        <masonry
          :cols="4"
          :gutter="30"
        >
          <ListItem
            v-for="item in finalList"
            :key="item.id"
            :item="item"
          />
        </masonry>
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
      isListUnderSidebar: 'isListUnderSidebar',
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
      } else if (this.mode === 'page') {
        const alignStyles = {
          left: 'flex-start',
          center: 'center',
          right: 'flex-end',
          edges: 'space-between',
        };

        styles = { 'justify-content': alignStyles[this.listAlign] };
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
      padding: 50px;
      transition:
        margin .5s,
        transform .5s;

      &.list-mode {
        display: flex;
        flex-direction: column;
      }

      &.page-mode {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
      }

      &.cloud-mode,
      &.stars-mode {
        position: fixed;
        overflow: hidden;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 100vh;
        padding: 0;
      }

      &.move-to-left {
        margin-right: 280px;
      }

      &.parallax {
        transform: translateX(-20px);
      }
    }
  }
</style>
