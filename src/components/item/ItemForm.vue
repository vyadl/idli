<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import TextareaCustom from '@/components/formElements/TextareaCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import RadioCustom from '@/components/formElements/RadioCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { 
  mapGetters,
  mapActions,
  mapState,
  mapMutations,
  useStore,
} from 'vuex';
import { debounce } from 'throttle-debounce';
import axios from 'axios';

export default {
  components: {
    InputCustom,
    TextareaCustom,
    CheckboxCustom,
    RadioCustom,
    ButtonText,
  },
  emits: ['scrollSidebarToTop'],
  setup() {
    const store = useStore();
    const API_REQUEST_DELAY = 1500;
    const serverRequests = {};

    const callActionDebounced = debounce(
      API_REQUEST_DELAY,
      (action, item) => {
        const itemActualId = item.id || item.temporaryId;
        const source = axios.CancelToken.source();

        if (serverRequests[itemActualId]) {
          serverRequests[itemActualId].cancel();
        }

        serverRequests[itemActualId] = source;

        store.dispatch(action, { item, cancelToken: source.token })
          .finally(() => {
            delete serverRequests[itemActualId];
          });
      },
    );

    const cancelActionDebounced = () => {
      callActionDebounced.cancel({ upcomingOnly: true });
    };

    return {
      callActionDebounced,
      cancelActionDebounced,
      serverRequests,
    };
  },
  computed: {
    ...mapState([
      'edittingItemIndex',
      'currentListItems',
    ]),
    ...mapGetters([
      'isUserOwnsCurrentList',
      'currentListTags',
      'currentListCategories',
      'edittingItemObj',
      'isItemFormInSidebar',
      'isPublicView',
    ]),
    areTagsShown() {
      const isAnyTagWithIdExist = this.currentListTags?.some(tag => tag.id);

      return this.isUserOwnsCurrentList && !this.isPublicView
        ? isAnyTagWithIdExist
        : isAnyTagWithIdExist && this.edittingItemObj.tags.length;
    },
    areCategoriesShown() {
      const isAnyCategoryWithIdExist = this.currentListCategories?.some(category => category.id);

      return this.isUserOwnsCurrentList && !this.isPublicView
        ? isAnyCategoryWithIdExist
        : isAnyCategoryWithIdExist && this.edittingItemObj.category;
    },
    areTagsAndCategoriesDisabled() {
      return !this.edittingItemObj.title && !this.edittingItemObj.details;
    },
  },
  mounted() {
    if (!this.edittingItemObj?.id) {
      this.$refs.itemTitle.focus();
    }
  },
  unmounted() {
    const emptyItemTitle = '[empty item]';

    this.currentListItems.forEach(item => {
      if (!item.title && !item.details) {
        item.temporaryId
          ? this._deleteItemByTemporaryId(item)
          : this._updateItemOnServer(
            {
              item: { ...item, title: emptyItemTitle }, 
              cancelToken: null,
            },
          );
      }
    });

    this.setEdittingItemIndex(null); 
  },
  methods: {
    ...mapMutations([
      'updateItemFieldLocally',
      'setEdittingItemIndex',
    ]),
    ...mapActions([
      '_closeSidebar',
      '_addItemOnServer',
      '_updateItemOnServer',
      '_deleteItem',
      '_deleteItemByTemporaryId',
    ]),
    closeItemModal() {
      this.$vfm.hide('itemModal');
    },
    updateItemField(field, value) {
      this.updateItemFieldLocally({ field, value });
        
      if (this.edittingItemObj.title || this.edittingItemObj.details) {
        this.callActionDebounced(
          this.edittingItemObj.id ? '_updateItemOnServer' : '_addItemOnServer',
          this.edittingItemObj,
        );
      }
    },
    removeItem(item) {
      const itemActualId = item.id || item.temporaryId;

      this.cancelActionDebounced();
      this[item.id ? '_deleteItem' : '_deleteItemByTemporaryId'](item);

      if (this.serverRequests[itemActualId]) {
        this.serverRequests[itemActualId].cancel();
        delete this.serverRequests[itemActualId];
      }

      let newIndex = null;

      if (this.isItemFormInSidebar && item.temporaryId) {
        this._closeSidebar();
      } else if (this.isItemFormInSidebar) {
        this.$emit('scrollSidebarToTop');
        newIndex = this.currentListItems[this.edittingItemIndex] 
          ? this.edittingItemIndex 
          : this.currentListItems.length - 1;
      } else {
        this.closeItemModal();
      }

      this.setEdittingItemIndex(newIndex);
    },
    disableCategory(id) {
      if (this.edittingItemObj.category === id) {
        this.updateItemField({ field: 'category', value: '' });
      }
    },
  },
};
</script>

<template>
  <div
    v-if="edittingItemObj"
    class="item-form"
  >
    <div class="text-fields">
      <InputCustom
        label="item"
        :modelValue="edittingItemObj.title"
        :placeholder="edittingItemObj.temporaryId ? 'New item...' : ''"
        @update:modelValue="value => updateItemField('title', value)"
        ref="itemTitle"
        :disabled="!isUserOwnsCurrentList || isPublicView"
      />
      <TextareaCustom
        label="details"
        :modelValue="edittingItemObj.details"
        @update:modelValue="value => updateItemField('details', value)"
        :disabled="!isUserOwnsCurrentList || isPublicView"
      />
    </div>
    <div
      class="filters-container"
      :class="{ indent: areTagsShown && areCategoriesShown }"
      v-if="areTagsShown"
    >
      <h1 class="filters-title">tags:</h1>
      <CheckboxCustom
        v-for="tag in currentListTags"
        v-show="isUserOwnsCurrentList && !isPublicView
          ? tag.id 
          : edittingItemObj.tags.includes(tag.id)"
        :key="tag.id"
        :label="tag.title"
        :value="tag.id"
        :modelValue="edittingItemObj.tags"
        @update:modelValue="value => updateItemField('tags', value)"
        name="tags"
        :disabled="areTagsAndCategoriesDisabled || !isUserOwnsCurrentList || isPublicView"
      />
    </div>
    <div
      class="filters-container"
      v-if="areCategoriesShown"
    >
      <h1 class="filters-title">category:</h1>
      <RadioCustom
        class="item-category"
        v-for="category in currentListCategories"
        v-show="isUserOwnsCurrentList && !isPublicView
          ? category.id 
          : category.id === edittingItemObj.category"
        :key="category.id"
        :label="category.title"
        :value="category.id"
        :modelValue="edittingItemObj.category"
        @update:modelValue="value => updateItemField('category', value)"
        @click="disableCategory(category.id)"
        name="category"
        :disabled="areTagsAndCategoriesDisabled || !isUserOwnsCurrentList || isPublicView"
      />
    </div>
    <footer 
      v-if="edittingItemObj && isUserOwnsCurrentList && !isPublicView"
      class="footer"
    >
      <ButtonText
        :text="edittingItemObj.id ? 'delete item' : 'cancel'"
        style-type="underline"
        :small="isItemFormInSidebar"
        @click="removeItem(edittingItemObj)"
      />
    </footer>
  </div>
</template>

<style lang="scss">
  .item-form {
    .text-fields {
      margin-bottom: 25px;
    }

    .filters-container {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;

      &.indent {
        margin-bottom: 10px;
      }
    }

    .filters-title {
      padding: 5px 10px 6px 0;
    }

    .item-category {
      margin-right: 7px;
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      padding-top: 30px;
    }
  }
</style>