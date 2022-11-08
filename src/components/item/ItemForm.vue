<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import TextareaCustom from '@/components/formElements/TextareaCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import TogglingBlock from '@/components/wrappers/TogglingBlock.vue';
import PopUp from '@/components/wrappers/PopUp.vue';
import RelatedUnits from '@/components/item/RelatedUnits.vue';
import ItemTags from '@/components/item/ItemTags.vue';
import ItemCategories from '@/components/item/ItemCategories.vue';
import { 
  mapGetters,
  mapActions,
  mapMutations,
  useStore,
} from 'vuex';
import { debounce } from 'throttle-debounce';
import axios from 'axios';
import { getFormattedDate } from '@/utils/misc';
import { generateTitleFromDetails } from '@/store/utils';

export default {
  components: {
    InputCustom,
    TextareaCustom,
    ButtonText,
    TogglingBlock,
    PopUp,
    RelatedUnits,
    ItemTags,
    ItemCategories,
  },
  emits: ['scrollSidebarToTop'],
  NEW_ITEM_PLACEHOLDER: 'New item...',
  UNTITLED_ITEM_PLACEHOLDER: 'untitled',
  RELATED_UNITS_HINT_TEXT: `Сonnect item with another item or list
    directly, not by grouping (like tags or category)`,
  setup() {
    const store = useStore();
    const API_REQUEST_DELAY = 1500;
    const serverRequests = {};

    const callActionDebounced = debounce(
      API_REQUEST_DELAY,
      (action, item) => {
        const itemActualId = item.id || item.temporaryId;
        const source = axios.CancelToken.source();

        if (serverRequests[itemActualId]) {
          serverRequests[itemActualId].cancel();
        }

        serverRequests[itemActualId] = source;

        store.dispatch(action, { item, cancelToken: source.token })
          .finally(() => {
            delete serverRequests[itemActualId];
          });
      },
    );

    const cancelActionDebounced = () => {
      callActionDebounced.cancel({ upcomingOnly: true });
    };

    return {
      callActionDebounced,
      cancelActionDebounced,
      serverRequests,
    };
  },
  data() {
    return {
      showingStatuses: {
        detailsTextarea: false,
        addons: false,
      },
    };
  },
  computed: {
    ...mapGetters([
      'currentListItems',
    ]),
    ...mapGetters('items', [
      'edittingItemIndex',
      'edittingItemObj',
      'currentItemTags',
    ]),
    ...mapGetters('settings', [
      'isItemFormInSidebar',
    ]),
    itemName() {
      return this.isUntitled
        ? ''
        : this.edittingItemObj.title;
    },
    isUntitled() {
      return !this.edittingItemObj.title;
    },
    titlePlaceholder() {
      let placeholder = '';

      if (this.edittingItemObj.temporaryId) {
        placeholder = this.$options.NEW_ITEM_PLACEHOLDER;
      } else if (this.isUntitled) {
        placeholder = this.$options.UNTITLED_ITEM_PLACEHOLDER;
      }  

      return placeholder;
    },
    isDetailsTextareaShown() {
      return !!this.edittingItemObj.details.length 
        || this.showingStatuses.detailsTextarea;
    },
    areAddonsShown() {
      return typeof this.edittingItemObj.category === 'number'
        || !!this.currentItemTags?.length
        || !!this.edittingItemObj.relatedItems?.length
        || !!this.edittingItemObj.relatedLists?.length
        || this.showingStatuses.addons;
    },
  },
  unmounted() {
    const { title, details } = this.edittingItemObj;

    if (!title && details) {
      this.updateItemFieldLocally({
        field: 'title',
        value: generateTitleFromDetails(details),
      });
    }

    this._chooseBetweenAddOrUpdateItemOnServer();

    this.currentListItems.forEach(item => {
      if (!item.title && !item.details) {
        if (item.temporaryId) {
          this.deleteItemByTemporaryId(item.temporaryId);
        } else {
          this._updateItemOnServer({
            item, 
            cancelToken: null,
          });
        }
      }
    });

    this.setEdittingItemIndex(null);
    this.setCurrentItemObj(null);
  },
  methods: {
    ...mapMutations([
      'updateItemFieldLocally',
      'deleteItemByTemporaryId',
    ]),
    ...mapMutations('items', [
      'setCurrentItemObj',
      'setEdittingItemIndex',
      'resetRelatedUnitsLocally',
    ]),
    ...mapActions('sidebar', [
      '_closeSidebar',
    ]),
    ...mapActions('lists', [
      '_fetchListById',
    ]),
    ...mapActions('items', [
      '_chooseBetweenAddOrUpdateItemOnServer',
      '_addItemOnServer',
      '_updateItemOnServer',
      '_deleteItemOnServer',
      '_fetchItemById',
    ]),
    closeItemModal() {
      this.$vfm.hide('itemModal');
    },
    updateItemField(field, value) {
      this.updateItemFieldLocally({ field, value });
        
      if (this.edittingItemObj.title || this.edittingItemObj.details) {
        this.callActionDebounced(
          this.edittingItemObj.id ? 'items/_updateItemOnServer' : 'items/_addItemOnServer',
          this.edittingItemObj,
        );
      }
    },
    removeItem(item) {
      const itemActualId = item.id || item.temporaryId;

      this.cancelActionDebounced();

      if (item.id) {
        this._deleteItemOnServer({ itemId: item.id, listId: item.listId });
      } else {
        this.deleteItemByTemporaryId(item.temporaryId);
      }

      if (this.serverRequests[itemActualId]) {
        this.serverRequests[itemActualId].cancel();
        delete this.serverRequests[itemActualId];
      }

      let newIndex = null;

      if (this.isItemFormInSidebar && item.temporaryId) {
        this._closeSidebar();
      } else if (this.isItemFormInSidebar) {
        this.$emit('scrollSidebarToTop');
        newIndex = this.currentListItems[this.edittingItemIndex] 
          ? this.edittingItemIndex 
          : this.currentListItems.length - 1;
      } else {
        this.closeItemModal();
      }

      this.resetRelatedUnitsLocally();
      this.setEdittingItemIndex(newIndex);

      if (this.isItemFormInSidebar) {
        this._fetchItemById({
          id: this.edittingItemObj.id,
          cancelToken: null,
        });
      }
    },
    disableCategory(id) {
      if (this.edittingItemObj.category === id) {
        this.updateItemField({ field: 'category', value: '' });
      }
    },
    toggleShowingStatus(target) {
      this.showingStatuses[target] = !this.showingStatuses[target];
    },
    getFormattedDate(value) {
      return getFormattedDate(value);
    },
  },
};
</script>

