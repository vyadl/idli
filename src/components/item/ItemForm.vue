<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import TextareaCustom from '@/components/formElements/TextareaCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import SelectCustom from '@/components/formElements/SelectCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import RelatedUnits from '@/components/item/RelatedUnits.vue';
import { 
  mapGetters,
  mapActions,
  mapState,
  mapMutations,
  useStore,
} from 'vuex';
import { debounce } from 'throttle-debounce';
import axios from 'axios';
import { getFormattedDate } from '@/utils/misc';

export default {
  components: {
    InputCustom,
    TextareaCustom,
    CheckboxCustom,
    SelectCustom,
    ButtonText,
    RelatedUnits,
  },
  emits: ['scrollSidebarToTop'],
  NEW_ITEM_PLACEHOLDER: 'New item...',
  CATEGORIES_DEFAULT_OPTION: '- not chosen -',
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
        editTagsForm: false,
      },
    };
  },
  computed: {
    ...mapState([
      'edittingItemIndex',
      'currentListItems',
    ]),
    ...mapGetters([
      'currentListTags',
      'currentListCategories',
      'edittingItemObj',
      'isItemFormInSidebar',
      'currentItemObj',
    ]),
    currentItemTags() {
      return this.currentListTags.filter(
        listTag => this.edittingItemObj.tags.includes(listTag.id),
      );
    },
    isAnyTagWithIdExist() {
      return this.currentListTags?.some(
        tag => tag.id,
      );
    },
    isAnyCategoryWithIdExist() {
      return this.currentListCategories?.some(
        category => category.id,
      );
    },
    areTextFieldsEmpty() {
      return !this.edittingItemObj.title && !this.edittingItemObj.details;
    },
  },
  mounted() {
    if (!this.edittingItemObj?.id) {
      this.$refs.itemTitle.focus();
    }
  },
  unmounted() {
    const emptyItemTitle = '[empty item]';

    this.currentListItems.forEach(item => {
      if (!item.title && !item.details) {
        item.temporaryId
          ? this._deleteItemByTemporaryId(item)
          : this._updateItemOnServer(
            {
              item: { ...item, title: emptyItemTitle }, 
              cancelToken: null,
            },
          );
      }
    });

    this.setEdittingItemIndex(null);
    this.setCurrentItemObj(null);
  },
  methods: {
    ...mapMutations([
      'updateItemFieldLocally',
      'setEdittingItemIndex',
      'setCurrentItemObj',
      'resetRelatedUnitsLocally',
    ]),
    ...mapActions([
      '_closeSidebar',
      '_addItemOnServer',
      '_updateItemOnServer',
      '_deleteItem',
      '_deleteItemByTemporaryId',
      '_fetchItemsByListId',
      '_fetchItemById',
    ]),
    closeItemModal() {
      this.$vfm.hide('itemModal');
    },
    updateItemField(field, value) {
      this.updateItemFieldLocally({ field, value });
        
      if (this.edittingItemObj.title || this.edittingItemObj.details) {
        this.callActionDebounced(
          this.edittingItemObj.id ? '_updateItemOnServer' : '_addItemOnServer',
          this.edittingItemObj,
        );
      }
    },
    removeItem(item) {
      const itemActualId = item.id || item.temporaryId;

      this.cancelActionDebounced();
      this[item.id ? '_deleteItem' : '_deleteItemByTemporaryId'](item);

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
      this._fetchItemById({
        id: this.edittingItemObj.id,
        cancelToken: null,
      });
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
  >
    <div class="text-fields">
      <InputCustom
        ref="itemTitle"
        label="item"
        :model-value="edittingItemObj.title"
        :placeholder="edittingItemObj.temporaryId ? $options.NEW_ITEM_PLACEHOLDER : ''"
        @update:model-value="value => updateItemField('title', value)"    
      />
      <TextareaCustom
        label="details"
        :model-value="edittingItemObj.details"
        @update:model-value="value => updateItemField('details', value)"
      />
    </div>
    <div class="filters-section">
      <div v-if="isAnyTagWithIdExist">
        <div 
          v-if="currentItemTags.length"
          class="filters-container"
        >
          <h1 class="filters-title">
            tags:
          </h1>
          <div class="tags-container">
            <div
              v-for="tag in currentItemTags"
              :key="tag.id"
              class="tag"
            >
              {{ tag.title }}
            </div>
          </div>
        </div>
        <div class="single-button-container">
          <ButtonText
            text="edit tags"
            style-type="underline"
            @click="toggleShowingStatus('editTagsForm')"
          />
        </div>
        <div 
          v-if="showingStatuses.editTagsForm"
          class="tags-container"
        >
          <CheckboxCustom
            v-for="tag in currentListTags"
            v-show="(typeof tag.id) !== 'undefined'"
            :key="tag.id"
            :label="tag.title"
            :value="tag.id"
            name="tags"
            :disabled="areTextFieldsEmpty"
            :model-value="edittingItemObj.tags"
            @update:model-value="value => updateItemField('tags', value)"
          />
        </div>
      </div>
      <div v-if="isAnyCategoryWithIdExist">
        <SelectCustom
          label="category:"
          :default-option="$options.CATEGORIES_DEFAULT_OPTION"
          :default-option-selected="!edittingItemObj.category"
          :custom-option-selected="edittingItemObj.category"
          :options="currentListCategories"
          :disabled="areTextFieldsEmpty"
          :model-value="edittingItemObj.category"
          @update:model-value="value => updateItemField('category', value)"
        />
      </div>
    </div>
    <RelatedUnits
      :are-text-fields-empty="areTextFieldsEmpty"
    />
    <div 
      v-if="edittingItemObj?.id"
      class="stats"
    >
      <div>
        created at: {{ getFormattedDate(edittingItemObj.createdAt) }}
      </div>
      <div>
        updated at: {{ getFormattedDate(edittingItemObj.updatedAt) }}
      </div>
    </div>
    <footer class="footer">
      <ButtonText
        :text="edittingItemObj.id ? 'delete item' : 'cancel'"
        style-type="underline"
        :small="isItemFormInSidebar"
        @click="removeItem(edittingItemObj)"
      />
    </footer>
  </div>
</template>

<style lang="scss">
  .item-form {
    .text-fields {
      margin-bottom: 25px;
    }
    
    .filters-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding-bottom: 20px;
    }

    .filters-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .filters-title {
      padding: 5px 10px 6px 0;
    }

    .single-button-container,
    .tags-container {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .tag {
      margin-bottom: 10px;
      margin-right: 7px;
      padding: 5px 10px;
      border: 2px solid map-get($colors, 'white');
      border-radius: 25px;
      background-color: map-get($colors, 'gray-light');
      color: map-get($colors, 'white');
    }

    .stats {
      padding: 20px 0;
      font-size: 12px;
      line-height: 1.7;
      color: map-get($colors, 'gray-light');
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
    }
  }
</style>
