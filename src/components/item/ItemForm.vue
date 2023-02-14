<script>
import TextareaCustom from '@/components/formElements/TextareaCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import TogglingBlock from '@/components/wrappers/TogglingBlock.vue';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import PopupBox from '@/components/wrappers/PopupBox.vue';
import ItemActionsMenu from '@/components/item/ItemActionsMenu.vue';
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
    ItemActionsMenu,
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
      'currentItemTags',
      'currentItemObj',
      'isItemSavingAllowed',
    ]),
    ...mapGetters('settings', [
      'isItemFormInSidebar',
    ]),
    itemName() {
      return this.isUntitled
        ? ''
        : this.currentItemObj.title;
    },
    isUntitled() {
      return !this.currentItemObj.title;
    },
    titlePlaceholder() {
      let placeholder = '';

      if (this.currentItemObj.temporaryId) {
        placeholder = this.$options.NEW_ITEM_PLACEHOLDER;
      } else if (this.isUntitled) {
        placeholder = this.$options.UNTITLED_ITEM_PLACEHOLDER;
      }

      return placeholder;
    },
    isDetailsTextareaShown() {
      return !!this.currentItemObj.details.length 
        || this.showingStatuses.detailsTextarea;
    },
    areAddonsShown() {
      return typeof this.currentItemObj.category === 'number'
        || !!this.currentItemTags?.length
        || !!this.currentItemObj.relatedItems?.length
        || !!this.currentItemObj.relatedLists?.length
        || this.showingStatuses.addons;
    },
  },
  unmounted() {
    if (!this.isItemFormInSidebar) {
      deleteFromQuery('item');
    }

    const isItemSaveNeeded = this.currentItemObj?.tags
      && this.currentItemObj.category
      && !this.explicitRequestsNumber;

    if (isItemSaveNeeded) {
      const { title, details } = this.currentItemObj;

      if (!title && details) {
        this.updateItemFieldLocally({
          field: 'title',
          value: generateTitleFromDetails(details),
        });
      }

      this.saveItemIfAllowed();
    }

    this.currentListItems.forEach(item => {
      if (!item.title && !item.details) {
        if (item.temporaryId) {
          this.deleteItemByTemporaryId(item.temporaryId);
        }
      }
    });

    this.setCurrentItemObj(null);
  },
  methods: {
    ...mapMutations([
      'deleteItemByTemporaryId',
    ]),
    ...mapMutations('items', [
      'updateItemFieldLocally',
    ]),
    ...mapMutations('items', [
      'setCurrentItemObj',
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
    ]),
    ...mapActions('bin', [
      '_fetchDeletedItems',
    ]),
    closeItemModal() {
      this.$vfm.hide('itemModal');
    },
    saveItemIfAllowed() {
      if (this.isItemSavingAllowed) {
        this._saveItemOnServer(this.currentItemObj);
      }
    },
    updateItemField(field, value) {
      this.updateItemFieldLocally({ field, value });

      if (this.isItemSavingAllowed) {
        if (this.currentItemObj.title || this.currentItemObj.details) {
          this.callActionDebounced(
            this.currentItemObj.id ? 'items/_updateItemOnServer' : 'items/_addItemOnServer',
            this.currentItemObj,
          );
        }
      } else {
        this.callActionDebounced(this.$vfm.show('itemConflictModal'));
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
        this.setCurrentItemObj(null);
        deleteFromQuery('item');
      } else {
        this.closeItemModal();
      }

      this._fetchDeletedItems();
    },
    disableCategory(id) {
      if (this.currentItemObj.category === id) {
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
    getFormattedDate(value) {
      return getFormattedDate(value);
    },
  },
};
</script>

<template>
  <div
    v-if="currentItemObj"
    class="item-form"
    :class="`${globalTheme}-theme`"
  >
    <ItemActionsMenu />
    <div class="text-fields">
      <TextareaCustom
        class="title-input"
        label="title"
        :rows="3"
        :model-value="itemName"
        :placeholder="titlePlaceholder"
        :is-focus="!currentItemObj.id"
        @update:model-value="value => updateItemField('title', value)"    
      />
      <TextareaCustom
        v-if="isDetailsTextareaShown"
        label="details"
        :rows="4"
        :model-value="currentItemObj.details"
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
            @save-item="saveItemIfAllowed"
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
            @save-item="saveItemIfAllowed"
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
        <RelatedUnits
          :item-to-show="currentItemObj"
          @save-item="saveItemIfAllowed"
        />
      </TogglingBlock>
    </div>
    <footer
      v-if="currentItemObj?.id"
      class="footer"
    >
      <PopupBox
        button-style-type="info"
        position="upper-right"
        stop-propagation
      >
        <div>
          created at: {{ getFormattedDate(currentItemObj.createdAt) }}
        </div>
        <div>
          updated at: {{ getFormattedDate(currentItemObj.updatedAt) }}
        </div>
      </PopupBox>
      <ButtonText
        text="delete"
        style-type="underline"
        @click="removeItem(currentItemObj)"
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

    .related-hint-button-container {
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
