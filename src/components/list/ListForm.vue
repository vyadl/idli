<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import { isConfirmed } from '@/settings/confirmationPromise';
import { List } from '@/models/models';
import { mapActions, mapGetters } from 'vuex';
import { getFormattedDate } from '@/utils/misc';

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
    areReferringItemsShown: false,
  }),
  computed: {
    ...mapGetters('lists', [
      'lists',
      'edittingListObj',
      'isUserOwnsCurrentList',
    ]),
    isPublicViewLinkShown() {
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
    ...mapActions('lists', [
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
      const isListTitleUnique = !this.lists.some(
        storeList => storeList.title === this.list.title,
      );

      this.errorMessage = isListTitleUnique ? '' : 'you already have a list with this title';

      return isListTitleUnique;
    },
    checkFiltersTitlesIntersections(filtersType, filtersTitles) {
      return this.list[filtersType]
        .some(filter => {
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
    toggleReferringItems() {
      this.areReferringItemsShown = !this.areReferringItemsShown;
    },
    getFormattedDate(val) {
      return getFormattedDate(val);
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
      ref="listTitle"
      v-model="list.title"
      label="title"
      :disabled="isRequestProcessing"
      required
    />
    <div class="private-option">
      <CheckboxCustom
        v-model="list.isPrivate"
        label="private"
        style-type="initial"
        :disabled="isRequestProcessing"
      />
      <router-link
        v-if="isPublicViewLinkShown"
        class="publick-view-link"
        :to="{ 
          name: 'list',
          params: { id: list.id },
          query: { view: 'public' }
        }"
        target="_blank"
      >
        check how others will see your list
      </router-link>
    </div>
    <div class="filters-container">
      <div class="tags">
        <h1 class="filters-header">
          tags
        </h1>
        <div
          v-for="(tag, index) in list.tags"
          :key="index"
          class="filter"
        >
          <InputCustom
            ref="tagsInput"
            v-model="tag.title"
            required
            :disabled="isRequestProcessing"
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
          v-for="(category, index) in list.categories"
          :key="index"
          class="filter"
        >
          <InputCustom
            ref="categoriesInput"
            v-model="category.title"
            required
            :disabled="isRequestProcessing"
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
      v-if="edittingListObj?.referringItems?.length"
    >
      <ButtonText
        :text="areReferringItemsShown ? 'hide referring items' : 'show referring items'"
        style-type="underline"
        @click="toggleReferringItems"
      />
      <div v-if="areReferringItemsShown">
        <h1>
          referring items:
        </h1>
        <div class="referring-units-container">
          <router-link
            v-for="item in edittingListObj.referringItems"
            :key="item.id"
            :to="{ name: 'item', params: { id: item.id || item } }"
            class="referring-unit"
            target="_blank"
          >
            {{ item.title }}
          </router-link> 
        </div>
      </div>
    </div>
    <div 
      v-if="list?.createdAt"
      class="stats"
    >
      <div>
        created at: {{ getFormattedDate(edittingListObj.createdAt) }}
      </div>
      <div>
        updated at: {{ getFormattedDate(edittingListObj.updatedAt) }}
      </div>
      <div>
        total items: {{ list.items.length }}
      </div>
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

    .publick-view-link {
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
    }

    .filters-container {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 15px;
      padding-top: 10px;
    }

    .tags,
    .categories {
      flex: 1 1 0px;
      padding: 15px;
      border-radius: 10px;
      border: 1px solid map-get($colors, 'gray-light');
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

    .referring-units-container {
      display: flex;
      flex-wrap: wrap;
    }

    .referring-unit {
      padding: 5px 10px 0 0;
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
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

    .stats {
      padding-top: 15px;
      font-size: 13px;
      line-height: 1.7;
      color: map-get($colors, 'gray-light');
    }
  }
</style>
