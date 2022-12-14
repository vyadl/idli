<script>
import ListItem from '@/components/item/ListItem.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import { shuffleArray } from '@/utils/misc';
import { sortByDate, sortByAlphabet } from '@/utils/sorting';
// eslint-disable-next-line import/no-cycle
import { handleQueryOnLoad } from '@/router/utils';
import {
  mapGetters,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  components: {
    ListItem,
    ButtonText,
    InfoMessage,
  },
  data() {
    return {
      sortingOptions: null,
      shuffledList: null,
      finalList: null,
      serverRequests: [],
    };
  },
  computed: {
    ...mapGetters([
      'currentListItems',
    ]),
    ...mapGetters('auth', [
      'isLoggedIn',
    ]),
    ...mapGetters('lists', [
      'lists',
      'currentListObj',
    ]),
    ...mapGetters('items', [
      'edittingItemObj',
    ]),
    ...mapGetters('filters', [
      'allFilters',
      'filteredList',
    ]),
    ...mapGetters('visualization', [
      'visualization',
      'sorting',
      'mode',
      'shuffleTrigger',
      'listAlign',
      'isItemsOrderReversed',
    ]),
    ...mapGetters('settings', [
      'isItemFormInSidebar',
      'isFocusOnList',
      'isListUnderSidebar',
    ]),
    ...mapGetters('sidebar', [
      'isSidebarOpen',
      'sidebarMode',
    ]),
    styles() {
      let styles = {};

      if (this.mode === 'list') {
        const alignStyles = {
          textAlign: {
            left: 'left',
            center: 'center',
            right: 'right',
            random: null,
          },
          alignItems: {
            left: 'flex-start',
            center: 'center',
            right: 'flex-end',
            random: null,
          },
        };

        styles = { 
          'text-align': alignStyles.textAlign[this.listAlign], 
          'align-items': alignStyles.alignItems[this.listAlign],
        };
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
  },
  watch: {
    shuffleTrigger() {
      this.shuffledList = shuffleArray(this.finalList);
    },
    currentListItems: {
      handler(items) {
        this.shuffledList = null;
        this._filterList(items);

        if (items.length) {
          this.finalList = items;
        } else {
          this.finalList = [];
        }
      },
      deep: true,
    },
    allFilters: {
      handler() {
        if (this.sorting === 'shuffled' && this.currentListItems.length) {
          this._filterList(this.shuffledList || this.currentListItems);
          this.finalList = this.filteredList;
        } else {
          this._filterList(this.currentListItems);
          this.finalList = this.isItemsOrderReversed 
            ? this.sortingOptions[this.sorting]().reverse() 
            : this.sortingOptions[this.sorting]();
        }
      },
      deep: true,
    },
    visualization: {
      handler() {        
        if (!this.sortingOptions) {
          this.finalList = [];
        }
        
        this.finalList = this.isItemsOrderReversed 
          ? this.sortingOptions[this.sorting]().reverse() 
          : this.sortingOptions[this.sorting]();
      },
      deep: true,
    },
  },
  async created() {
    this.setArrowHotkeys();

    this.sortingOptions = {
      custom: () => [...this.filteredList],
      shuffled: () => this.getShuffledList(this.filteredList),
      alphabetic: () => sortByAlphabet(this.filteredList, 'title'),
      dateCreated: () => sortByDate(this.filteredList, 'createdAt'),
      dateUpdated: () => sortByDate(this.filteredList, 'updatedAt'),
    };

    const queryOptions = {
      tags: {
        callback: this.setTags,
      },
      categories: {
        callback: this.setCategories,
      },
      sorting: {
        callback: this.setSorting,
      },
      mode: {
        callback: this.setMode,
      },
      submode: {
        callback: this.setListAlign,
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
    };

    try {
      if (this.isLoggedIn) {
        this._fetchListsForUser()
          .then(() => {
            if (this.$route.params.id) {
              this._fetchListById({ id: this.$route.params.id, cancelToken: null });
            }
          });
      } else if (this.$route.params.id) {
        await this._fetchListById({ id: this.$route.params.id, cancelToken: null });
      }

      handleQueryOnLoad(queryOptions, this.$route.query);
    } catch (error) {
      console.log(error);
      this._closeSidebar();
    }
  },
  methods: {
    ...mapMutations('filters', [
      'setTags',
      'setCategories',
      'setCurrentSearchValue',
    ]),
    ...mapMutations('visualization', [
      'setSorting',
      'setMode',
      'setListAlign',
      'toggleShuffleTrigger',
      'toggleItemDetailsShowingMode',
      'toggleItemsOrder',
    ]),
    ...mapMutations('items', [
      'setEdittingItemIndex',
      'resetRelatedUnitsLocally',
    ]),
    ...mapActions([
      '_setUnitsFromLocalStorage',
    ]),
    ...mapActions('lists', [
      '_fetchListsForUser',
      '_fetchListById',
    ]),
    ...mapActions('items', [
      '_fetchItemById',
    ]),
    ...mapActions('filters', [
      '_filterList',
    ]),
    ...mapActions('sidebar', [
      '_closeSidebar',
    ]),
    fetchItemById(id) {
      this.resetRelatedUnitsLocally();

      if (this.serverRequests.length) {
        this.serverRequests.forEach(request => {
          request.cancel();
        });
      }

      const source = this.$config.axios.CancelToken.source();

      this.serverRequests.push(source);
      this._fetchItemById({
        id,
        cancelToken: source.token,
      })
        .finally(() => {
          const index = this.serverRequests.findIndex(request => request === source);

          this.serverRequests.splice(index, 1);
        });
    },
    getShuffledList(list) {
      if (!this.shuffledList) {
        this.shuffledList = shuffleArray(list);
      }

      return this.shuffledList;
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
              const newIndex = this.currentListObj.items
                .findIndex(item => item === this.finalList[currentItemIndex - 1]);

              this.setEdittingItemIndex(newIndex);
            } else if (event.code === 'ArrowDown' && this.finalList[currentItemIndex + 1]) {
              const newIndex = this.currentListObj.items
                .findIndex(item => item === this.finalList[currentItemIndex + 1]);

              this.setEdittingItemIndex(newIndex);
            }

            this.fetchItemById(this.edittingItemObj.id);
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
    <div v-if="currentListObj">
      <header
        class="header"
        :class="{ hidden: isFocusOnList }"
      >
        <div class="list-title">
          {{ currentListObj.title }}
        </div>
        <div class="button-container">
          <ButtonText
            v-if="sorting === 'shuffled'"
            text="randomize!"
            style-type="underline"
            @click="toggleShuffleTrigger"
          />
        </div>
      </header>
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
                :key="item?.id"
                :item="item"
                @click="fetchItemById"
              />
            </template>
          </masonry-wall>
        </template>
        <template v-else>
          <ListItem
            v-for="item in finalList"
            :key="item.id"
            :item="item"
            @click="fetchItemById"
          />
        </template>
        <!-- <template v-else>
          <DraggableList>
            <ListItem />
          </DraggableList>
        </template> -->
      </div>
    </div>
    <div
      v-else
      class="message"
    >
      <InfoMessage
        message="no list is chosen"
        big
      />
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
      font-size: map-get($text, 'big-title-font-size');
      color: map-get($colors, 'gray-light');
    }

    .button-container {
      height: 30px;
      width: 100px;
    }

    .items-container {
      padding: 30px 50px 50px;
      transition:
        margin 0.5s,
        transform 0.5s;

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

    .message {
      padding-top: 50px;
      text-align: center;
    }
  }
</style>
