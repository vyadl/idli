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
      'explicitRequestsNumber',
    ]),
    ...mapGetters('lists', [
      'lists',
      'currentListTags',
      'currentListObj',
      'currentListCategories',
    ]),
    ...mapGetters('items', [
      'edittingItemObj',
      'currentItemTags',
    ]),
    ...mapGetters('settings', [
      'isItemFormInSidebar',
    ]),
    currentListTagsTitles() {
      return this.currentListTags.map(tag => tag.title);
    },
    currentListCategoriesTitles() {
      return this.currentListCategories.map(category => category.title);
    },
    currentItemTagsTitles() {
      return this.currentItemTags.map(tag => tag.title);
    },
  },
  methods: {
    ...mapMutations([
      'updateItemFieldLocally',
    ]),
    ...mapMutations('lists', [
      'addTagToListLocally',
    ]),
    ...mapActions('items', [
      '_saveItemOnServer',
    ]),
    ...mapActions('lists', [
      '_addTagForListAndItem',
    ]),
    checkTitleUniqueness(categoryTitle) {
      const isTitleUnique = !this.currentListCategoriesTitles.includes(categoryTitle)
        && !this.currentListTagsTitles.includes(categoryTitle);

      this.requestHandling.errorMessage = isTitleUnique
        ? ''
        : 'filter with this name already exists';

      this.newTitle = isTitleUnique
        ? categoryTitle
        : '';

      return isTitleUnique;
    },
    addTag(tagTitle) {
      this.requestHandling.errorMessage = '';

      const newTagObj = this.currentListTags?.find(tag => tag.title === tagTitle);

      if (newTagObj) {
        this.updateItemTags([...this.edittingItemObj.tags, newTagObj.id]);
      } else {
        this.createNewTag(tagTitle);
      }
    },
    createNewTag(tagTitle) {
      this.clearSearchTrigger = true;

      const isTitleUnique = this.checkTitleUniqueness(tagTitle);

      if (isTitleUnique) {
        const { listId } = this.edittingItemObj;
        const itemObj = JSON.parse(JSON.stringify(this.edittingItemObj));

        this.addTagToListLocally({ listId, tagTitle });
        this.requestHandling.isRequestProcessing = true;

        const listObj = this.lists.find(list => list.id === listId);
        const request = this._addTagForListAndItem({ listObj, tagTitle, itemObj }); 

        handleRequestStatuses(request, this.requestHandling, { onlyFinally: true })
          .then(() => {
            this.newTitle = '';
            this.clearSearchTrigger = false;
          });
      }
    },
    deleteTag(tagTitle) {
      const removedTagObj = this.currentListTags.find(
        tag => tag.title === tagTitle,
      );

      if (removedTagObj) {
        const removedTagIndex = this.edittingItemObj.tags.findIndex(
          tagId => tagId === removedTagObj.id,
        );
        
        const tagsArrayCopy = [...this.edittingItemObj.tags];

        tagsArrayCopy.splice(removedTagIndex, 1);

        this.updateItemTags(tagsArrayCopy);
      }
    },
    updateItemTags(value) {
      this.updateItemFieldLocally({ field: 'tags', value });
      this._saveItemOnServer(this.edittingItemObj);
    },
  },
};
</script>

<template>
  <div
    class="item-tags"
  >
    <MultiselectCustom
      :value="currentItemTagsTitles"
      :class="`${globalTheme}-theme`"
      mode="tags"
      placeholder="add tags"
      no-options-text="no tags - start typing to add new"
      no-results-text=""
      :small-text="isItemFormInSidebar"
      :options="currentListTagsTitles"
      :can-clear="false"
      :create-option="false"
      :clear-search-trigger="clearSearchTrigger"
      :disabled="requestHandling.isRequestProcessing || !!explicitRequestsNumber"
      :show-options="!requestHandling.errorMessage && !explicitRequestsNumber"
      @select="tag => addTag(tag)"
      @deselect="tag => deleteTag(tag)"
      @search-change="checkTitleUniqueness"
    >
      <template #beforelist>
        <div
          v-if="newTitle"
          class="create-option"
          @click="createNewTag(newTitle)"
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
.item-tags {
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
