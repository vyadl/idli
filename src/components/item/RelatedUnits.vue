<script>
import SelectCustom from '@/components/formElements/SelectCustom.vue';
import RadioCustom from '@/components/formElements/RadioCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import TogglingBlock from '@/components/wrappers/TogglingBlock.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';
import { 
  mapGetters,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  components: {
    SelectCustom,
    RadioCustom,
    ButtonText,
    ButtonSign,
    SectionCard,
    TogglingBlock,
    CustomLink,
  },
  LISTS_DEFAULT_OPTION: '- choose list -',
  ITEMS_DEFAULT_OPTION: '- choose item -',
  data() {
    return {
      relatedUnitMode: 'item',
      chosenListId: null,
      chosenItemId: null,
      itemsFromPossibleRelatedList: [],
    };
  },
  computed: {
    ...mapGetters('lists', [
      'lists',
      'isOwnerView',
    ]),
    ...mapGetters('items', [
      'edittingItemObj',
      'currentItemObj',
    ]),
    ...mapGetters('settings', [
      'isItemFormInSidebar',
    ]),
    isRelatedUnitModeAnItem() {
      return this.relatedUnitMode === 'item';
    },
    chosenItemIndex() {
      return this.itemsFromPossibleRelatedList
        .findIndex(item => item.id === this.chosenItemId);
    },
    chosenListIndex() {
      return this.lists
        .findIndex(list => list.id === this.chosenListId);
    },
    isAddRelatedButtonDisabled() {
      return this.isRelatedUnitModeAnItem
        ? !this.chosenItemId
        : !this.chosenListId;
    },
    choosableLists() {
      return this.lists
        .filter(list => this.isUnitChoosable(list, 'listId', 'relatedLists'));
    },
    choosableItems() {
      return this.itemsFromPossibleRelatedList
        .filter(item => this.isUnitChoosable(item, 'id', 'relatedItems'));
    },
    alreadyRelatedItemsInChosenList() {
      return this.currentItemObj?.relatedItems
        ?.filter(item => item.listId === this.chosenListId);
    },
    areTextFieldsEmpty() {
      return !this.edittingItemObj.title && !this.edittingItemObj.details;
    },
  },
  watch: {
    chosenListId(listId) {
      this.itemsFromPossibleRelatedList = [];

      if (!this.isRelatedUnitModeAnItem || !listId) {
        return false;
      }

      const listIndex = this.lists.findIndex(list => list.id === listId);
      const isListItemsAlreadyLoaded = this.lists[listIndex]?.items?.[0] instanceof Object;

      if (isListItemsAlreadyLoaded) {
        this.itemsFromPossibleRelatedList = this.lists[listIndex].items;
      } else {
        this._fetchItemsByListId({
          id: listId,
          cancelToken: null,
        })
          .then(responseList => {
            this.itemsFromPossibleRelatedList = responseList.items;
          });
      }
    },
  },
  methods: {
    ...mapMutations([
      'updateItemFieldLocally',
    ]),
    ...mapMutations('items', [
      'updateRelatedUnitsLocally',
    ]),
    ...mapActions('lists', [
      '_fetchItemsByListId',
    ]),
    ...mapActions('items', [
      '_saveItemOnServer',
      '_updateItemOnServer',
      '_addItemOnServer',
    ]),
    toggleShowingStatus(target) {
      this.showingStatuses[target] = !this.showingStatuses[target];
    },
    changeRelatedUnitMode(value) {
      this.relatedUnitMode = value;
      this.chosenListId = null;
      this.chosenItemId = null;
    },
    setNewRelatedUnitId(unitType, value) {
      unitType === 'list' 
        ? this.chosenListId = value 
        : this.chosenItemId = value;
    },
    isUnitChoosable(unit, unitIdFieldName, targetRelatedArr) {
      const isCurrentUnitList = !unit.listId;
      const isListChoosingOnlyToShowItems = this.isRelatedUnitModeAnItem && isCurrentUnitList;

      const isSavedOnServer = typeof unit.id !== 'undefined';
      const isItself = this.edittingItemObj[unitIdFieldName] === unit.id;
      const isAlreadyRelated = this.edittingItemObj[targetRelatedArr]?.includes(unit.id);

      const isChoosable = isSavedOnServer && !isItself && !isAlreadyRelated;

      return isListChoosingOnlyToShowItems ? isSavedOnServer : isChoosable;
    },
    updateItemField({ field, idsForServerUpdate, fullUnitsForLocalUpdate }) {  
      this.updateItemFieldLocally({ field, value: idsForServerUpdate });
      this.updateRelatedUnitsLocally({ field, value: fullUnitsForLocalUpdate });

      if (this.edittingItemObj.title || this.edittingItemObj.details) {
        this._saveItemOnServer();
      }
    },
    addRelatedItem() {
      this.updateItemField({
        field: 'relatedItems',
        idsForServerUpdate: [
          ...(this.edittingItemObj.relatedItems || []),
          this.chosenItemId,
        ],
        fullUnitsForLocalUpdate: [
          ...(this.currentItemObj.relatedItems || []),
          this.itemsFromPossibleRelatedList[this.chosenItemIndex],
        ],
      });

      this.chosenItemId = null;
    },
    addRelatedList() {
      this.updateItemField({
        field: 'relatedLists',
        idsForServerUpdate: [
          ...(this.edittingItemObj.relatedLists || []),
          this.chosenListId,
        ],
        fullUnitsForLocalUpdate: [
          ...(this.currentItemObj.relatedLists || []),
          this.lists[this.chosenListIndex],
        ],
      });

      this.chosenListId = null;
    },
    deleteRelatedItem(id) {
      const idsForServerUpdate = this.getFieldPropertyWithoutElementById({
        initialArray: this.edittingItemObj.relatedItems,
        unitIdToDelete: id,
      });
      const fullUnitsForLocalUpdate = this.getFieldPropertyWithoutElementById({
        initialArray: this.currentItemObj.relatedItems,
        unitIdToDelete: id,
      });

      this.updateItemField({
        field: 'relatedItems',
        idsForServerUpdate,
        fullUnitsForLocalUpdate,
      });
    },
    deleteRelatedList(id) {
      const idsForServerUpdate = this.getFieldPropertyWithoutElementById({
        initialArray: this.edittingItemObj.relatedLists,
        unitIdToDelete: id,
      });
      const fullUnitsForLocalUpdate = this.getFieldPropertyWithoutElementById({
        initialArray: this.currentItemObj.relatedLists,
        unitIdToDelete: id,
      });

      this.updateItemField({
        field: 'relatedLists',
        idsForServerUpdate,
        fullUnitsForLocalUpdate,
      });
    },
    getFieldPropertyWithoutElementById({ initialArray, unitIdToDelete }) {
      const copiedArray = [...initialArray];
      const indexToRemove = initialArray.findIndex(unit => {
        return unitIdToDelete === (initialArray[0] instanceof Object ? unit.id : unit);
      });

      copiedArray.splice(indexToRemove, 1);

      return copiedArray.length ? copiedArray : null;
    },
  },
};
</script>

