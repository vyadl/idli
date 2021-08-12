<template>
  <ModalBasic
    class="item-form"
    name="itemForm"
    :header-text="edittingItemObj ? '' : 'new item'"
    @before-open="setItemForEditting"
    @closed="clearData"
  >
    <template v-slot:main>
      <InputCustom
        label="item"
        v-model="item.text"
      />
      <TextareaCustom
        label="details"
        v-model="item.details"
      />
      <div class="filters-container">
        <CheckboxCustom
          v-for="tag in currentListTags"
          :key="tag.id"
          :value="tag.id"
          :label="tag.name"
          name="tags"
          v-model="item.tags"
        />
      </div>
      <div class="filters-container">
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
      <ButtonText
        text="save"
        style-type="bordered"
        :disabled="isRequestProcessing"
        @click="saveItem"
      />
      <ButtonText
        text="cancel"
        style-type="bordered"
        :disabled="isRequestProcessing"
        @click="closeItemForm"
      />
      <ButtonText
        text="delete"
        style-type="bordered"
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
    setItemForEditting() {
      if (this.edittingItemObj) {
        this.item = { ...this.edittingItemObj };
      }
    },
    clearData() {
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
    .filters-container {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
</style>
