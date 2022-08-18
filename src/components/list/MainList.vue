<script>
import ListItem from '@/components/list/ListItem.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { shuffleArray } from '@/utils/utils';
import { sortByDate, sortByAlphabet } from '@/utils/sorting';
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  components: {
    ListItem,
    ButtonText,
  },
  data() {
    return {
      sortingOptions: null,
    };
  },
  computed: {
    ...mapState({
      currentListItems: 'currentListItems',
      isItemsOrderReversed: state => state.visualization.isItemsOrderReversed,
    }),
    ...mapGetters({
      currentListObj: 'currentListObj',
      filteredList: 'filteredList',
      edittingItemObj: 'edittingItemObj',
      sorting: 'sorting',
      mode: 'mode',
      shuffleTrigger: 'shuffleTrigger',
      listAlign: 'listAlign',
      areItemDetailsShown: 'areItemDetailsShown',
      isItemFormInSidebar: 'isItemFormInSidebar',
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
    finalList() {
      if (!this.sortingOptions) {
        return [];
      }

      return this.isItemsOrderReversed ? this.sortingOptions[this.sorting]().reverse() 
        : this.sortingOptions[this.sorting]();
    },
  },
  watch: {
    currentListItems(value) {
      if (value) {
        if (this.$route.query.tags || this.$route.query.categories) {
          this.filterList({ 
            tags: this.$route.query.tags 
              ? JSON.parse(this.$route.query.tags) : [],
            categories: this.$route.query.categories 
              ? JSON.parse(this.$route.query.categories) : [],
          });
        }
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$route.params.id) {
        vm._fetchListById({
          id: vm.$route.params.id,
          cancelToken: null,
        });
      }
    });
  },
  created() {
    this.setArrowHotkeys();

    this.sortingOptions = {
      custom: () => [...this.filteredList],
      shuffled: () => [...this.shuffledList],
      alphabetic: () => sortByAlphabet(this.filteredList, 'title'),
      dateCreated: () => sortByDate(this.filteredList, 'createdAt'),
      dateUpdated: () => sortByDate(this.filteredList, 'updatedAt'),
    };

    const queryOptions = {
      sorting: {
        callback: this.setSorting,
      },
      mode: {
        callback: this.setMode,
      },
      submode: {
        callback: this.setListAlign,
      },
      theme: {
        callback: this.setTheme,
      },
      search: {
        callback: this.setCurrentSearchValue,
      },
      'with-details': {
        callback: this.toggleItemDetailsShowingMode,
        withoutPayload: true,
      },
      'reverse-order': {
        callback: this.toggleItemsOrder,
        withoutPayload: true,
      },
      sidebar: {
        callback: sidebar => {
          this.openSidebar();
          this.changeSidebarMode(sidebar);
        },
      },
    };

    Object.keys(queryOptions).forEach(key => {
      if (Object.keys(this.$route.query).includes(key)) {
        queryOptions[key].callback(
          queryOptions[key].withoutPayload ? '' : this.$route.query[key],
        );
      }
    });
  },
  methods: {
    ...mapMutations([
      'setSorting',
      'setMode',
      'setListAlign',
      'setTheme',
      'setCurrentSearchValue',
      'toggleItemDetailsShowingMode',
      'toggleItemsOrder',
      'openSidebar',
      'changeSidebarMode',
      'filterList',
    ]),
    ...mapActions({
      _fetchListById: '_fetchListById',
      _setItemForEditting: '_setItemForEditting',
      _switchShuffleTrigger: '_switchShuffleTrigger',
      _closeSidebar: '_closeSidebar',
    }),
    setShuffledList() {
      this._setShuffledList(shuffleArray(this.filteredList));
    },
    setArrowHotkeys() {
      document.addEventListener('keyup', event => {
        if (!event.target.closest('input[type=text]') && !event.target.closest('textarea')) {
          if ((event.code === 'ArrowUp' || event.code === 'ArrowDown')
            && this.edittingItemObj
            && this.isItemFormInSidebar
            && !['cloud', 'stars'].includes(this.mode)) {
            const currentItemIndex = this.finalList
              .findIndex(item => item === this.edittingItemObj);

            if (event.code === 'ArrowUp' && this.finalList[currentItemIndex - 1]) {
              this._setItemForEditting(this.finalList[currentItemIndex - 1]);
            } else if (event.code === 'ArrowDown' && this.finalList[currentItemIndex + 1]) {
              this._setItemForEditting(this.finalList[currentItemIndex + 1]);
            }
          }
        }
      });
    },
  },
};
</script>

<template>
  <div
    class="main-list"
    :class="`${globalTheme}-theme`"
    @click="_closeSidebar"
  >
    <div
      class="header"
      :class="{ hidden: isFocusOnList }"
    >
      <div
        class="list-title"
        v-if="currentListObj"
      >
        {{ currentListObj.title }}
      </div>
      <div class="button-container">
        <ButtonText
          v-if="sorting === 'shuffled'"
          text="randomize!"
          style-type="underline"
          @click="_switchShuffleTrigger"
        />
      </div>
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
        <masonry-wall
          :items="finalList"
          :column-width="200"
          :gap="20"
        >
          <template #default="{ item }">
            <ListItem
              :key="item.id"
              :item="item"
            />
          </template>
        </masonry-wall>
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

<style lang="scss">
  .main-list {
    width: 100%;
    min-height: 100vh;

    .header {
      padding: 10px 10px 0;

      &.hidden {
        opacity: 0;
      }
    }

    .list-title {
      font-size: map-get($text, 'title-font-size');
      color: map-get($colors, 'gray-light');
    }

    .button-container {
      height: 30px;
      width: 100px;
    }

    .items-container {
      padding: 30px 50px 50px;
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

    &.inverted-theme {
      .list-title {
        color: map-get($colors, 'gray-dark');
      }
    }
  }
</style>