<template>
  <div
    v-if="edittingItemObj"
    class="item-form"
    :class="`${globalTheme}-theme`"
  >
    <!-- for future use
    <header 
      v-if="edittingItemObj.id"
      class="header"
    >
      <PopUp
        button-style-type="dots"
        stop-propagation
        position="lower-left"
        class="additional-options-button"
      >
        <ButtonText
          class="additional-option"
          text="move to another list"
          style-type="line"
          small
        />
        <ButtonText
          class="additional-option"
          text="move to bin 🗑"
          style-type="line"
          small
          @click="removeItem(edittingItemObj)"
        />
      </PopUp>
    </header> -->
    <div class="text-fields">
      <InputCustom
        class="title-input"
        :model-value="itemName"
        :placeholder="titlePlaceholder"
        :is-focus="!edittingItemObj.id"
        @update:model-value="value => updateItemField('title', value)"    
      />
      <TextareaCustom
        v-if="isDetailsTextareaShown"
        label="details"
        :model-value="edittingItemObj.details"
        @update:model-value="value => updateItemField('details', value)"
      />
      <ButtonText
        v-else
        text="add details"
        style-type="underline"
        big
        @click="toggleShowingStatus('detailsTextarea')"
      />
    </div>
    <div>
      <div
        v-if="areAddonsShown"
        class="extra-content"
      >
        <TogglingBlock 
          title="category"
          caps
          :bordered="!isItemFormInSidebar"
          :force-show="typeof edittingItemObj.category === 'number'"
        >
          <ItemCategories />
        </TogglingBlock>
        <TogglingBlock
          title="tags"
          caps
          :bordered="!isItemFormInSidebar"
          :force-show="!!edittingItemObj.tags.length"
        >
          <ItemTags />
        </TogglingBlock>
        <TogglingBlock
          title="related entities"
          caps
          :bordered="!isItemFormInSidebar"
          :hint-text="$options.RELATED_UNITS_HINT_TEXT"
          :force-show="!!edittingItemObj.relatedItems?.length
            || !!edittingItemObj.relatedLists?.length"
        >
          <RelatedUnits />
        </TogglingBlock>
      </div>
      <ButtonText
        v-else
        text="tags, categories, related items & lists"
        style-type="underline"
        big
        @click="toggleShowingStatus('addons')"
      />
    </div>
    <footer
      v-if="edittingItemObj?.id"
      class="footer"
    >
      <PopUp
        informational
        button-style-type="info"
        position="upper-right"
        stop-propagation
      >
        <div>
          created at: {{ getFormattedDate(edittingItemObj.createdAt) }}
        </div>
        <div>
          updated at: {{ getFormattedDate(edittingItemObj.updatedAt) }}
        </div>
      </PopUp>
      <ButtonText
        text="delete"
        style-type="underline"
        @click="removeItem(edittingItmeObj)"
      />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
  .item-form {
    // for future use
    // 
    // .header {
    //   position: relative;
    //   display: flex;
    //   justify-content: flex-end;
    //   align-items: flex-end;
    //   margin-bottom: 0;
    // }

    // .additional-options-button {
    //   position: absolute;
    //   right: -20px;
    // }

    // .additional-option {
    //   display: block;
    //   padding: 10px 15px;
    //   width: 100%;
    //   transition: background-color 0.3s;

    //   &:hover {
    //     background-color: map-get($colors, 'gray-very-light');
    //   }
    // }
    
    .title-input {
      padding-bottom: 10px;
    }
    .extra-content {
      padding-top: 15px;
    }

    .filters-container {
      display: flex;
      gap: 5px;
    }

    .single-button-container {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      padding-top: 25px;
    }

    &.inverted-theme {
      .additional-option {
        &:hover {
          background-color: map-get($colors, 'gray-dark');
        }
      }
    }
  }
</style>
