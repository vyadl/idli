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
          v-for="tag in currentListFilters.tags"
          :key="tag.id"
          :value="tag.id"
          :label="tag.name"
          name="tags"
          v-model="item.tags"
        />
      </div>
      <div class="filters-container">
        <RadioCustom
          v-for="category in currentListFilters.categories"
          :key="category.id"
          :value="category.id"
          :label="category.name"
          name="category"
          v-model="item.category"
          @click="disableCategory(category.id)"
        />
      </div>
    </template>
    <template v-slot:buttons>
      <div>
        <ButtonText
          class="modal-button"
          text="save"
          @click="saveItem"
        />
        <ButtonText
          text="cancel"
          @click="closeItemForm"
        />
      </div>
      <ButtonText
        text="delete item"
        style-type="underline"
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
  },
  data: () => ({
    item: new models.Item(),
  }),
  computed: {
    ...mapGetters({
      edittingItemObj: 'edittingItemObj',
      currentListFilters: 'currentListFilters',
    }),
  },
  methods: {
    ...mapActions({
      _setItemForEditting: '_setItemForEditting',
      _addItem: '_addItem',
      _changeItem: '_changeItem',
      _deleteItem: '_deleteItem',
    }),
    closeItemForm() {
      this.$modal.hide('itemForm');
    },
    clearData() {
      this._setItemForEditting(null);
      this.item = new models.Item();
    },
    setItemForEditting() {
      if (this.edittingItemObj) {
        this.item = { ...this.edittingItemObj };
      }
    },
    saveItem() {
      if (this.edittingItemObj) {
        this._changeItem(this.item);
      } else {
        this._addItem(this.item);
      }

      this.closeItemForm();
    },
    deleteItem(item) {
      this._deleteItem(item);
      this.closeItemForm();
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

    .modal-button {
      margin-right: 10px;
    }
  }
</style>
