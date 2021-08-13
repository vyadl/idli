<template>
  <ModalBasic
    class="item-form"
    name="itemForm"
    :header-text="edittingItemObj ? '' : 'new item'"
    @before-open="setData"
    @opened="focusOnInput"
    @closed="resetData"
  >
    <template v-slot:main>
      <div class="text-fields">
        <InputCustom
          label="item"
          required
          v-model="item.text"
          ref="itemName"
        />
        <TextareaCustom
          label="details"
          v-model="item.details"
        />
      </div>
      <div
        class="filters-container"
        :class="{ indent: areCurrentListTags && areCurrentListCategories }"
        v-if="areCurrentListTags"
      >
        <h1 class="filters-title">tags:</h1>
        <CheckboxCustom
          v-for="tag in currentListTags"
          :key="tag.id"
          :value="tag.id"
          :label="tag.name"
          name="tags"
          v-model="item.tags"
        />
      </div>
      <div
        class="filters-container"
        v-if="areCurrentListCategories"
      >
        <h1 class="filters-title">category:</h1>
        <RadioCustom
          v-for="category in currentListCategories"
          :key="category.id"
          :value="category.id"
          :label="category.name"
          name="category"
          v-model="item.category"
          @click="disableCategory(category.id)"
        />
      </div>
      <ErrorMessage
        :message="errorMessage"
        v-if="errorMessage.length"
      />
    </template>
    <template v-slot:buttons>
      <div>
        <ButtonText
          class="modal-button"
          text="save"
          :disabled="isRequestProcessing"
          @click="saveItem"
        />
        <ButtonText
          text="cancel"
          :disabled="isRequestProcessing"
          @click="closeItemForm"
        />
      </div>
      <ButtonText
        text="delete item"
        style-type="underline"
        :disabled="isRequestProcessing"
        v-if="edittingItemObj"
        @click="deleteItem(item)"
      />
    </template>
  </ModalBasic>
</template>

<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import InputCustom from '@/components/formElements/InputCustom.vue';
import TextareaCustom from '@/components/formElements/TextareaCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import RadioCustom from '@/components/formElements/RadioCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import models from '@/models/models';
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
    item: new models.Item(),
    areCurrentListTags: false,
    areCurrentListCategories: false,
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
      this.areCurrentListTags = Boolean(this.currentListTags.length);
      this.areCurrentListCategories = Boolean(this.currentListCategories.length);

      if (this.edittingItemObj) {
        this.item = JSON.parse(JSON.stringify(this.edittingItemObj));
      }
    },
    focusOnInput() {
      if (!this.edittingItemObj) {
        this.$refs.itemName.focus();
      }
    },
    resetData() {
      this._setItemForEditting(null);
      this.item = new models.Item();
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
