<template>
  <form
    class="item-form"
    @submit.prevent="saveItem"
  >
    <ModalBasic
      name="itemForm"
      :header-text="edittingItemObj ? 'edit item' : 'new item'"
      @before-open="setData"
      @opened="focusOnInput"
      @closed="resetData"
    >
      <template v-slot:main>
        <div class="text-fields">
          <InputCustom
            label="item"
            v-model="item.title"
            required
            ref="itemTitle"
          />
          <TextareaCustom
            label="details"
            v-model="item.details"
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
            name="category"
            @click="disableCategory(category.id)"
          />
        </div>
        <ErrorMessage
          v-if="errorMessage.length"
          :message="errorMessage"
        />
      </template>
      <template v-slot:buttons>
        <div>
          <ButtonText
            class="modal-button"
            :text="edittingItemObj ? 'save' : 'add'"
            type="submit"
            :disabled="isRequestProcessing"
          />
          <ButtonText
            text="cancel"
            :disabled="isRequestProcessing"
            @click="closeItemForm"
          />
        </div>
        <ButtonText
          v-if="edittingItemObj"
          text="delete item"
          style-type="underline"
          :disabled="isRequestProcessing"
          @click="deleteItem(item)"
        />
      </template>
    </ModalBasic>
  </form>
</template>

<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
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
    ModalBasic,
    InputCustom,
    TextareaCustom,
    CheckboxCustom,
    RadioCustom,
    ButtonText,
    ErrorMessage,
  },
  data: () => ({
    item: new Item(),
    isAnyTagExist: false,
    isAnyCategoryExist: false,
    isRequestProcessing: false,
    errorMessage: '',
  }),
  computed: {
    ...mapGetters({
      edittingItemObj: 'edittingItemObj',
      currentListTags: 'currentListTags',
      currentListCategories: 'currentListCategories',
    }),
  },
  methods: {
    ...mapActions({
      _setItemForEditting: '_setItemForEditting',
      _addItem: '_addItem',
      _updateItem: '_updateItem',
      _deleteItem: '_deleteItem',
    }),
    closeItemForm() {
      this.$modal.hide('itemForm');
    },
    setData() {
      this.isAnyTagExist = !!this.currentListTags.length;
      this.isAnyCategoryExist = !!this.currentListCategories.length;

      if (this.edittingItemObj) {
        this.item = JSON.parse(JSON.stringify(this.edittingItemObj));
      }
    },
    focusOnInput() {
      if (!this.edittingItemObj) {
        this.$refs.itemTitle.focus();
      }
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
          this.closeItemForm();
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
          this.closeItemForm();
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

    .modal-button {
      margin-right: 10px;
    }
  }
</style>
