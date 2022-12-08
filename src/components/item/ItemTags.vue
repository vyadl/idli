<script>
import MultiselectCustom from '@/components/formElements/MultiselectCustom.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import { 
  mapGetters,
  mapActions,
  mapMutations,
} from 'vuex';
import { generateTitleFromDetails } from '@/store/utils';
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
    ...mapGetters('lists', [
      'lists',
      'currentListTags',
      'currentListCategories',
    ]),
    ...mapGetters('items', [
      'edittingItemObj',
      'currentItemTags',
    ]),
    currentListTagsTitles() {
      return this.currentListTags.map(tag => tag.title);
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
      '_addItemOnServer',
      '_updateItemOnServer',
      '_saveItemOnServer',
    ]),
    ...mapActions('lists', [
      '_updateList',
    ]),
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
      const isFilterAlreadyExist = this.currentListTags?.some(tag => tag.title === tagTitle)
        || this.currentListCategories?.some(category => category.title === tagTitle);

      if (isFilterAlreadyExist) {
        this.requestHandling.errorMessage = 'filter with this name already exists';
      } else {
        const { listId } = this.edittingItemObj;
        const listObj = this.lists.find(list => list.id === listId);

        this.addTagToListLocally({ listId, tagTitle });
        this.requestHandling.isRequestProcessing = true;

        const request = this._updateList(listObj);

        handleRequestStatuses(request, this.requestHandling, { onlyFinally: true })
          .then(() => {
            this.addTag(tagTitle);
          });
      }
    },
    deleteTag(tagTitle) {
      const removedTagObj = this.currentListTags.find(
        tag => tag.title === tagTitle,
      );
      const removedTagIndex = this.edittingItemObj.tags.findIndex(
        tagId => tagId === removedTagObj.id,
      );
      
      const tagsArrayCopy = [...this.edittingItemObj.tags];

      tagsArrayCopy.splice(removedTagIndex, 1);

      this.updateItemTags(tagsArrayCopy);
    },
    updateItemTags(value) {
      const { title, details } = this.edittingItemObj;

      this.updateItemFieldLocally({ field: 'tags', value });

      if (!title && details) {
        this.updateItemFieldLocally({
          field: 'title',
          value: generateTitleFromDetails(details),
        });
      }

      this._saveItemOnServer();
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
      :options="currentListTagsTitles"
      :can-clear="false"
      :disabled="requestHandling.isRequestProcessing"
      @select="tag => addTag(tag)"
      @deselect="tag => deleteTag(tag)"
    />
    <ErrorMessage
      v-if="requestHandling.errorMessage"
      :message="requestHandling.errorMessage"
    />
  </div>
</template>
