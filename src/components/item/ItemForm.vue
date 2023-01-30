<script>
import TextareaCustom from '@/components/formElements/TextareaCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import TogglingBlock from '@/components/wrappers/TogglingBlock.vue';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import PopupBox from '@/components/wrappers/PopupBox.vue';
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
import { deleteFromQuery } from '@/router/utils';

export default {
  components: {
    TextareaCustom,
    ButtonText,
    ErrorMessage,
    TogglingBlock,
    SectionCard,
    PopupBox,
    RelatedUnits,
    ItemTags,
    ItemCategories,
  },
  emits: ['scrollSidebarToTop'],
  NEW_ITEM_PLACEHOLDER: 'New item...',
  UNTITLED_ITEM_PLACEHOLDER: 'untitled',
  RELATED_UNITS_HINT_TEXT: `Connect item with another item or list
    directly, not by grouping (like tags or category)`,
  GROUPING_FIELD_ERROR_MESSAGE: 'tags and categories should not have repeated titles',
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
      groupingFieldErrorMessage: '',
      showingStatuses: {
        detailsTextarea: false,
      },
    };
  },
  computed: {
    ...mapGetters([
      'currentListItems',
      'explicitRequestsNumber',
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
    if (!this.isItemFormInSidebar) {
      deleteFromQuery('item');
    }

    const isItemSaveNeeded = this.edittingItemObj?.tags
      && this.edittingItemObj.category
      && !this.explicitRequestsNumber;

    if (isItemSaveNeeded) {
      const { title, details } = this.edittingItemObj;

      if (!title && details) {
        this.updateItemFieldLocally({
          field: 'title',
          value: generateTitleFromDetails(details),
        });
      }

      this._saveItemOnServer(this.edittingItemObj);
    }

    this.currentListItems.forEach(item => {
      if (!item.title && !item.details) {
        if (item.temporaryId) {
          this.deleteItemByTemporaryId(item.temporaryId);
        }
      }
    });

    this.setCurrentItemObj(null);
    this.setEdittingItemIndex(null);
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
      '_setListIdFromLocalStorage',
    ]),
    ...mapActions('items', [
      '_saveItemOnServer',
      '_addItemOnServer',
      '_updateItemOnServer',
      '_deleteItemOnServer',
      '_fetchItemById',
    ]),
    ...mapActions('bin', [
      '_fetchDeletedItems',
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

      if (this.$route.name === 'item') {
        this._closeSidebar();
        this.$router.push({ name: 'list', params: { id: item.listId } });
      } else if (this.isItemFormInSidebar && item.temporaryId) {
        this._closeSidebar();
      } else if (this.isItemFormInSidebar) {
        this.setEdittingItemIndex(null);
      } else {
        this.closeItemModal();
      }

      this.resetRelatedUnitsLocally();
      this._fetchDeletedItems();
    },
    disableCategory(id) {
      if (this.edittingItemObj.category === id) {
        this.updateItemField({ field: 'category', value: '' });
      }
    },
    toggleShowingStatus(target) {
      this.showingStatuses[target] = !this.showingStatuses[target];
    },
    showErrorMessage() {
      this.groupingFieldErrorMessage = this.$options.GROUPING_FIELD_ERROR_MESSAGE;
    },
    clearErrorMessage() {
      this.groupingFieldErrorMessage = '';
    },
    openSingleItemInNewTab() {
      window.open(`${window.location.origin}/item/${this.edittingItemObj.id}`, '_blank');
    },
    copySingleItemLink() {
      navigator.clipboard.writeText(`${window.location.origin}/item/${this.edittingItemObj.id}`);
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
    <div class="menu-button-container">
      <PopupBox
        button-style-type="dots"
        stop-propagation
        position="left"
        content-type="functional"
      >
        <ButtonText
          text="copy item link"
          style-type="brick"
          size="small"
          @click="copySingleItemLink"
        />
        <ButtonText
          text="open item in new tab"
          style-type="brick"
          size="small"
          @click="openSingleItemInNewTab"
        />
      </PopupBox>
    </div>
    <div class="text-fields">
      <TextareaCustom
        class="title-input"
        label="title"
        :rows="3"
        :model-value="itemName"
        :placeholder="titlePlaceholder"
        :is-focus="!edittingItemObj.id"
        :disabled="!!explicitRequestsNumber"
        @update:model-value="value => updateItemField('title', value)"    
      />
      <TextareaCustom
        v-if="isDetailsTextareaShown"
        label="details"
        :rows="4"
        :model-value="edittingItemObj.details"
        :disabled="!!explicitRequestsNumber"
        @update:model-value="value => updateItemField('details', value)"
      />
      <ButtonText
        v-else
        text="add details"
        style-type="underline"
        size="big"
        @click="toggleShowingStatus('detailsTextarea')"
      />
    </div>
    <div>
      <TogglingBlock
        title="category, tags & related"
        :force-show="areAddonsShown"
      >
        <SectionCard
          title="category"
          position="left"
          text-style="caps"
          size="small"
        >
          <ItemCategories
            @throw-error="showErrorMessage"
            @clear-error="clearErrorMessage"
          />
        </SectionCard>
        <SectionCard
          title="tags"
          position="left"
          text-style="caps"
          size="small"
        >
          <ItemTags
            @throw-error="showErrorMessage"
            @clear-error="clearErrorMessage"
          />
        </SectionCard>
        <ErrorMessage
          v-if="groupingFieldErrorMessage"
          :message="groupingFieldErrorMessage"
        />
        <div class="related-hint-button-container">
          <PopupBox 
            button-style-type="hint"
            stop-propagation
            position="left"
          >
            {{ $options.RELATED_UNITS_HINT_TEXT }}
          </PopupBox>
        </div>
        <RelatedUnits />
      </TogglingBlock>
    </div>
    <footer
      v-if="edittingItemObj?.id"
      class="footer"
    >
      <PopupBox
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
      </PopupBox>
      <ButtonText
        text="delete"
        style-type="underline"
        @click="removeItem(edittingItemObj)"
      />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
  .item-form {
    .title-input {
      padding-bottom: 10px;
    }
    .extra-content {
      padding-top: 15px;
    }

    .related-hint-button-container,
    .menu-button-container {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      padding-top: 10px;
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
