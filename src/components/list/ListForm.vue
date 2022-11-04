<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import PopUp from '@/components/wrappers/PopUp.vue';
import TogglingBlock from '@/components/wrappers/TogglingBlock.vue';
import { isConfirmed } from '@/settings/confirmationPromise';
import { List } from '@/models/models';
import { mapActions, mapGetters } from 'vuex';
import { validateFiltersTitles } from '@/store/utils';
import { getFormattedDate } from '@/utils/misc';

export default {
  components: {
    InputCustom,
    CheckboxCustom,
    ButtonText,
    ButtonSign,
    ErrorMessage,
    PopUp,
    TogglingBlock,
  },
  data: () => ({
    list: null,
    isRequestProcessing: false,
    errorMessage: '',
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
      const isListTitleUnique = !this.lists.some(storeList => {
        return storeList.title === this.list.title
          && storeList.id !== this.list.id;
      });

      this.errorMessage = isListTitleUnique ? '' : 'you already have a list with this title';

      return isListTitleUnique;
    },
    addList() {
      const areFiltersTitlesValid = validateFiltersTitles(this.list);

      this.errorMessage = areFiltersTitlesValid ? '' : 'you have filters with same titles';

      if (this.validateListTitle() && areFiltersTitlesValid) {
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
      const areFiltersTitlesValid = validateFiltersTitles(this.list);

      this.errorMessage = areFiltersTitlesValid ? '' : 'you have filters with same titles';

      if (this.validateListTitle() && areFiltersTitlesValid) {
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
      v-model="list.title"
      label="title"
      :is-focus="!edittingListObj"
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
    <TogglingBlock
      v-if="edittingListObj?.referringItems?.length"
      title="referring items"
      caps
      bordered
    >
      <div class="referring-units-container">
        <router-link
          v-for="item in edittingListObj.referringItems"
          :key="item.id"
          :to="{ name: 'item', params: { id: item.id || item } }"
          class="referring-unit"
          :class="{ 'untitled-item': !item.title}"
          target="_blank"
        >
          {{ item.title || 'untitled' }}
        </router-link> 
      </div>
    </TogglingBlock>
    <div 
      v-if="list?.createdAt"
      class="stats"
    >
      <div>
        total items: {{ list.items.length }}
      </div>
      <PopUp
        button-style-type="info"
        stop-propagation
        informational
      >
        <div>
          created at: {{ getFormattedDate(edittingListObj.createdAt) }}
        </div>
        <div>
          updated at: {{ getFormattedDate(edittingListObj.updatedAt) }}
        </div>
      </PopUp>
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

<style lang="scss" scoped>
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
      border-radius: 5px;
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
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 5px;
    }

    .referring-unit {
      padding: 5px 10px 0 0;
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
    }

    .untitled-item {
      color: map-get($colors, 'gray-light');
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
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-top: 15px;
      font-size: 13px;
      line-height: 1.7;
      color: map-get($colors, 'gray-light');
    }
  }
</style>
