<template>
  <form
    class="item-form"
    v-if="item"
    @submit.prevent="saveItem"
  >
    <div class="text-fields">
      <InputCustom
        label="item"
        v-model="item.title"
        :disabled="isRequestProcessing"
        required
        ref="itemTitle"
      />
      <TextareaCustom
        label="details"
        v-model="item.details"
        :disabled="isRequestProcessing"
      />
    </div>
    <div
      class="filters-container"
      :class="{ indent: isAnyTagExist && isAnyCategoryExist }"
      v-if="isAnyTagExist"
    >
      <h1 class="filters-title">tags:</h1>
      <CheckboxCustom
        v-for="tag in currentListTags"
        :key="tag.id"
        :label="tag.title"
        :value="tag.id"
        v-model="item.tags"
        :disabled="isRequestProcessing"
        name="tags"
      />
    </div>
    <div
      class="filters-container"
      v-if="isAnyCategoryExist"
    >
      <h1 class="filters-title">category:</h1>
      <RadioCustom
        v-for="category in currentListCategories"
        :key="category.id"
        :label="category.title"
        :value="category.id"
        v-model="item.category"
        :disabled="isRequestProcessing"
        name="category"
        @click="disableCategory(category.id)"
      />
    </div>
    <ErrorMessage
      v-if="errorMessage.length"
      :message="errorMessage"
    />
    <div class="buttons-container">
      <div>
        <ButtonText
          class="save-button"
          :text="edittingItemObj ? 'save' : 'add'"
          :small="settings.isItemFormInSidebar"
          type="submit"
          :disabled="isRequestProcessing"
        />
        <ButtonText
          text="cancel"
          :small="settings.isItemFormInSidebar"
          :disabled="isRequestProcessing"
          @click="settings.isItemFormInSidebar ? _closeSidebar() : closeItemModal()"
        />
      </div>
      <ButtonText
        v-if="edittingItemObj"
        text="delete item"
        style-type="underline"
        :small="settings.isItemFormInSidebar"
        :disabled="isRequestProcessing"
        @click="deleteItem(item)"
      />
    </div>
  </form>
</template>

<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import TextareaCustom from '@/components/formElements/TextareaCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import RadioCustom from '@/components/formElements/RadioCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import { Item } from '@/models/models';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    InputCustom,
    TextareaCustom,
    CheckboxCustom,
    RadioCustom,
    ButtonText,
    ErrorMessage,
  },
  data: () => ({
    item: null,
    isRequestProcessing: false,
    errorMessage: '',
  }),
  computed: {
    ...mapGetters({
      settings: 'settings',
      edittingItemObj: 'edittingItemObj',
      currentListTags: 'currentListTags',
      currentListCategories: 'currentListCategories',
    }),
    isAnyTagExist() {
      return !!this.currentListTags.length;
    },
    isAnyCategoryExist() {
      return !!this.currentListCategories.length;
    },
  },
  watch: {
    edittingItemObj: {
      handler: function edittingItemObjHandler() {
        this.item = this.edittingItemObj
          ? JSON.parse(JSON.stringify(this.edittingItemObj))
          : new Item();
      },
      immediate: true,
    },
  },
  mounted() {
    if (!this.edittingItemObj) {
      this.$refs.itemTitle.focus();
    }
  },
  destroyed() {
    this.resetData();
  },
  methods: {
    ...mapActions({
      _setItemForEditting: '_setItemForEditting',
      _addItem: '_addItem',
      _updateItem: '_updateItem',
      _deleteItem: '_deleteItem',
      _closeSidebar: '_closeSidebar',
    }),
    closeItemModal() {
      this.$modal.hide('itemModal');
    },
    resetData() {
      this._setItemForEditting(null);
      this.item = new Item();
      this.errorMessage = '';
    },
    saveItem() {
      this.isRequestProcessing = true;
      this[this.edittingItemObj ? '_updateItem' : '_addItem'](this.item)
        .then(() => {
          this.settings.isItemFormInSidebar ? this._closeSidebar() : this.closeItemModal();
        })
        .catch(error => {
          this.errorMessage = error.response.data.message;
        })
        .finally(() => {
          this.isRequestProcessing = false;
        });
    },
    deleteItem(item) {
      this.isRequestProcessing = true;
      this._deleteItem(item)
        .then(() => {
          this.settings.isItemFormInSidebar ? this._closeSidebar() : this.closeItemModal();
        })
        .catch(error => {
          this.errorMessage = error.response.data.message;
        })
        .finally(() => {
          this.isRequestProcessing = false;
        });
    },
    disableCategory(id) {
      if (this.item.category === id) {
        this.item.category = '';
      }
    },
  },
};
</script>

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

    .buttons-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 30px;
    }

    .save-button {
      margin-right: 10px;
    }
  }
</style>
