<script>
import DraggableList from '@/components/list/DraggableList.vue';
import DraggableSwitch from '@/components/functionElements/DraggableSwitch.vue';
import ListItem from '@/components/item/ListItem.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
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
    DraggableList,
    DraggableSwitch,
    ListItem,
    ButtonText,
    ButtonSign,
    InfoMessage,
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const loadItem = item => {
        vm._fetchItemById({ id: item, cancelToken: null })
          .then(() => {            
            if (to.query.item) {
              vm.isItemFormInSidebar
                ? vm._openSidebar('item')
                : vm.$vfm.show('itemModal');
            } else {
              vm.$vfm.hide('itemModal');
            }

            if (to.query.sidebar === 'item' && !vm.isItemFormInSidebar) {
              vm._closeSidebar();
            }
          });
      };

      const queryOptions = {
        tags: {
          callback: vm.setTags,
        },
        categories: {
          callback: vm.setCategories,
        },
        sorting: {
          callback: vm.setSorting,
        },
        mode: {
          callback: vm.setMode,
        },
        submode: {
          callback: vm.setListAlign,
        },
        search: {
          callback: vm.setCurrentSearchValue,
        },
        'with-details': {
          callback: vm.toggleItemDetailsShowingMode,
          withoutPayload: true,
        },
        'reverse-order': {
          callback: vm.toggleItemsOrder,
          withoutPayload: true,
        },
        view: {
          callback: vm.setCurrentListView,
        },
        item: {
          callback: loadItem,
        },
      };

      if (to.params.id) {
        vm._fetchListById({ id: to.params.id, cancelToken: null })
          .then(() => {
            handleQueryOnLoad(queryOptions, to.query);
          })
          .catch((error) => {
            console.log(error);
            vm._closeSidebar();
          });
      }
    });
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
      'currentItemObj',
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
    isDraggableSwitchShown() {
      return this.sorting === 'custom'
        && this.mode === 'list'
        && this.isOwnerView;
    },
    isAddItemButtonShown() {
      return !['stars', 'cloud'].includes(this.mode)
        && this.finalList?.length
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
      'setCurrentItemObj',
    ]),
    ...mapMutations('lists', [
      'setCurrentListView',
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
      '_openSidebar',
      '_closeSidebar',
    ]),
    fetchItemById(id) {
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
            && this.currentItemObj
            && this.isItemFormInSidebar
            && !['cloud', 'stars'].includes(this.mode)) {
            const currentItemIndex = this.finalList
              .findIndex(item => item.id === this.currentItemObj.id);

            if (event.code === 'ArrowUp' && this.finalList[currentItemIndex - 1]) {
              const newItemObj = this.currentListObj.items
                .find(item => item === this.finalList[currentItemIndex - 1]);

              this.setCurrentItemObj(newItemObj);
            } else if (event.code === 'ArrowDown' && this.finalList[currentItemIndex + 1]) {
              const newItemObj = this.currentListObj.items
                .find(item => item === this.finalList[currentItemIndex + 1]);

              this.setCurrentItemObj(newItemObj);
            }

            this.fetchItemById(this.currentItemObj.id);
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
                <div class="single-item-container">
                  <ListItem
                    :key="item?.id"
                    :item="item"
                    @click="fetchItemById"
                  />
                </div>
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
        <div
          v-if="isAddItemButtonShown"
          class="add-item-button"
          title="add new item"
        >
          <ButtonSign
            style-type="plus"
            stop-propagation
            @click="_addNewItemPlaceholder"
          />
        </div>
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

      &.hidden {
        opacity: 0;
      }
    }

    .list-title {
      padding: 10px 10px 0;
      background-color: map-get($colors, 'white');
      font-size: map-get($text, 'big-title-font-size');
      color: map-get($colors, 'gray-light');
    }

    .buttons-container {
      display: grid;
      grid-template-rows: repeat(2, 20px);
      align-items: start;
      gap: 10px;
      padding: 10px 10px 0;
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

      &.cards-mode {
        .add-item-button {
          width: 40px;
          margin-top: 20px;
          padding: 5px;
          border: 2px solid map-get($colors, 'black');
          border-radius: 3px;
          cursor: pointer;
        }
      }
    }

    .single-item-container {
      width: 200px;
      overflow-wrap: anywhere;
    }

    &.inverted-theme {
      .list-title {
        background-color: map-get($colors, 'black');
        color: map-get($colors, 'gray-dark');
      }
    }

    .message {
      padding-top: 50px;
      text-align: center;
    }
  }
</style>
