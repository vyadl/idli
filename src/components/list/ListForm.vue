<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import { isConfirmed } from '@/settings/confirmationPromise';
import { List } from '@/models/models';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    InputCustom,
    CheckboxCustom,
    ButtonText,
    ButtonSign,
    ErrorMessage,
  },
  data: () => ({
    list: null,
    isRequestProcessing: false,
    errorMessage: '',
  }),
  computed: {
    ...mapGetters([
      'lists',
      'edittingListObj',
      'isUserOwnsCurrentList',
    ]),
    isPublicViewButtonShown() {
      return this.list && !this.list.isPrivate && this.edittingListObj;
    },
  },
  watch: {
    edittingListObj: {
      handler: function edittingItemObjHandler() {
        this.list = this.edittingListObj
          ? JSON.parse(JSON.stringify(this.edittingListObj))
          : new List();
      },
      immediate: true,
    },
  },
  mounted() {
    if (!this.edittingListObj) {
      this.$refs.listTitle.focus();
    }
  },
  unmounted() {
    this.resetData();
  },
  methods: {
    ...mapActions([
      '_addList',
      '_updateList',
      '_deleteList',
      '_setListForEditting',
    ]),
    closeListModal() {
      this.$vfm.hide('listModal');
    },
    resetData() {
      this._setListForEditting(null);
      this.list = new List();
      this.errorMessage = '';
    },
    deleteFilter(filtersType, index) {
      this.list[filtersType].splice(index, 1);
    },
    addFilter(filtersType) {
      this.list[filtersType].push({
        title: null,
        id: null,
      });
      this.$nextTick(() => {
        const filterInputsRefs = this.$refs[`${filtersType}Input`];

        filterInputsRefs[filterInputsRefs.length - 1].focus();
      });
    },
    validateListTitle() {
      const isListTitleUnique = !this.lists.some(storeList => storeList.title === this.list.title);

      this.errorMessage = isListTitleUnique ? '' : 'you already have a list with this title';

      return isListTitleUnique;
    },
    checkFiltersTitlesIntersections(filtersType, filtersTitles) {
      return this.list[filtersType].some(filter => {
        const isSameTitleFilter = filtersTitles.has(filter.title);

        if (!isSameTitleFilter) {
          filtersTitles.add(filter.title);
        }

        return isSameTitleFilter;
      });
    },
    validateFiltersTitles() {
      let isValid = true;
      const filtersTitles = new Set();

      isValid = !this.checkFiltersTitlesIntersections('tags', filtersTitles);

      if (isValid) {
        isValid = !this.checkFiltersTitlesIntersections('categories', filtersTitles);
      }

      this.errorMessage = isValid ? '' : 'you have filters with same titles';

      return isValid;
    },
    addList() {
      if (this.validateListTitle() && this.validateFiltersTitles()) {
        this.isRequestProcessing = true;
        this._addList(this.list)
          .then(() => {
            this.closeListModal();
          })
          .catch(error => {
            this.errorMessage = error.response.data.message;
          })
          .finally(() => {
            this.isRequestProcessing = false;
          });
      }
    },
    updateList() {
      if (this.validateFiltersTitles()) {
        this.closeListModal();
        this.isRequestProcessing = true;
        this._updateList(this.list)
          .finally(() => {
            this.isRequestProcessing = false;
          });
      }
    },
    openListPublicView(id) {
      const { href, search } = window.location;
      const newUrl = new URL(`/list/${id}`, href);
      
      newUrl.search = `${search}&view=public`;

      window.open(newUrl, '_blank');
    },
    async deleteList() {
      const confirmationModalTitle = `are you sure you want to delete list  
        '${this.edittingListObj?.title}' ?`;
        
      const isRejected = !await isConfirmed(confirmationModalTitle);

      if (isRejected) {
        return false;
      }

      this.isRequestProcessing = true;
      this._deleteList(this.list.id)
        .then(() => {
          this.closeListModal();
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

<template>
  <form
    class="list-form"
    @submit.prevent="edittingListObj ? updateList() : addList()"
  >
    <InputCustom
      label="title"
      v-model="list.title"
      :disabled="isRequestProcessing"
      required
      ref="listTitle"
    />
    <div class="private-option">
      <CheckboxCustom
        label="private"
        style-type="classic"
        v-model="list.isPrivate"
        :disabled="isRequestProcessing"
      />
      <ButtonText
        v-if="isPublicViewButtonShown"
        text="check how others will see your list"
        style-type="underline"
        small
        @click="openListPublicView(list.id)"
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
            v-model="tag.title"
            required
            :disabled="isRequestProcessing"
            ref="tagsInput"
          />
          <ButtonSign
            class="delete-filter-button"
            style-type="cross"
            title="delete tag"
            :disabled="isRequestProcessing"
            @click="deleteFilter('tags', index)"
          />
        </div>
        <ButtonSign
          style-type="plus"
          title="add tag"
          :disabled="isRequestProcessing"
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
            v-model="category.title"
            required
            :disabled="isRequestProcessing"
            ref="categoriesInput"
          />
          <ButtonSign
            class="delete-filter-button"
            style-type="cross"
            title="delete category"
            :disabled="isRequestProcessing"
            @click="deleteFilter('categories', index)"
          />
        </div>
        <ButtonSign
          style-type="plus"
          title="add category"
          :disabled="isRequestProcessing"
          @click="addFilter('categories')"
        />
      </div>
    </div>
    <ErrorMessage
      v-if="errorMessage"
      :message="errorMessage"
    />
    <div 
      v-if="list?.createdAt"
      class="total-items"
    >
      total items: {{ list.items.length }}
    </div>
    <footer class="footer">
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
          @click="closeListModal"
        />
      </div>
      <ButtonText
        v-if="edittingListObj"
        text="delete list"
        style-type="underline"
        :disabled="isRequestProcessing"
        @click="deleteList"
      />
    </footer>
  </form>
</template>

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

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 30px;
    }

    .modal-button {
      margin-right: 10px;
    }

    .total-items {
      padding-top: 15px;
      font-size: 13px;
      color: map-get($colors, 'gray-light');
    }
  }
</style>
