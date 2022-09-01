<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import TextareaCustom from '@/components/formElements/TextareaCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import RadioCustom from '@/components/formElements/RadioCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { 
  mapGetters, mapActions, mapState, mapMutations,
} from 'vuex';
import { debounce } from 'throttle-debounce';

export default {
  components: {
    InputCustom,
    TextareaCustom,
    CheckboxCustom,
    RadioCustom,
    ButtonText,
  },
  API_REQUEST_DELAY: 1500,
  data() {
    return {
      serverRequests: [],
      callActionDebounced: debounce(
        this.$options.API_REQUEST_DELAY,
        (action, item) => {
          const source = this.$config.axios.CancelToken.source();

          this.serverRequests.push(source);
          this[action]({ item, cancelToken: source.token })
            .finally(() => {
              this.serverRequests = [];
            });
        },
      ),
    };
  },
  computed: {
    ...mapState([
      'edittingItemIndex',
      'currentListItems',
    ]),
    ...mapGetters([
      'currentListId',
      'currentListTags',
      'currentListCategories',
      'edittingItemObj',
      'isItemFormInSidebar',
    ]),
    isAnyTagWithIdExist() {
      return this.currentListTags?.some(tag => tag.id);
    },
    isAnyCategoryWithIdExist() {
      return this.currentListCategories?.some(category => category.id);
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
    const itemsNotAdded = this.currentListItems
      .filter(item => item.temporaryId && !item.title && !item.details);

    itemsNotAdded.forEach(item => {
      this._deleteItemByTemporaryId(item);
    });

    const areItemsNotUpdated = this.currentListItems
      .some(item => item.id && !item.title && !item.details);

    if (areItemsNotUpdated) {
      this._fetchListById({ id: this.currentListId, cancelToken: null });
    }

    this.setEdittingItemIndex(null); 
  },
  methods: {
    ...mapMutations([
      'updateItemField',
      'setEdittingItemIndex',
    ]),
    ...mapActions([
      '_closeSidebar',
      '_addItemOnServer',
      '_updateItemOnServer',
      '_deleteItem',
      '_deleteItemByTemporaryId',
      '_fetchListById',
    ]),
    closeItemModal() {
      this.$vfm.hide('itemModal');
    },
    saveItem(field, value) {
      this.callActionDebounced.cancel({ upcomingOnly: true });
      this.updateItemField({ field, value });
        
      if (this.edittingItemObj.title || this.edittingItemObj.details) {
        this.callActionDebounced(
          this.edittingItemObj.id ? '_updateItemOnServer' : '_addItemOnServer',
          this.edittingItemObj,
        );
      }
    },
    removeItem(item) {
      this.callActionDebounced.cancel({ upcomingOnly: true });
      this[item.id ? '_deleteItem' : '_deleteItemByTemporaryId'](item);

      if (this.serverRequests.length) {
        this.serverRequests.forEach(request => {
          request.cancel();
        });
        this.serverRequests = [];
      }

      if (item.temporaryId) {
        this.isItemFormInSidebar ? this._closeSidebar() : this.closeItemModal();
      }

      if (this.isItemFormInSidebar) {
        this.setEdittingItemIndex(this.currentListItems[this.edittingItemIndex] 
          ? this.edittingItemIndex : this.currentListItems.length - 1);
      } else {
        this.setEdittingItemIndex(null);
        this.closeItemModal();
      }
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
    ref="itemForm"
  >
    <div class="text-fields">
      <InputCustom
        label="item"
        :modelValue="edittingItemObj.title"
        :placeholder="edittingItemObj.temporaryId ? 'New item...' : ''"
        @update:modelValue="value => saveItem('title', value)"
        ref="itemTitle"
      />
      <TextareaCustom
        label="details"
        :modelValue="edittingItemObj.details"
        @update:modelValue="value => saveItem('details', value)"
      />
    </div>
    <div
      class="filters-container"
      :class="{ indent: isAnyTagWithIdExist && isAnyCategoryWithIdExist }"
      v-if="isAnyTagWithIdExist"
    >
      <h1 class="filters-title">tags:</h1>
      <CheckboxCustom
        v-for="tag in currentListTags"
        v-show="tag.id"
        :key="tag.id"
        :label="tag.title"
        :value="tag.id"
        :modelValue="edittingItemObj.tags"
        @update:modelValue="value => saveItem('tags', value)"
        name="tags"
        :disabled="areTagsAndCategoriesDisabled"
      />
    </div>
    <div
      class="filters-container"
      v-if="isAnyCategoryWithIdExist"
    >
      <h1 class="filters-title">category:</h1>
      <RadioCustom
        class="item-category"
        v-for="category in currentListCategories"
        v-show="category.id"
        :key="category.id"
        :label="category.title"
        :value="category.id"
        :modelValue="edittingItemObj.category"
        @update:modelValue="value => saveItem('category', value)"
        @click="disableCategory(category.id)"
        name="category"
        :disabled="areTagsAndCategoriesDisabled"
      />
    </div>
    <div class="buttons-container">
      <ButtonText
        v-if="edittingItemObj"
        :text="edittingItemObj.id ? 'delete item' : 'cancel'"
        style-type="underline"
        :small="isItemFormInSidebar"
        @click="removeItem(edittingItemObj)"
      />
    </div>
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

    .buttons-container {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      padding-top: 30px;
    }

    .save-button {
      margin-right: 10px;
    }
  }
</style>
