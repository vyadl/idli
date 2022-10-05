<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import TextareaCustom from '@/components/formElements/TextareaCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import SelectCustom from '@/components/formElements/SelectCustom.vue';
import RadioCustom from '@/components/formElements/RadioCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
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
    RadioCustom,
    ButtonText,
    ButtonSign,
  },
  emits: ['scrollSidebarToTop'],
  options: {
    NEW_ITEM_PLACEHOLDER: 'New item...',
    CATEGORIES_DEFAULT_OPTION: '- not chosen -',
    LISTS_DEFAULT_OPTION: '- choose list -',
    ITEMS_DEFAULT_OPTION: '- choose item -',
  },
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
        addRelatedForm: false,
        referringItems: false,
      },
      newRelatedUnitType: 'item',
      newRelatedListId: null,
      newRelatedItemId: null,
      itemsFromNewRelatedList: [],
    };
  },
  computed: {
    ...mapState([
      'edittingItemIndex',
      'currentListItems',
      'lists',
    ]),
    ...mapGetters([
      'currentListTags',
      'currentListCategories',
      'edittingItemObj',
      'isItemFormInSidebar',
      'isOwnerView',
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
    newRelatedItemIndex() {
      return this.itemsFromNewRelatedList
        .findIndex(item => item.id === this.newRelatedItemId);
    },
    newRelatedListIndex() {
      return this.lists
        .findIndex(list => list.id === this.newRelatedListId);
    },
    isAddButtonDisabled() {
      return this.newRelatedUnitType === 'item' 
        ? !this.newRelatedItemId || this.newRelatedItemId === this.$options.ITEMS_DEFAULT_OPTION
        : !this.newRelatedListId || this.newRelatedListId === this.$options.LISTS_DEFAULT_OPTION;
    },
    relatedItemsFromNewRelatedList() {
      return this.currentItemObj?.relatedItems
        ?.filter(item => item.listId === this.newRelatedListId);
    },
  },
  watch: {
    newRelatedListId(value) {
      this.itemsFromNewRelatedList = [];

      const listIndex = this.lists.findIndex(list => list.id === value);

      if (this.newRelatedUnitType === 'item' && this.lists[listIndex]?.items?.[0] instanceof Object) {
        this.itemsFromNewRelatedList = this.lists[listIndex].items;
      } else if (value && this.newRelatedUnitType === 'item') {
        this._fetchItemsByListId({
          id: value,
          cancelToken: null,
        })
          .then(responseList => {
            this.itemsFromNewRelatedList = responseList.items;
          });
      }
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
      'updateItemRelatedUnitsLocally',
      'setEdittingItemIndex',
      'setCurrentItemObj',
      'resetItemRelatedUnitsLocally',
    ]),
    ...mapActions([
      '_closeSidebar',
      '_addItemOnServer',
      '_updateItemOnServer',
      '_deleteItem',
      '_deleteItemByTemporaryId',
      '_fetchItemsByListId',
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

      this.resetItemRelatedUnitsLocally();
      this.setEdittingItemIndex(newIndex);
    },
    disableCategory(id) {
      if (this.edittingItemObj.category === id) {
        this.updateItemField({ field: 'category', value: '' });
      }
    },
    toggleShowingStatus(target) {
      this.showingStatuses[target] = !this.showingStatuses[target];
    },
    changeNewRelatedUnitType(value) {
      this.newRelatedUnitType = value;
      this.newRelatedListId = null;
      this.newRelatedItemId = null;
    },
    setNewRelatedUnitId(unitType, value) {
      unitType === 'list' 
        ? this.newRelatedListId = value 
        : this.newRelatedItemId = value;
    },
    isUnitChoosable(unit) {
      const isCheckingItem = !!unit.listId;
      const idField = isCheckingItem ? 'id' : 'listId';
      const targetUnitsArr = isCheckingItem ? 'relatedItems' : 'relatedLists';

      const isSaved = typeof unit.id !== 'undefined';
      const isItself = this.edittingItemObj[idField] === unit.id;
      const isAlreadyRelated = this.edittingItemObj[targetUnitsArr]?.indexOf(unit.id) !== -1;
      const areRelatedEmpty = !this.edittingItemObj[targetUnitsArr]?.length;

      let isChoosable = false;

      if (isCheckingItem) {
        isChoosable = isSaved
          && !isItself
          && (areRelatedEmpty || !isAlreadyRelated);
      } else {
        isChoosable = isSaved && (this.newRelatedUnitType === 'list'
          ? !isItself && (areRelatedEmpty || !isAlreadyRelated)
          : true);
      }

      return isChoosable;
    },
    addRelatedUnit() {
      const isAddingRelatedItem = this.newRelatedUnitType === 'item';

      const newId = isAddingRelatedItem ? this.newRelatedItemId : this.newRelatedListId;
      const sourceArray = isAddingRelatedItem ? this.itemsFromNewRelatedList : this.lists;
      const sourceIndex = isAddingRelatedItem ? this.newRelatedItemIndex : this.newRelatedListIndex;
      const field = isAddingRelatedItem ? 'relatedItems' : 'relatedLists';

      function getUpdatedArray(initialArray, format = 'strings') {
        const newUnit = format === 'objects' 
          ? sourceArray[sourceIndex] 
          : newId;

        return initialArray?.length
          ? [...initialArray, newUnit]
          : [newUnit];
      }

      this.updateItemField(
        field,
        getUpdatedArray(this.edittingItemObj[field]),
      );
      this.updateItemRelatedUnitsLocally({
        field,
        value: getUpdatedArray(this.currentItemObj[field], 'objects'),
      });

      this.newRelatedListId = null;
      this.newRelatedItemId = null;
    },
    deleteRelatedUnit(unitType, unitId) {
      const field = unitType === 'item' ? 'relatedItems' : 'relatedLists';

      function getUpdatedArray(initialArray) {
        const arrayCopy = [...initialArray];
        const indexToRemove = initialArray.findIndex(unit => {
          return unitId === (initialArray[0] instanceof Object ? unit.id : unit);
        });

        arrayCopy.splice(indexToRemove, 1);

        return arrayCopy.length ? arrayCopy : null;
      }

      this.updateItemField(
        field,
        getUpdatedArray(this.edittingItemObj[field]),
      );
      this.updateItemRelatedUnitsLocally({ 
        field, 
        value: getUpdatedArray(this.currentItemObj[field]),
      });
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
    <div class="related-units-section">
      <div v-if="currentItemObj?.relatedItems?.length">
        <h1>related items:</h1>
        <div 
          v-for="item in currentItemObj?.relatedItems"
          :key="item.id"
          class="related-units-container"
        >
          <ButtonSign
            class="delete-related-unit-button"
            style-type="cross"
            title="delete"
            @click="deleteRelatedUnit('item', item.id)"
          />
          <router-link
            :to="{ name: 'item', params: { id: item.id || item } }"
            class="related-unit"
            target="_blank"
          >
            {{ item.title }}
          </router-link>
        </div>
      </div>
      <div v-if="currentItemObj?.relatedLists?.length">
        <h1>related lists:</h1>
        <div 
          v-for="list in currentItemObj?.relatedLists"
          :key="list.id"
          class="related-units-container"
        >
          <ButtonSign
            class="delete-related-unit-button"
            style-type="cross"
            title="delete"
            @click="deleteRelatedUnit('list', list.id)"
          />
          <router-link
            :to="{ name: 'list', params: { id: list.id || list } }"
            class="related-unit"
            target="_blank"
          >
            {{ list.title }}
          </router-link>
        </div>
      </div>
      <div class="single-button-container">
        <ButtonText
          text="add related list or item"
          style-type="underline"
          @click="toggleShowingStatus('addRelatedForm')"
        />
      </div>
      <div 
        v-if="showingStatuses.addRelatedForm"
        class="add-related-form"
        :class="{ bordered: !isItemFormInSidebar}"
      >
        <div class="related-unit-type">
          <RadioCustom 
            v-for="relatedUnitType in ['list', 'item']"
            :key="relatedUnitType"
            :label="relatedUnitType"
            :value="relatedUnitType"
            :model-value="newRelatedUnitType"
            style-type="classic"
            small
            @update:model-value="value => changeNewRelatedUnitType(value)"
          />
        </div>
        <div class="unit-options">
          <SelectCustom 
            :default-option="$options.LISTS_DEFAULT_OPTION"
            :default-option-selected="!newRelatedListId"
            :disabled="areTextFieldsEmpty"
            :model-value="newRelatedListId"
            @update:model-value="value => setNewRelatedUnitId('list', value)"
          >
            <option
              v-for="list in lists"
              v-show="isUnitChoosable(list)"
              :key="list.id"
              :value="list.id"
            >
              {{ list.title }}
            </option>
            <optgroup
              v-if="newRelatedUnitType === 'list' && edittingItemObj.relatedLists?.length"
              label="already related lists:"
              disabled
            >
              <option
                v-for="list in currentItemObj?.relatedLists"
                :key="list.id"
              >
                {{ list.title }}
              </option>
            </optgroup>
          </SelectCustom>
          <SelectCustom
            v-show="newRelatedUnitType === 'item'"
            :default-option="$options.ITEMS_DEFAULT_OPTION"
            :default-option-selected="!newRelatedItemId"
            :disabled="!itemsFromNewRelatedList?.length"
            @update:model-value="value => setNewRelatedUnitId('item', value)"
          >
            <option
              v-for="item in itemsFromNewRelatedList"
              v-show="isUnitChoosable(item)"
              :key="item.id"
              :value="item.id"
            >
              {{ item.title }}
            </option>
            <optgroup
              v-if="relatedItemsFromNewRelatedList?.length"
              label="already related items:"
              disabled
            >
              <option
                v-for="item in relatedItemsFromNewRelatedList"
                :key="item.id"
              >
                {{ item.title }}
              </option>
            </optgroup>
          </SelectCustom>
        </div>
        <ButtonText
          text="add"
          small
          :disabled="isAddButtonDisabled"
          @click="addRelatedUnit"
        />
      </div>
      <div v-if="currentItemObj?.referringItems?.length">
        <div class="single-button-container">
          <ButtonText
            :text="showingStatuses.referringItems ? 'hide referring items' : 'show referring items'"
            style-type="underline"
            @click="toggleShowingStatus('referringItems')"
          />
        </div>
        <div v-if="showingStatuses.referringItems">
          <h1>
            referring items:
          </h1>
          <div class="referring-units-container">
            <router-link
              v-for="item in currentItemObj?.referringItems"
              :key="item.id"
              :to="{ name: 'item', params: { id: item.id || item } }"
              class="referring-unit"
              target="_blank"
            >
              {{ item.title }}
            </router-link> 
          </div>
        </div>
      </div>
    </div>
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
    
    .filters-section,
    .related-units-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding-bottom: 20px;
    }

    .filters-container,
    .related-unit-type {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .filters-title {
      padding: 5px 10px 6px 0;
    }

    .related-units-container {
      display: flex;
      align-items: center;
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

    .related-unit,
    .referring-unit {
      padding: 5px 10px 0 0;
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
    }

    .referring-units-container {
      display: flex;
      flex-wrap: wrap;
    }

    .delete-related-unit-button {
      transform: translateY(30%);
      padding-right: 20px;
    }

    .add-related-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
      &.bordered {
        padding: 20px;
        margin: 0 20px;
        border-radius: 5px;
        border: 1px solid map-get($colors, 'gray-light');
      }
    }

    .unit-options {
      display: flex;
      gap: 20px;
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
