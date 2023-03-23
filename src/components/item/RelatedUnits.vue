<script>
import SelectCustom from '@/components/formElements/SelectCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import TogglingBlock from '@/components/wrappers/TogglingBlock.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SelectCustom,
    ButtonText,
    ButtonSign,
    SectionCard,
    TogglingBlock,
  },
  LISTS_DEFAULT_OPTION: '- choose list -',
  ITEMS_DEFAULT_OPTION: '- choose item -',
  props: {
    itemToShow: Object,
    editable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['save-item'],
  data() {
    return {
      relatedUnitMode: '',
      chosenListId: null,
      chosenItemId: null,
      itemsFromPossibleRelatedList: [],
    };
  },
  computed: {
    ...mapGetters('items', [
      'responseItemObj',
    ]),
    ...mapGetters('lists', [
      'lists',
      'isOwnerView',
    ]),
    ...mapGetters('settings', [
      'isItemFormInSidebar',
    ]),
    areRelatedItemsLoaded() {
      return this.itemToShow?.relatedItems?.[0] instanceof Object;
    },
    areRelatedListsLoaded() {
      return this.itemToShow?.relatedLists?.[0] instanceof Object;
    },
    areReferringItemsLoaded() {
      return this.itemToShow?.referringItems?.[0] instanceof Object;
    },
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
      return this.itemToShow?.relatedItems
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
    ...mapActions('lists', [
      '_fetchItemsByListId',
      '_fetchListById',
    ]),
    ...mapActions('items', [
      '_updateItemOnServer',
      '_addItemOnServer',
      '_fetchItemById',
    ]),
    ...mapActions('sidebar', [
      '_openSidebar',
      '_closeSidebar',
    ]),
    toggleShowingStatus(target) {
      this.showingStatuses[target] = !this.showingStatuses[target];
    },
    changeRelatedUnitMode(value) {
      if (this.responseItemObj) {
        this.$vfm.show('itemConflictModal');

        return null;
      }

      this.relatedUnitMode === value 
        ? this.relatedUnitMode = ''
        : this.relatedUnitMode = value;

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
      const isItself = this.itemToShow[unitIdFieldName] === unit.id;
      const isAlreadyRelated = this.itemToShow[targetRelatedArr]?.some(
        relatedUnit => unit.id === relatedUnit.id,
      );

      const isChoosable = isSavedOnServer && !isItself && !isAlreadyRelated;

      return isListChoosingOnlyToShowItems ? isSavedOnServer : isChoosable;
    },
    updateItemField({ field, fullUnitsForLocalUpdate }) {
      this.$emit('save-item', field, fullUnitsForLocalUpdate);
    },
    addRelatedItem() {
      this.updateItemField({
        field: 'relatedItems',
        fullUnitsForLocalUpdate: [
          ...(this.itemToShow.relatedItems || []),
          this.itemsFromPossibleRelatedList[this.chosenItemIndex],
        ],
      });

      this.chosenItemId = null;
      this.relatedUnitMode = '';
    },
    addRelatedList() {
      this.updateItemField({
        field: 'relatedLists',
        fullUnitsForLocalUpdate: [
          ...(this.itemToShow.relatedLists || []),
          this.lists[this.chosenListIndex],
        ],
      });

      this.chosenListId = null;
      this.relatedUnitMode = '';
    },
    deleteRelatedItem(id) {
      const fullUnitsForLocalUpdate = this.getFieldPropertyWithoutElementById({
        initialArray: this.itemToShow.relatedItems,
        unitIdToDelete: id,
      });

      this.updateItemField({
        field: 'relatedItems',
        fullUnitsForLocalUpdate,
      });
    },
    deleteRelatedList(id) {
      const fullUnitsForLocalUpdate = this.getFieldPropertyWithoutElementById({
        initialArray: this.itemToShow.relatedLists,
        unitIdToDelete: id,
      });

      this.updateItemField({
        field: 'relatedLists',
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
    async goToItem({ listId, itemId }) {
      const query = this.isItemFormInSidebar
        ? { item: itemId, sidebar: 'item' }
        : { item: itemId };

      await this.$router.push(
        { name: 'list', params: { id: listId }, query },
      );

      this._fetchListById({ id: listId, cancelToken: null })
        .then(async () => {
          await this._fetchItemById({ id: itemId, cancelToken: null });

          this.isItemFormInSidebar
            ? this._openSidebar('item')
            : this.$vfm.show('itemModal');
        });
    },
    async goToList(listId) {
      await this.$router.push(
        { name: 'list', params: { id: listId } },
      );

      this._closeSidebar();
      this.$vfm.hide('itemModal');

      this._fetchListById({ id: listId, cancelToken: null });
    },
  },
};
</script>

<template>
  <div
    class="related-units"
    :class="`${globalTheme}-theme`"
  >
    <div>
      <SectionCard
        v-if="areRelatedItemsLoaded"
        title="related items"
        size="small"
        text-style="caps"
        position="left"
      >
        <div 
          v-for="item in itemToShow?.relatedItems"
          :key="item.id"
          class="related-unit-container"
        >
          <ButtonSign
            v-if="isOwnerView && editable"
            class="delete-related-unit-button"
            style-type="cross"
            title="delete"
            @click="deleteRelatedItem(item.id)"
          />
          <div
            v-if="item.deletedAt"
            class="related-unit"
          >
            {{ item.title }}
            <span class="deleted-status">
              (in bin)
            </span>
          </div>
          <ButtonText
            v-else
            style-type="underline"
            :text="item.title || 'untitled'"
            class="related-unit"
            :class="{ 'untitled-item': !item.title }"
            @click="goToItem({ itemId: item.id, listId: item.listId })"
          />
        </div>
      </SectionCard>
      <SectionCard
        v-if="areRelatedListsLoaded"
        title="related lists"
        size="small"
        text-style="caps"
        position="left"
      >
        <div 
          v-for="list in itemToShow?.relatedLists"
          :key="list.id"
          class="related-unit-container"
        >
          <ButtonSign
            v-if="isOwnerView && editable"
            class="delete-related-unit-button"
            style-type="cross"
            title="delete"
            @click="deleteRelatedList(list.id)"
          />
          <div
            v-if="list.deletedAt"
            class="related-unit"
          >
            {{ list.title }} 
            <span class="deleted-status">
              (in bin)
            </span>
          </div>
          <ButtonText
            v-else
            style-type="underline"
            :text="list.title || 'untitled'"
            class="related-unit"
            @click="goToList(list.id)"
          />
        </div>
      </SectionCard>
    </div>
    <div
      v-if="isOwnerView && editable"
      :class="{ compact: isItemFormInSidebar }"
    >
      <div class="choosing-unit-type-section">
        <div class="adding-form-title">
          add related {{ relatedUnitMode }}
        </div>
        <div
          v-if="!relatedUnitMode"
          class="new-related-unit-type"
        >
          <ButtonText
            v-for="relatedUnitType in ['item', 'list']"
            :key="relatedUnitType"
            size="small"
            :active="relatedUnitMode === relatedUnitType"
            :text="`${relatedUnitType}`"
            @click="changeRelatedUnitMode(relatedUnitType)"
          />
        </div>
      </div>
      <div
        v-if="relatedUnitMode"
        class="unit-adding-section"
      >
        <div class="select-units">
          <SelectCustom 
            :default-option="$options.LISTS_DEFAULT_OPTION"
            :default-option-selected="!chosenListId"
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
              v-if="relatedUnitMode === 'list' && itemToShow.relatedLists?.length"
              label="already related lists:"
              disabled
            >
              <option
                v-for="list in itemToShow?.relatedLists"
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
        <div class="buttons-container">
          <ButtonText
            text="add"
            size="small"
            :disabled="isAddRelatedButtonDisabled"
            @click="isRelatedUnitModeAnItem ? addRelatedItem() : addRelatedList()"
          />
          <ButtonText
            text="cancel"
            size="small"
            @click="relatedUnitMode = ''"
          />
        </div>
      </div>
    </div>
    <TogglingBlock
      v-if="areReferringItemsLoaded"
      title="referring items"
    >
      <div class="referring-units-container">
        <div
          v-for="item in itemToShow?.referringItems"
          :key="item.id"
        >
          <div
            v-if="item.deletedAt"
            class="referring-unit"
          >
            {{ item.title }} 
            <span class="deleted-status">
              (in bin)
            </span>
          </div>
          <ButtonText
            v-else
            style-type="underline"
            :text="item.title || 'untitled'"
            class="referring-unit"
            :class="{ 'untitled-item': !item.title }"
            @click="goToItem({ itemId: item.id, listId: item.listId })"
          />
        </div>
      </div>
    </TogglingBlock>
  </div>
</template>

<style lang="scss" scoped>
.related-units {
  display: flex;
  flex-direction: column;

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
  }

  .buttons-container {
    display: flex;
    gap: 10px;
  }

  .select-units {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .choosing-unit-type-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 15px 0;
  }

  .new-related-unit-type {
    display: flex;
    gap: 15px;
  }

  .adding-form-title {
    padding-top: 5px;
    font-size: 16px;
    font-variant: small-caps;
  }

  .unit-adding-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 15px;
  }

  .unit-adding-section {
    flex-grow: 1;
  }

  .untitled-item,
  .deleted-status {
    color: map-get($colors, 'gray-light');
  }

  .compact {
    .select-units {
      gap: 20px;
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

    .untitled-item,
    .deleted-status {
      color: map-get($colors, 'gray-dark');
    }
  }
}

@media #{breakpoints.$s-media} {
  .related-units {
    .referring-units-container {
      grid-template-columns: 1fr;
    }

    .select-units {
      flex-wrap: wrap;
      gap: 15px;
      padding-bottom: 10px;
    }
  }
}
</style>
