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
import {
  ITEM_TITLE_MAX_LENGTH,
  ITEM_DETAILS_MAX_LENGTH,
  GROUPING_FIELD_ERROR_MESSAGE,
} from '@/store/config';
import { deleteFromQuery } from '@/router/utils';
import routerQueue from '@/router/routerQueue';

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
  props: {
    isSidebarBreakpointReached: Boolean,
  },
  ITEM_TITLE_MAX_LENGTH,
  ITEM_DETAILS_MAX_LENGTH,
  NEW_ITEM_PLACEHOLDER: 'New item...',
  UNTITLED_ITEM_PLACEHOLDER: 'untitled',
  RELATED_UNITS_HINT_TEXT: `Connect item with another item or list
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
            store.commit('items/decreaseBackgroundRequestsNumber', false);
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
      blurTrigger: false,
      focusTrigger: false,
    };
  },
  computed: {
    ...mapGetters([
      'currentListItems',
      'explicitRequestsNumber',
    ]),
    ...mapGetters('cache', [
      'itemsCache',
    ]),
    ...mapGetters('items', [
      'currentItemTags',
      'currentItemObj',
      'responseItemObj',
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
  watch: {
    'currentItemObj.id': {
      handler() {
        if (!this.currentItemObj.title) {
          this.focusTrigger = !this.focusTrigger;
        }
      },
    },
  },
  unmounted() {
    if (!this.isItemFormInSidebar) {
      routerQueue.add({
        method: deleteFromQuery,
        args: 'item',
      });
    }

    const { id, updatedAt } = this.currentItemObj;
    const isItemChanged = this.itemsCache[id]?.updatedAt !== updatedAt;

    if (isItemChanged) {
      const { title, details } = this.currentItemObj;

      if (!title && details) {
        const generatedTitleObj = {
          field: 'title',
          value: generateTitleFromDetails(details),
          itemId: this.currentItemObj.id || this.currentItemObj.temporaryId,
        };

        this.updateItemFieldLocally(generatedTitleObj);
        this.updateItemFieldInCurrentList(generatedTitleObj);
      }

      this.callActionDebounced(
        this.currentItemObj.id ? 'items/_updateItemOnServer' : 'items/_addItemOnServer',
        this.currentItemObj,
      );
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
      'updateItemFieldInCurrentList',
    ]),
    ...mapMutations('items', [
      'updateItemFieldLocally',
      'setCurrentItemObj',
      'increaseBackgroundRequestsNumber',
    ]),
    ...mapActions('sidebar', [
      '_closeSidebar',
    ]),
    ...mapActions('lists', [
      '_fetchListById',
      '_setListIdFromLocalStorage',
    ]),
    ...mapActions('items', [
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
    updateItemField(field, value) {
      this.updateItemFieldLocally({ field, value });
      this.updateItemFieldInCurrentList({
        field,
        value,
        itemId: this.currentItemObj.id || this.currentItemObj.temporaryId,
      });

      this.updateItemFieldLocally({
        field: 'updatedAt',
        value: new Date().toISOString(),
      });

      if (this.responseItemObj) {
        this.blurTrigger = !this.blurTrigger;
        this.$vfm.show('itemConflictModal');

        return null;
      }

      if (this.currentItemObj.title || this.currentItemObj.details) {
        this.increaseBackgroundRequestsNumber();

        this.callActionDebounced(
          this.currentItemObj.id ? 'items/_updateItemOnServer' : 'items/_addItemOnServer',
          this.currentItemObj,
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
        this.setCurrentItemObj(null);
        routerQueue.add({
          method: deleteFromQuery,
          args: 'item',
        });
      } else {
        this.closeItemModal();
      }

      this._fetchDeletedItems();
    },
    toggleShowingStatus(target) {
      this.showingStatuses[target] = !this.showingStatuses[target];
    },
    showErrorMessage() {
      this.groupingFieldErrorMessage = GROUPING_FIELD_ERROR_MESSAGE;
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
        :max-length="$options.ITEM_TITLE_MAX_LENGTH"
        :model-value="itemName"
        :placeholder="titlePlaceholder"
        :is-focus="!currentItemObj.title"
        :focus-trigger="focusTrigger"
        :blur-trigger="blurTrigger"
        @update:model-value="value => updateItemField('title', value)"    
      />
      <TextareaCustom
        v-if="isDetailsTextareaShown"
        label="details"
        :rows="4"
        :max-length="$options.ITEM_DETAILS_MAX_LENGTH"
        :model-value="currentItemObj.details"
        :blur-trigger="blurTrigger"
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
        <div
          class="grouping-fields"
          :class="{ 'two-columns': isSidebarBreakpointReached }"
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
              @save-item="updateItemField"
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
              @save-item="updateItemField"
            />
          </SectionCard>
        </div>
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
          @save-item="updateItemField"
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

    .grouping-fields {
      display: flex;
      flex-direction: column;

      &.two-columns {
        flex-direction: row;
        gap: 20px;
      }
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
