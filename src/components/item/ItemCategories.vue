<script>
import MultiselectCustom from '@/components/formElements/MultiselectCustom.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import { 
  mapGetters,
  mapActions,
  mapMutations,
} from 'vuex';
import { generateTitleFromDetails } from '@/store/utils';

export default {
  components: {
    MultiselectCustom,
    ErrorMessage,
  },
  data() {
    return {
      isRequestProcessing: false,
      errorMessage: '',
    };
  },
  computed: {
    ...mapGetters([
      'currentListItems',
    ]),
    ...mapGetters('lists', [
      'lists',
      'currentListCategories',
    ]),
    ...mapGetters('items', [
      'edittingItemObj',
    ]),
    currentListCategoriesTitles() {
      return this.currentListCategories.map(category => category.title);
    },
    currentItemCategoryTitle() {
      const categoryObj = this.currentListCategories.find(
        category => category.id === this.edittingItemObj.category,
      );

      return categoryObj?.title || '';
    },
  },
  methods: {
    ...mapMutations([
      'updateItemFieldLocally',
    ]),
    ...mapMutations('lists', [
      'addCategoryToListLocally',
    ]),
    ...mapActions('items', [
      '_addItemOnServer',
      '_updateItemOnServer',
      '_chooseBetweenAddOrUpdateItemOnServer',
    ]),
    ...mapActions('lists', [
      '_updateList',
    ]),
    changeCategory(categoryTitle) {
      this.errorMessage = '';

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
      const isFilterAlreadyExist = this.currentListTags?.some(tag => tag.title === categoryTitle)
        || this.currentListCategories?.some(category => category.title === categoryTitle);

      if (isFilterAlreadyExist) {
        this.errorMessage = 'filter with this name already exists';
      } else {
        const { listId } = this.edittingItemObj;
        const listObj = this.lists.find(list => list.id === listId);

        this.addCategoryToListLocally({ listId, categoryTitle });
        this.isRequestProcessing = true;
        this._updateList(listObj)
          .then(() => {
            this.changeCategory(categoryTitle);
          })
          .finally(() => {
            this.isRequestProcessing = false;
          });
      }
    },
    removeCategory() {
      this.updateItemCategory(null);
    },
    updateItemCategory(value) {
      const { title, details } = this.edittingItemObj;

      this.updateItemFieldLocally({ field: 'category', value });

      if (!title && details) {
        this.updateItemFieldLocally({
          field: 'title',
          value: generateTitleFromDetails(details),
        });
      }

      this._chooseBetweenAddOrUpdateItemOnServer();
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
      :value="currentItemCategoryTitle"
      placeholder="choose category"
      no-options-text="no categories - start typing to add new"
      :options="currentListCategoriesTitles"
      :disabled="isRequestProcessing"
      @select="category => changeCategory(category)"
      @clear="removeCategory()"
    />
    <ErrorMessage
      v-if="errorMessage"
      :message="errorMessage"
    />
  </div>
</template>
