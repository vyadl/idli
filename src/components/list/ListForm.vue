<template>
  <ModalBasic
    class="list-form"
    name="listForm"
    :header-text="edittingListObj ? 'edit list' : 'new list'"
    @closed="_setListForEditting(null)"
  >
    <template v-slot:main>
      <InputCustom
        label="name"
        v-model="list.name"
      />
      <div class="filters-container">
        <div class="tags">
          <h1 class="filters-header">
            tags
          </h1>
          <div
            class="filter"
            v-for="tag in list.filters.tags"
            :key="tag.id"
          >
            <InputCustom
              v-model="tag.name"
            />
            <div
              class="delete-filter-button"
              @click.stop="deleteFilter('tags', tag.id)"
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
            v-for="category in list.filters.categories"
            :key="category.id"
          >
            <InputCustom
              v-model="category.name"
            />
            <div
              class="delete-filter-button"
              @click.stop="deleteFilter('categories', tag.id)"
            ></div>
          </div>
          <div
            class="add-filter-button"
            @click="addFilter('categories')"
          ></div>
        </div>
      </div>
    </template>
    <template v-slot:buttons>
      <ButtonText
        text="save"
        style-type="bordered"
        @click="submitList"
      />
      <ButtonText
        text="cansel"
        style-type="bordered"
        @click="closeListForm"
      />
    </template>
  </ModalBasic>
</template>

<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import models from '@/models/models';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    ModalBasic,
    InputCustom,
    ButtonText,
  },
  data: () => ({
    list: new models.List(),
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
      _addList: '_addList',
      _saveList: '_saveList',
      _removeList: '_removeList',
      _setListForEditting: '_setListForEditting',
    }),
    setEdittingList() {
      if (this.edittingListObj) {
        this.list = JSON.parse(JSON.stringify(this.edittingListObj));
      }
    },
    closeListForm() {
      this.$modal.hide('listForm');
    },
    deleteFilter(type, id) {
      this.list.filters[type] = this.list.filters[type].filter(filter => filter.id !== id);
    },
    addFilter(type) {
      this.list.filters[type].push({
        name: null,
        id: null,
      });
    },
    submitList() {
      if (this.edittingListObj) {
        this._saveList(this.list);
      } else {
        this._addList(this.list);
      }

      this.closeListForm();
    },
  },
};
</script>

<style lang="scss">
  .list-form {
    .filters-container {
      display: flex;
      justify-content: space-around;
      width: 100%;
      margin-bottom: 15px;
    }

    .tags,
    .categories {
      width: 200px;
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
