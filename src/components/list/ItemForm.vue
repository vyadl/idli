<template>
  <ModalBasic
    class="item-form"
    name="itemForm"
    :header-text="edittingItemObj ? '' : 'new item'"
    @closed="clearData()"
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
          v-model="item.categories"
          @click="disableCategory(category.id)"
        />
      </div>
    </template>
    <template v-slot:buttons>
      <ButtonText
        text="save"
        style-type="bordered"
        @click="saveItem"
      />
      <ButtonText
        text="cancel"
        style-type="bordered"
        @click="closeItemForm"
      />
      <ButtonText
        text="delete"
        style-type="bordered"
        v-if="edittingItemObj"
        @click="_deleteItem(item)"
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
  watch: {
    edittingItemObj() {
      if (this.edittingItemObj) {
        this.item = { ...this.edittingItemObj };
      }
    },
  },
  methods: {
    ...mapActions({
      _setEdittingItemObj: '_setEdittingItemObj',
      _addItem: '_addItem',
      _changeItem: '_changeItem',
      _deleteItem: '_deleteItem',
    }),
    closeItemForm() {
      this.$modal.hide('itemForm');
    },
    clearData() {
      this._setEdittingItemObj(null);
      this.item = new models.Item();
    },
    saveItem() {
      if (this.edittingItemObj) {
        this._changeItem(this.item);
      } else {
        this._addItem(this.item);
      }

      this.closeItemForm();
    },
    disableCategory(id) {
      if (this.item.categories === id) {
        this.item.categories = '';
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
