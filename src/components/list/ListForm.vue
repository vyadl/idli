<template>
  <form
    class="list-form"
    @submit.prevent="saveList"
  >
    <ModalBasic
      name="listForm"
      :header-text="edittingListObj ? 'edit list' : 'new list'"
      @before-open="setData"
      @opened="focusOnInput"
      @closed="resetData"
    >
      <template v-slot:main>
        <InputCustom
          label="name"
          v-model="list.name"
          required
          ref="listName"
        />
        <div
          class="private-option"
          v-if="false"
        >
          <CheckboxCustom
            label="private"
            style-type="classic"
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
              v-for="(tag, index) in list.tags"
              :key="index"
            >
              <InputCustom
                v-model="tag.name"
                required
                ref="tagsInput"
              />
              <ButtonSign
                class="delete-filter-button"
                style-type="cross"
                title="delete tag"
                @click="deleteFilter('tags', index)"
              />
            </div>
            <ButtonSign
              style-type="plus"
              title="add tag"
              @click="addFilter('tags')"
            />
          </div>
          <div class="categories">
            <h1 class="filters-header">
              categories
            </h1>
            <div
              class="filter"
              v-for="(category, index) in list.categories"
              :key="index"
            >
              <InputCustom
                v-model="category.name"
                required
                ref="categoriesInput"
              />
              <ButtonSign
                class="delete-filter-button"
                style-type="cross"
                title="delete category"
                @click="deleteFilter('categories', index)"
              />
            </div>
            <ButtonSign
              style-type="plus"
              title="add category"
              @click="addFilter('categories')"
            />
          </div>
        </div>
        <ErrorMessage
          v-if="errorMessage"
          :message="errorMessage"
        />
      </template>
      <template v-slot:buttons>
        <div>
          <ButtonText
            class="modal-button"
            :text="edittingListObj ? 'save' : 'add'"
            type="submit"
            :disabled="isRequestProcessing"
          />
          <ButtonText
            text="cancel"
            :disabled="isRequestProcessing"
            @click="closeListForm"
          />
        </div>
        <ButtonText
          v-if="edittingListObj"
          text="delete list"
          style-type="underline"
          :disabled="isRequestProcessing"
          @click="deleteList(list.id)"
        />
      </template>
    </ModalBasic>
  </form>
</template>

<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import InputCustom from '@/components/formElements/InputCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import { List } from '@/models/models';
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
    list: new List(),
    isRequestProcessing: false,
    errorMessage: '',
  }),
  computed: {
    ...mapGetters({
      edittingListObj: 'edittingListObj',
      lists: 'lists',
    }),
  },
  methods: {
    ...mapActions({
      _setListForEditting: '_setListForEditting',
      _addList: '_addList',
      _updateList: '_updateList',
      _deleteList: '_deleteList',
    }),
    closeListForm() {
      this.$modal.hide('listForm');
    },
    setData() {
      if (this.edittingListObj) {
        this.list = JSON.parse(JSON.stringify(this.edittingListObj));
      }
    },
    focusOnInput() {
      if (!this.edittingListObj) {
        this.$refs.listName.focus();
      }
    },
    resetData() {
      this._setListForEditting(null);
      this.list = new List();
      this.errorMessage = '';
    },
    deleteFilter(type, index) {
      this.list[type].splice(index, 1);
    },
    addFilter(type) {
      this.list[type].push({
        name: null,
        id: null,
      });
      this.$nextTick(() => {
        const refName = `${type}Input`;

        this.$refs[refName][this.$refs[refName].length - 1].focus();
      });
    },
    isListNameUnique() {
      const isListNameUnique = !this.lists.some(storeList => storeList.name === this.list.name);

      this.errorMessage = isListNameUnique ? '' : 'you already have a list with this name';

      return isListNameUnique;
    },
    areFiltersNamesUnique() {
      const filtersNames = [];

      this.list.tags.forEach(tag => filtersNames.push(tag.name));
      this.list.categories.forEach(category => filtersNames.push(category.name));

      const areFiltersNamesUnique = filtersNames.length === new Set(filtersNames).size;

      this.errorMessage = areFiltersNamesUnique ? '' : 'you have filters with same names';

      return areFiltersNamesUnique;
    },
    saveList() {
      if (this.isListNameUnique() && this.areFiltersNamesUnique()) {
        this.isRequestProcessing = true;
        this[this.edittingListObj ? '_updateList' : '_addList'](this.list)
          .then(() => {
            this.closeListForm();
          })
          .catch(error => {
            this.errorMessage = error.response.data.message;
          })
          .finally(() => {
            this.isRequestProcessing = false;
          });
      }
    },
    deleteList(id) {
      this.isRequestProcessing = true;
      this._deleteList(id)
        .then(() => {
          this.closeListForm();
        })
        .catch(error => {
          this.errorMessage = error.response.data.message;
        })
        .finally(() => {
          this.isRequestProcessing = false;
        });
    },
  },
};
</script>

<style lang="scss">
  .list-form {
    .private-option {
      padding: 8px 0 15px;
    }

    .filters-container {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 15px;
      padding-top: 10px;
    }

    .tags,
    .categories {
      width: 210px;
    }

    .filters-header {
      margin-bottom: 8px;
      text-align: center;
    }

    .filter {
      display: flex;
      align-items: center;
    }

    .delete-filter-button {
      margin-left: 10px;
    }

    .modal-button {
      margin-right: 10px;
    }
  }
</style>
