<script>
import DraggableList from '@/components/list/DraggableList.vue';
import DraggableSwitch from '@/components/functionElements/DraggableSwitch.vue';
import ListItem from '@/components/item/ListItem.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import PopupBox from '@/components/wrappers/PopupBox.vue';
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
    DraggableList,
    DraggableSwitch,
    ListItem,
    ButtonText,
    InfoMessage,
    PopupBox,
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
      'isDraggableMode',
      'searchResults',
    ]),
    ...mapGetters('auth', [
      'isLoggedIn',
    ]),
    ...mapGetters('lists', [
      'lists',
      'currentListObj',
      'isOwnerView',
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
    isAddUnitPossible() {
      return this.currentListObj 
        && !this.isFocusOnList 
        && this.isOwnerView;
    },
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
    isDraggableSwitchShown() {
      return this.sorting === 'custom'
        && this.mode === 'list'
        && this.isOwnerView;
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
      if (this.$route.params.id) {
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
      '_addNewItemPlaceholder',
    ]),
    ...mapActions('filters', [
      '_filterList',
    ]),
    ...mapActions('sidebar', [
      '_closeSidebar',
    ]),
    openListModal() {
      this.$vfm.show('listModal');
    },
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
  >
    <div v-if="currentListObj">
      <header
        class="header"
        :class="{ hidden: isFocusOnList }"
      >
        <div class="list-title">
          {{ currentListObj.title }}
        </div>
        <div class="buttons-container">
          <DraggableSwitch
            v-if="isDraggableSwitchShown"
            title="reorder"
            hint-position="lower-center"
            style-type="checkbox"
            size="small"
            stop-propagation
          />
          <ButtonText
            v-if="sorting === 'shuffled'"
            text="randomize!"
            style-type="underline"
            size="small"
            @click="toggleShuffleTrigger"
          />
          <PopupBox
            v-if="isAddUnitPossible"
            button-style-type="plus"
            stop-propagation
            content-type="functional"
          >
            <ButtonText
              text="new list"
              style-type="brick"
              size="small"
              @click="openListModal"
            />
            <ButtonText
              text="new item"
              style-type="brick"
              size="small"
              @click="_addNewItemPlaceholder"
            />
          </PopupBox>
        </div>
      </header>
      <div
        class="items-container"
        :class="[`${mode}-mode`]"
        :style="styles"
      >
        <template v-if="isDraggableMode">
          <DraggableList :style="styles" />
        </template>
        <template v-else>
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
        </template>
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
      position: fixed;
      z-index: 1;
      width: 100%;
      padding: 10px 10px 0;
      background-color: map-get($colors, 'white');

      &.hidden {
        opacity: 0;
      }
    }

    .list-title {
      font-size: map-get($text, 'big-title-font-size');
      color: map-get($colors, 'gray-light');
    }

    .buttons-container {
      display: grid;
      grid-template-rows: repeat(2, 20px);
      align-items: start;
      gap: 10px;
      padding-top: 10px;
    }

    .items-container {
      padding: 120px 50px 200px;

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
    }

    &.inverted-theme {
      .header {
        background-color: map-get($colors, 'black');
      }

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
