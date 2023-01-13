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
      newTitle: '',
      clearSearchTrigger: false,
      requestHandling: {
        isRequestProcessing: false,
        errorMessage: '',
      },
    };
  },
  computed: {
    ...mapGetters([
      'currentListItems',
      'explicitRequestsNumber',
    ]),
    ...mapGetters('lists', [
      'lists',
      'currentListCategories',
      'currentListTags',
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
    currentListTagsTitles() {
      return this.currentListTags.map(tag => tag.title);
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
      '_saveItemOnServer',
    ]),
    ...mapActions('lists', [
      '_addCategoryForListAndItem',
    ]),
    checkTitleUniqueness(categoryTitle) {
      const isTitleUnique = !this.currentListTagsTitles.includes(categoryTitle)
        && !this.currentListCategoriesTitles.includes(categoryTitle);

      this.requestHandling.errorMessage = isTitleUnique
        ? ''
        : 'filter with this name already exists';

      this.newTitle = isTitleUnique
        ? categoryTitle
        : '';

      return isTitleUnique;
    },
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
      this.clearSearchTrigger = true;

      const isTitleUnique = this.checkTitleUniqueness(categoryTitle);

      if (isTitleUnique) {
        const { listId } = this.edittingItemObj;
        const itemObj = JSON.parse(JSON.stringify(this.edittingItemObj));

        this.addCategoryToListLocally({ listId, categoryTitle });
        this.requestHandling.isRequestProcessing = true;

        const listObj = this.lists.find(list => list.id === listId);
        const request = this._addCategoryForListAndItem({ listObj, itemObj, categoryTitle });

        handleRequestStatuses(request, this.requestHandling, { onlyFinally: true })
          .then(() => {
            this.newTitle = '';
            this.clearSearchTrigger = false;
          });
      }
    },
    removeCategory() {
      this.updateItemCategory('');
    },
    updateItemCategory(value) {
      this.updateItemFieldLocally({ field: 'category', value });
      this._saveItemOnServer(this.edittingItemObj);
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
      no-results-text=""
      :small-text="isItemFormInSidebar"
      :options="currentListCategoriesTitles"
      :create-option="false"
      :clear-search-trigger="clearSearchTrigger"
      :disabled="requestHandling.isRequestProcessing || !!explicitRequestsNumber"
      :show-options="!requestHandling.errorMessage && !explicitRequestsNumber"
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
            create new
          </div>
        </div>
      </template>
    </MultiselectCustom>
    <div class="error-container">
      <ErrorMessage
        v-if="requestHandling.errorMessage"
        :message="requestHandling.errorMessage"
      />
    </div>
  </div>
</template>

<style lang="scss">
.item-categories {
  .error-container {
    height: 20px;
    padding-top: 10px;
  }

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
}
</style>
