<template>
  <ModalBasic
    class="list-form"
    name="listForm"
    :header-text="edittingListObj ? 'edit list' : 'new list'"
    @before-open="setListForEditting"
    @closed="clearData"
  >
    <template v-slot:main>
      <InputCustom
        label="name"
        v-model="list.name"
      />
      <div class="private-option">
        <CheckboxCustom
          label="private"
          v-model="list.isPrivate"
        />
      </div>
      <div class="filters-container">
        <div class="tags">
          <h1 class="filters-header">
            tags
          </h1>
          <div
            class="filter"
            v-for="(tag, index) in list.filters.tags"
            :key="index"
          >
            <InputCustom v-model="tag.name" />
            <ButtonSign
              class="delete-filter-button"
              style-type="cross"
              @click="deleteFilter('tags', index)"
            />
          </div>
          <ButtonSign
            style-type="plus"
            @click="addFilter('tags')"
          />
        </div>
        <div class="categories">
          <h1 class="filters-header">
            categories
          </h1>
          <div
            class="filter"
            v-for="(category, index) in list.filters.categories"
            :key="index"
          >
            <InputCustom v-model="category.name" />
            <ButtonSign
              class="delete-filter-button"
              style-type="cross"
              @click="deleteFilter('categories', index)"
            />
          </div>
          <ButtonSign
            style-type="plus"
            @click="addFilter('categories')"
          />
        </div>
      </div>
      <ErrorMessage
        :message="errorMessage"
        v-if="errorMessage"
      />
      <ButtonText
        text="delete list"
        style-type="solid"
        v-if="edittingListObj"
        @click="deleteList(list.id)"
      />
    </template>
    <template v-slot:buttons>
      <ButtonText
        text="save"
        style-type="solid"
        @click="submitList"
      />
      <ButtonText
        text="cansel"
        style-type="solid"
        @click="closeListForm"
      />
    </template>
  </ModalBasic>
</template>

<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import InputCustom from '@/components/formElements/InputCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import models from '@/models/models';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    ModalBasic,
    InputCustom,
    CheckboxCustom,
    ButtonText,
    ButtonSign,
    ErrorMessage,
  },
  data: () => ({
    list: new models.List(),
    errorMessage: '',
  }),
  computed: {
    ...mapGetters({
      edittingListObj: 'edittingListObj',
    }),
  },
  methods: {
    ...mapActions({
      _setListForEditting: '_setListForEditting',
      _addList: '_addList',
      _saveList: '_saveList',
      _removeList: '_removeList',
    }),
    closeListForm() {
      this.$modal.hide('listForm');
    },
    setListForEditting() {
      if (this.edittingListObj) {
        this.list = { ...this.edittingListObj };
      }
    },
    clearData() {
      this._setListForEditting(null);
      this.list = new models.List();
      this.errorMessage = '';
    },
    deleteFilter(type, index) {
      this.list.filters[type].splice(index, 1);
    },
    addFilter(type) {
      this.list.filters[type].push({
        name: null,
        id: null,
      });
    },
    verifyFilters() {
      const filtersNames = [];

      this.list.filters.tags.forEach(tag => filtersNames.push(tag.name));
      this.list.filters.categories.forEach(category => filtersNames.push(category.name));

      return filtersNames.length === new Set(filtersNames).size;
    },
    deleteList(id) {
      this._removeList(id);
      this.closeListForm();
    },
    submitList() {
      if (this.verifyFilters()) {
        if (this.edittingListObj) {
          this._saveList(this.list);
        } else {
          this._addList(this.list);
        }

        this.closeListForm();
      } else {
        this.errorMessage = 'same names in filters';
      }
    },
  },
};
</script>

<style lang="scss">
  .list-form {
    .private-option {
      padding: 5px 0;
    }

    .filters-container {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 15px;
    }

    .tags,
    .categories {
      width: 210px;
    }

    .filters-header {
      margin-bottom: 8px;
      font-size: 12px;
    }

    .filter {
      display: flex;
      align-items: center;
    }

    .delete-filter-button {
      margin-left: 10px;
    }
  }
</style>
