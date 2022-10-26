<script>
import SelectCustom from '@/components/formElements/SelectCustom.vue';
import RadioCustom from '@/components/formElements/RadioCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import SectionCard from '@/components/wrappers/SectionCard.vue';
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
  },
  props: {
    areTextFieldsEmpty: Boolean,
  },
  LISTS_DEFAULT_OPTION: '- choose list -',
  ITEMS_DEFAULT_OPTION: '- choose item -',
  data() {
    return {
      showingStatuses: {
        addRelatedForm: false,
        referringItems: false,
      },
      relatedUnitMode: 'item',
      chosenListId: null,
      chosenItemId: null,
      itemsFromPossibleRelatedList: [],
    };
  },
  computed: {
    ...mapGetters('lists', [
      'lists',
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
        this[this.edittingItemObj.id 
          ? '_updateItemOnServer' 
          : '_addItemOnServer']({ 
          item: this.edittingItemObj, 
          cancelToken: null,
        });
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
  <div class="related-units">
    <SectionCard
      v-if="currentItemObj?.relatedItems?.length"
      title="related items:"
      small
    >
      <div 
        v-for="item in currentItemObj?.relatedItems"
        :key="item.id"
        class="related-unit-container"
      >
        <ButtonSign
          class="delete-related-unit-button"
          style-type="cross"
          title="delete"
          @click="deleteRelatedItem(item.id)"
        />
        <router-link
          :to="{ name: 'item', params: { id: item.id || item } }"
          class="related-unit"
          target="_blank"
        >
          {{ item.title }}
        </router-link>
      </div>
    </SectionCard>
    <SectionCard
      v-if="currentItemObj?.relatedLists?.length"
      title="related lists:"
      small
    >
      <div 
        v-for="list in currentItemObj?.relatedLists"
        :key="list.id"
        class="related-unit-container"
      >
        <ButtonSign
          class="delete-related-unit-button"
          style-type="cross"
          title="delete"
          @click="deleteRelatedList(list.id)"
        />
        <router-link
          :to="{ name: 'list', params: { id: list.id || list } }"
          class="related-unit"
          target="_blank"
        >
          {{ list.title }}
        </router-link>
      </div>
    </SectionCard>
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
          :model-value="relatedUnitMode"
          style-type="initial"
          small
          @update:model-value="value => changeRelatedUnitMode(value)"
        />
      </div>
      <div class="unit-options">
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
            :value="item.id"
          >
            {{ item.title }}
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
      <ButtonText
        text="add"
        small
        :disabled="isAddRelatedButtonDisabled"
        @click="isRelatedUnitModeAnItem ? addRelatedItem() : addRelatedList()"
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
      <SectionCard
        v-if="showingStatuses.referringItems"
        title="referring items:"
        small
      >
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
      </SectionCard>
    </div>
  </div>
</template>

<style lang="scss">
.related-units {
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;

  .related-unit,
  .referring-unit {
    padding: 5px 10px 0 0;
    font-size: 13px;
    color: map-get($colors, 'gray-dark');
  }

  .related-unit-type {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .related-unit-container {
    display: flex;
  }

  .delete-related-unit-button {
    transform: translateY(60%);
    padding-right: 20px;
  }

  .referring-units-container {
    display: flex;
    flex-wrap: wrap;
  }

  .single-button-container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
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
}
</style>
