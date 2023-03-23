<script>
import MultiselectCustom from '@/components/formElements/MultiselectCustom.vue';
import { 
  mapGetters,
  mapActions,
  mapMutations,
} from 'vuex';
import { handleRequestStatuses } from '@/utils/misc';

export default {
  components: {
    MultiselectCustom,
  },
  props: {
    categoryForBulkItems: Number,
  },
  emits: [
    'throw-error',
    'clear-error',
    'save-item',
  ],
  data() {
    return {
      newTitle: '',
      clearSearch: false,
      requestHandling: {
        isRequestProcessing: false,
      },
    };
  },
  computed: {
    ...mapGetters('lists', [
      'lists',
      'currentListId',
      'currentListCategories',
      'currentListCategoriesTitles',
    ]),
    ...mapGetters('items', [
      'currentItemObj',
      'currentItemCategory',
      'responseItemObj',
    ]),
    ...mapGetters('settings', [
      'isItemFormInSidebar',
    ]),
    isBulkItemsMode() {
      return this.categoryForBulkItems !== undefined;
    },
    categoryTitleForBulkItems() {
      const categoryObj = this.currentListCategories.find(
        category => category.id === this.categoryForBulkItems,
      );

      return categoryObj?.title;
    },
    selectedValue() {
      return this.isBulkItemsMode
        ? this.categoryTitleForBulkItems
        : this.currentItemCategory?.title || '';
    },
  },
  methods: {
    ...mapMutations('lists', [
      'addCategoryToListLocally',
    ]),
    ...mapActions('lists', [
      '_checkGroupingFieldTitleUniqueness',
      '_addGroupingFieldForListAndItem',
    ]),
    async checkTitleUniqueness(categoryTitle) {
      if (this.responseItemObj) {
        this.$vfm.show('itemConflictModal');

        return null;
      }

      const isTitleUnique = await this._checkGroupingFieldTitleUniqueness(categoryTitle);

      this.$emit(isTitleUnique ? 'clear-error' : 'throw-error');
      this.newTitle = isTitleUnique ? categoryTitle : '';

      return isTitleUnique;
    },
    changeCategory(categoryTitle) {
      this.$emit('clear-error');

      const newCategoryObj = this.currentListCategories.find(
        category => category.title === categoryTitle,
      );

      if (newCategoryObj) {
        this.updateItemCategory(newCategoryObj.id);
      } else {
        this.createNewCategory(categoryTitle);
      }
    },
    createNewCategory(categoryTitle) {
      this.clearSearch = true;

      const isTitleUnique = this.checkTitleUniqueness(categoryTitle);

      if (isTitleUnique) {
        const listId = this.currentItemObj?.listId || this.currentListId;
        const itemObj = JSON.parse(JSON.stringify(this.currentItemObj));

        this.addCategoryToListLocally({ listId, categoryTitle });
        this.requestHandling.isRequestProcessing = true;

        const listObj = this.lists.find(list => list.id === listId);
        const request = this._addGroupingFieldForListAndItem({
          listObj,
          itemObj,
          title: categoryTitle,
          groupingFieldType: 'category',
          isItemUpdateNeeded: !this.isBulkItemsMode,
        });

        handleRequestStatuses(request, this.requestHandling, { onlyFinally: true })
          .then(responseList => {
            if (this.isBulkItemsMode) {
              const newCategoryObj = responseList.categories.find(
                category => category.title === categoryTitle,
              );

              this.updateItemCategory(newCategoryObj.id);
            }

            this.newTitle = '';
            this.clearSearch = false;
          });
      }
    },
    removeCategory() {
      this.updateItemCategory('');
    },
    updateItemCategory(value) {
      this.$emit('save-item', 'category', value);
    },
  },
};
</script>

<template>
  <div
    class="item-categories"
    :class="`${globalTheme}-theme`"
  >
    <MultiselectCustom
      :value="selectedValue"
      placeholder="choose category"
      no-options-text="no categories - start typing to add new"
      no-results-text=""
      :small-text="isItemFormInSidebar"
      :options="currentListCategoriesTitles"
      :create-option="false"
      :clear-search-trigger="clearSearch"
      :disabled="requestHandling.isRequestProcessing"
      @select="category => changeCategory(category)"
      @clear="removeCategory()"
      @search-change="checkTitleUniqueness"
    >
      <template #beforelist>
        <div
          v-if="newTitle"
          class="create-option"
          @click="createNewCategory(newTitle)"
        >
          <div>
            {{ newTitle }}
          </div>
          <div class="new-option-desc">
            ( create new )
          </div>
        </div>
      </template>
    </MultiselectCustom>
  </div>
</template>

<style lang="scss">
.item-categories {
  .create-option {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      background-color: var(--ms-option-bg-pointed, #f3f4f6);
    }
  }

  .new-option-desc {
    font-size: 12px;
    font-variant: small-caps;
    color: map-get($colors, 'gray-dark');
  }

  &.inverted-theme {
    .create-option {
      color: map-get($colors, 'white');

      &:hover {
        background: map-get($colors, 'gray-dark');
      }
    }

    .new-option-desc {
      color: map-get($colors, 'gray-light');
    }
  }
}
</style>
