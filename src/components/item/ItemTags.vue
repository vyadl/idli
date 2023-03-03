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
      'currentListTags',
      'currentListTagsTitles',
    ]),
    ...mapGetters('items', [
      'currentItemObj',
      'currentItemTags',
      'responseItemObj',
    ]),
    ...mapGetters('settings', [
      'isItemFormInSidebar',
    ]),
    currentItemTagsTitles() {
      return this.currentItemTags.map(tag => tag.title);
    },
  },
  methods: {
    ...mapMutations('lists', [
      'addTagToListLocally',
    ]),
    ...mapActions('lists', [
      '_checkGroupingFieldTitleUniqueness',
      '_addGroupingFieldForListAndItem',
    ]),
    async checkTitleUniqueness(tagTitle) {
      if (this.responseItemObj) {
        this.$vfm.show('itemConflictModal');
        return;
      }

      const isTitleUnique = await this._checkGroupingFieldTitleUniqueness(tagTitle);

      this.$emit(isTitleUnique ? 'clear-error' : 'throw-error');
      this.newTitle = isTitleUnique ? tagTitle : '';

      return isTitleUnique;
    },
    addTag(tagTitle) {
      this.$emit('clear-error');

      const newTagObj = this.currentListTags?.find(tag => tag.title === tagTitle);

      if (newTagObj) {
        this.updateItemTags([...this.currentItemObj.tags, newTagObj.id]);
      } else {
        this.createNewTag(tagTitle);
      }
    },
    createNewTag(tagTitle) {
      this.clearSearch = true;

      const isTitleUnique = this.checkTitleUniqueness(tagTitle);

      if (isTitleUnique) {
        const { listId } = this.currentItemObj;
        const itemObj = JSON.parse(JSON.stringify(this.currentItemObj));

        this.addTagToListLocally({ listId, tagTitle });
        this.requestHandling.isRequestProcessing = true;

        const listObj = this.lists.find(list => list.id === listId);
        const request = this._addGroupingFieldForListAndItem({
          listObj,
          itemObj,
          title: tagTitle,
          groupingFieldType: 'tags',
        });

        handleRequestStatuses(request, this.requestHandling, { onlyFinally: true })
          .then(() => {
            this.newTitle = '';
            this.clearSearch = false;
          });
      }
    },
    deleteTag(tagTitle) {
      const removedTagObj = this.currentListTags.find(
        tag => tag.title === tagTitle,
      );

      if (removedTagObj) {
        const removedTagIndex = this.currentItemObj.tags.findIndex(
          tagId => tagId === removedTagObj.id,
        );
        
        const tagsArrayCopy = [...this.currentItemObj.tags];

        tagsArrayCopy.splice(removedTagIndex, 1);

        this.updateItemTags(tagsArrayCopy);
      }
    },
    updateItemTags(value) {
      this.$emit('save-item', 'tags', value);
    },
  },
};
</script>

<template>
  <div
    class="item-tags"
    :class="`${globalTheme}-theme`"
  >
    <MultiselectCustom
      :value="currentItemTagsTitles"
      mode="tags"
      placeholder="add tags"
      no-options-text="no tags - start typing to add new"
      no-results-text=""
      :small-text="isItemFormInSidebar"
      :options="currentListTagsTitles"
      :can-clear="false"
      :create-option="false"
      :clear-search-trigger="clearSearch"
      :disabled="requestHandling.isRequestProcessing"
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
            ( create new )
          </div>
        </div>
      </template>
    </MultiselectCustom>
  </div>
</template>

<style lang="scss">
.item-tags {
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
