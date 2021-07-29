<template>
  <ModalBasic
    class="list-form"
    name="listForm"
    :header-text="edittingListObj ? 'edit list' : 'new list'"
    @closed="clearData()"
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
            <InputCustom
              v-model="tag.name"
            />
            <div
              class="delete-filter-button"
              @click.stop="deleteFilter('tags', index)"
            ></div>
          </div>
          <div
            class="add-filter-button"
            @click="addFilter('tags')"
          ></div>
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
            <InputCustom
              v-model="category.name"
            />
            <div
              class="delete-filter-button"
              @click.stop="deleteFilter('categories', index)"
            ></div>
          </div>
          <div
            class="add-filter-button"
            @click.stop="addFilter('categories')"
          ></div>
        </div>
      </div>
      <ErrorMessage
        :message="errorMessage"
        v-if="errorMessage"
      />
      <ButtonText
        text="delete list"
        style-type="bordered"
        v-if="edittingListObj"
        @click="deleteList(list.id)"
        stop-propagation
      />
    </template>
    <template v-slot:buttons>
      <ButtonText
        text="save"
        style-type="bordered"
        @click="submitList"
        stop-propagation
      />
      <ButtonText
        text="cansel"
        style-type="bordered"
        @click="closeListForm"
        stop-propagation
      />
    </template>
  </ModalBasic>
</template>

<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import InputCustom from '@/components/formElements/InputCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import models from '@/models/models';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    ModalBasic,
    InputCustom,
    CheckboxCustom,
    ButtonText,
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
  watch: {
    edittingListObj: function edittingListObjHanler() {
      this.setEdittingList();
    },
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
    clearData() {
      this._setListForEditting(null);
      this.list = new models.List();
      this.errorMessage = '';
    },
    setEdittingList() {
      if (this.edittingListObj) {
        this.list = { ...this.edittingListObj };
      }
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
      const noRepeatFiltersNames = new Set(filtersNames);

      if (filtersNames.length === noRepeatFiltersNames.size) {
        return true;
      }

      return false;
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
      padding: 5 0;
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
      position: relative;
      width: 15px;
      height: 15px;
      margin-left: 10px;
      cursor: pointer;

      &::before,
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        width: 2px;
        height: 100%;
        background-color: map-get($colors, 'black');
        transform-origin: center center;
        transform: translateX(-50%);
      }

      &::before {
        transform: rotate(45deg);
      }

      &::after {
        transform: rotate(-45deg);
      }

      &:hover {
        opacity: .7;
      }
    }

    .add-filter-button {
      position: relative;
      width: 15px;
      height: 15px;
      padding: 5px;
      cursor: pointer;

      &::before,
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        width: 2px;
        height: 100%;
        background-color: map-get($colors, 'black');
        transform-origin: center center;
        transform: translateX(-50%);
      }

      &::before {
        transform: rotate(90deg);
      }

      &:hover {
        opacity: .7;
      }
    }
  }
</style>
