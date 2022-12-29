<script>
import MultiselectCustom from '@/components/formElements/MultiselectCustom.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import { 
  mapGetters,
  mapActions,
  mapMutations,
} from 'vuex';
import { handleRequestStatuses } from '@/utils/misc';

export default {
  components: {
    MultiselectCustom,
    ErrorMessage,
  },
  data() {
    return {
      requestHandling: {
        isRequestProcessing: false,
        errorMessage: '',
      },
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
    ...mapGetters('settings', [
      'isItemFormInSidebar',
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
      '_saveItemOnServer',
    ]),
    ...mapActions('lists', [
      '_addCategoryForListAndItem',
    ]),
    changeCategory(categoryTitle) {
      this.requestHandling.errorMessage = '';

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
        this.requestHandling.errorMessage = 'filter with this name already exists';
      } else {
        const { listId } = this.edittingItemObj;

        this.addCategoryToListLocally({ listId, categoryTitle });
        this.requestHandling.isRequestProcessing = true;

        const listObj = this.lists.find(list => list.id === listId);
        const request = this._addCategoryForListAndItem({ listObj, categoryTitle });

        handleRequestStatuses(request, this.requestHandling, { onlyFinally: true });
      }
    },
    removeCategory() {
      this.updateItemCategory(null);
    },
    updateItemCategory(value) {
      this.updateItemFieldLocally({ field: 'category', value });
      this._saveItemOnServer();
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
      :small-text="isItemFormInSidebar"
      :options="currentListCategoriesTitles"
      :disabled="requestHandling.isRequestProcessing"
      @select="category => changeCategory(category)"
      @clear="removeCategory()"
    />
    <ErrorMessage
      v-if="requestHandling.errorMessage"
      :message="requestHandling.errorMessage"
    />
  </div>
</template>