<template>
  <div
    class="related-units"
    :class="`${globalTheme}-theme`"
  >
    <div class="already-related">
      <SectionCard
        v-if="currentItemObj?.relatedItems?.length"
        title="related items"
        size="small"
        text-style="caps"
        class="already-related-block"
      >
        <div 
          v-for="item in currentItemObj?.relatedItems"
          :key="item.id"
          class="related-unit-container"
        >
          <ButtonSign
            v-if="isOwnerView"
            class="delete-related-unit-button"
            style-type="cross"
            title="delete"
            @click="deleteRelatedItem(item.id)"
          />
          <CustomLink
            :to="{ name: 'item', params: { id: item.id || item } }"
            :title="item.title || 'untitled'"
            class="related-unit"
            :class="{ 'untitled-item': !item.title }"
            target="_blank"
          />
        </div>
      </SectionCard>
      <SectionCard
        v-if="currentItemObj?.relatedLists?.length"
        title="related lists"
        size="small"
        text-style="caps"
        class="already-related-block"
      >
        <div 
          v-for="list in currentItemObj?.relatedLists"
          :key="list.id"
          class="related-unit-container"
        >
          <ButtonSign
            v-if="isOwnerView"
            class="delete-related-unit-button"
            style-type="cross"
            title="delete"
            @click="deleteRelatedList(list.id)"
          />
          <CustomLink
            :to="{ name: 'list', params: { id: list.id || list } }"
            :title="list.title"
            class="related-unit"
            target="_blank"
          />
        </div>
      </SectionCard>
    </div>
    <TogglingBlock
      v-if="isOwnerView"
      title="add related list/item"
      :block-style="isItemFormInSidebar ? 'underline' : 'bordered'"
    >
      <div
        class="add-related-form"
        :class="{ compact: isItemFormInSidebar }"
      >
        <div class="new-related-unit-type">
          <RadioCustom 
            v-for="relatedUnitType in ['item', 'list']"
            :key="relatedUnitType"
            :label="relatedUnitType"
            :value="relatedUnitType"
            :model-value="relatedUnitMode"
            style-type="initial"
            small
            @update:model-value="value => changeRelatedUnitMode(value)"
          />
        </div>
        <div class="unit-adding-section">
          <div class="select-units">
            <SelectCustom 
              :default-option="$options.LISTS_DEFAULT_OPTION"
              :default-option-selected="!chosenListId"
              :disabled="areTextFieldsEmpty"
              :model-value="chosenListId"
              @update:model-value="value => setNewRelatedUnitId('list', value)"
            >
              <option
                v-for="list in choosableLists"
                :key="list.id"
                :value="list.id"
              >
                {{ list.title }}
              </option>
              <optgroup
                v-if="relatedUnitMode === 'list' && edittingItemObj.relatedLists?.length"
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
              v-if="isRelatedUnitModeAnItem"
              :default-option="$options.ITEMS_DEFAULT_OPTION"
              :default-option-selected="!chosenItemId"
              :disabled="!itemsFromPossibleRelatedList?.length"
              @update:model-value="value => setNewRelatedUnitId('item', value)"
            >
              <option
                v-for="item in choosableItems"
                :key="item.id"
                :class="{ 'untitled-item': !item.title }"
                :value="item.id"
              >
                {{ item.title || 'untitled' }}
              </option>
              <optgroup
                v-if="alreadyRelatedItemsInChosenList?.length"
                label="already related items:"
                disabled
              >
                <option
                  v-for="item in alreadyRelatedItemsInChosenList"
                  :key="item.id"
                >
                  {{ item.title }}
                </option>
              </optgroup>
            </SelectCustom>
          </div>  
          <div class="single-button-container">
            <ButtonText
              text="add"
              size="small"
              :disabled="isAddRelatedButtonDisabled"
              @click="isRelatedUnitModeAnItem ? addRelatedItem() : addRelatedList()"
            />
          </div>
        </div>
      </div>
    </TogglingBlock>
    <TogglingBlock
      v-if="currentItemObj?.referringItems?.length"
      title="referring items"
      :block-style="isItemFormInSidebar ? 'underline' : 'bordered'"
    >
      <div class="referring-units-container">
        <CustomLink
          v-for="item in currentItemObj?.referringItems"
          :key="item.id"
          :to="{ name: 'item', params: { id: item.id || item } }"
          :title="item.title || 'untitled'"
          class="referring-unit"
          :class="{ 'untitled-item': !item.title}"
          target="_blank"
        />
      </div>
    </TogglingBlock>
  </div>
</template>

<style lang="scss" scoped>
.related-units {
  display: flex;
  flex-direction: column;

  .already-related {
    padding-bottom: 15px;
  }

  .related-unit,
  .referring-unit {
    padding: 6px 10px 0 0;
    font-size: 13px;
    color: map-get($colors, 'gray-dark');
  }

  .related-unit-container {
    display: flex;
  }

  .delete-related-unit-button {
    transform: translateY(90%);
    padding: 0 3px 0 20px;
  }

  .referring-units-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
  }

  .single-button-container,
  .select-units {
    display: flex;
    justify-content: center;
  }

  .select-units {
    gap: 20px;
  }

  .add-related-form {
    display: flex;
    align-items: center;
  }

  .new-related-unit-type,
  .unit-adding-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .unit-adding-section {
    flex-grow: 1;
  }

  .untitled-item {
    color: map-get($colors, 'gray-light');
  }

  .compact {
    &.add-related-form {
      flex-direction: column;
    }

    .new-related-unit-type {
      flex-direction: row;
      padding-bottom: 20px;
    }

    .select-units {
      gap: 10px;
      padding-bottom: 10px;
    }
  }

  &.inverted-theme {
    .show-related-form-button {
      background-color: map-get($colors, 'black');
    }

    .related-unit,
    .referring-unit {
      color: map-get($colors, 'gray-light');
    }

    .untitled-item {
      color: map-get($colors, 'gray-dark');
    }
  }
}

@media #{breakpoints.$s-media} {
  .related-units {
    .referring-units-container {
      grid-template-columns: 1fr;
    }

    .add-related-form {
      flex-flow: column wrap;
    }

    .new-related-unit-type {
      flex-direction: row;
      padding-bottom: 20px;
    }

    .select-units {
      flex-wrap: wrap;
      gap: 10px;
      padding-bottom: 10px;
    }
  }
}
</style>
