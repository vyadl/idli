<script>
import TextareaCustom from '@/components/formElements/TextareaCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import PopupBox from '@/components/wrappers/PopupBox.vue';
import TogglingBlock from '@/components/wrappers/TogglingBlock.vue';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';
import MultiselectCustom from '@/components/formElements/MultiselectCustom.vue';
import { isConfirmed } from '@/settings/confirmationPromise';
import { List } from '@/models/models';
import { mapActions, mapGetters } from 'vuex';
import { getFormattedDate } from '@/utils/misc';
import { handleRequestStatuses } from '@/utils/misc';

export default {
  components: {
    TextareaCustom,
    CheckboxCustom,
    ButtonText,
    ErrorMessage,
    PopupBox,
    TogglingBlock,
    SectionCard,
    CustomLink,
    MultiselectCustom,
  },
  LIST_TITLE_ERROR: 'you already have a list with this title',
  GROUPING_FIELD_TITLE_ERROR: 'tags and categories should not have repeated titles',
  data: () => ({
    list: null,
    titleErrors: {
      list: '',
      tags: '',
      categories: '',
    },
    newTitles: {
      tags: '',
      categories: '',
    },
    clearSearch: {
      tags: false,
      categories: false,
    },
    appendOption: {
      tags: false,
      categories: false,
    },
    requestHandling: {
      isRequestProcessing: false,
      errorMessage: '',
    },
  }),
  computed: {
    ...mapGetters('appearance', [
      'isMobileScreen',
    ]),
    ...mapGetters('lists', [
      'lists',
      'edittingListObj',
      'isUserOwnsCurrentList',
    ]),
    isPublicViewLinkShown() {
      return this.list.id && !this.list.isPrivate;
    },
    tagsTitles() {
      return this.list?.tags.map(tag => tag.title);
    },
    categoriesTitles() {
      return this.list?.categories.map(category => category.title);
    },
  },
  watch: {
    edittingListObj: {
      handler() {
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
      '_setEdittingListObj',
    ]),
    closeListModal() {
      this.$vfm.hide('listModal');
    },
    resetData() {
      this._setEdittingListObj(null);
      this.requestHandling.errorMessage = '';
    },
    finishAppendOption(groupingFieldType) {
      this.clearSearch[groupingFieldType] = false;
      this.appendOption[groupingFieldType] = false;
      this.newTitles[groupingFieldType] = '';
    },
    showErrors({ isListTitleUnique, areGroupingFieldsTitlesValid }) {
      if (!isListTitleUnique) {
        this.titleErrors.list = this.$options.LIST_TITLE_ERROR;
      }

      if (!areGroupingFieldsTitlesValid) {
        this.titleErrors.tags = this.$options.GROUPING_FIELD_TITLE_ERROR;
        this.titleErrors.categories = this.$options.GROUPING_FIELD_TITLE_ERROR;
      }
    },
    addGroupingField(groupingFieldType, title) {
      this.clearSearch[groupingFieldType] = true;
      this.appendOption[groupingFieldType] = true;

      const isGroupingFieldTitleUnique = this.checkGroupingFieldTitle(groupingFieldType, title);

      if (isGroupingFieldTitleUnique) {
        this.list[groupingFieldType].push({
          title,
          id: null,
        });
      }
    },
    deleteGroupingField(groupingFieldType, title) {
      this.list[groupingFieldType] = this.list[groupingFieldType].filter(
        unit => unit.title !== title,
      );
    },
    checkGroupingFieldTitle(groupingFieldType, title) {
      this.titleErrors[groupingFieldType] = '';
      this.newTitles[groupingFieldType] = title;

      const isGroupingFieldTitleUnique = this.checkGroupingFieldTitleUniqueness(title);

      if (!isGroupingFieldTitleUnique) {
        this.titleErrors[groupingFieldType] = this.$options.GROUPING_FIELD_TITLE_ERROR;
      }

      return isGroupingFieldTitleUnique;
    },
    checkGroupingFieldTitleUniqueness(title) {
      return !this.tagsTitles.includes(title)
        && !this.categoriesTitles.includes(title);
    },
    checkGroupingFieldsTitlesIntersections(groupingFieldType, groupingFieldsTitles) {
      return this.list[groupingFieldType]
        .some(groupingField => {
          const isSameTitleGroupingField = groupingFieldsTitles.has(groupingField.title);
          if (!isSameTitleGroupingField) {
            groupingFieldsTitles.add(groupingField.title);
          }
          return isSameTitleGroupingField;
        });
    },
    validateGroupingFieldsTitles() {
      let isValid = true;
      const groupingFieldsTitles = new Set();

      isValid = !this.checkGroupingFieldsTitlesIntersections(
        'tags',
        groupingFieldsTitles,
      );

      if (isValid) {
        isValid = !this.checkGroupingFieldsTitlesIntersections(
          'categories',
          groupingFieldsTitles,
        );
      }

      return isValid;
    },
    validateListTitle() {
      this.titleErrors.list = '';

      const isListTitleUnique = !this.lists.some(storeList => {
        return storeList.title === this.list.title
          && storeList.id !== this.list.id;
      });

      if (!isListTitleUnique) {
        this.titleErrors.list = this.$options.LIST_TITLE_ERROR;
      }

      return isListTitleUnique;
    },
    addList() {
      const areGroupingFieldsTitlesValid = this.validateGroupingFieldsTitles();
      const isListTitleUnique = this.validateListTitle();

      if (isListTitleUnique && areGroupingFieldsTitlesValid) {
        this.requestHandling.isRequestProcessing = true;

        const request = this._addList(this.list);

        handleRequestStatuses(request, this.requestHandling)
          .then(() => {
            this.closeListModal();
          });
      }
    },
    updateList() {
      const areGroupingFieldsTitlesValid = this.validateGroupingFieldsTitles();
      const isListTitleUnique = this.validateListTitle();

      if (isListTitleUnique && areGroupingFieldsTitlesValid) {
        this.closeListModal();
        this.requestHandling.isRequestProcessing = true;

        const request = this._updateList(this.list);

        handleRequestStatuses(request, this.requestHandling, { onlyFinally: true });
      } else {
        this.requestHandling.errorMessage = this.showErrors({ 
          isListTitleUnique,
          areGroupingFieldsTitlesValid,
        });
      }
    },
    async deleteList() {
      const confirmationModalTitle = `are you sure you want to delete list  
        '${this.list.title}' ?`;
        
      const isRejected = !await isConfirmed(confirmationModalTitle);

      if (isRejected) {
        return false;
      }

      this.requestHandling.isRequestProcessing = true;

      const request = this._deleteList(this.list.id);

      handleRequestStatuses(request, this.requestHandling)
        .then(() => {
          this.closeListModal();
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
    :class="`${globalTheme}-theme`"
    @submit.prevent="list.id ? updateList() : addList()"
  >
    <TextareaCustom
      v-model="list.title"
      label="title"
      :rows="3"
      :is-focus="true"
      :disabled="requestHandling.isRequestProcessing"
      required
      @blur="validateListTitle"
      @input="titleErrors.list = ''"
    />
    <div class="title-error-container">
      <ErrorMessage :message="titleErrors.list" />
    </div>
    <div class="private-option">
      <CheckboxCustom
        v-model="list.isPrivate"
        label="private"
        style-type="initial"
        :disabled="requestHandling.isRequestProcessing"
      />
      <CustomLink
        v-if="isPublicViewLinkShown"
        class="public-view-link"
        :to="{ 
          name: 'list',
          params: { id: list.id },
          query: { view: 'public' }
        }"
        title="check how others will see your list"
        target="_blank"
      />
    </div>
    <SectionCard
      title="tags"
      position="left"
      text-style="caps"
      size="small"
    >
      <MultiselectCustom
        :value="tagsTitles"
        :options="tagsTitles"
        mode="tags"
        placeholder="start typing to add new tag"
        :can-clear="false"
        :create-option="false"
        :show-options="!titleErrors.tags"
        :disabled="requestHandling.isRequestProcessing"
        :clear-search-trigger="clearSearch.tags"
        :append-option="appendOption.tags"
        :new-title="newTitles.tags"
        no-options-text=""
        no-results-text=""
        @deselect="title => deleteGroupingField('tags', title)"
        @search-change="title => checkGroupingFieldTitle('tags', title)"
        @finish-append-option="finishAppendOption('tags')"
      >
        <template #beforelist>
          <div
            v-if="newTitles.tags"
            class="create-option"
            @click="addGroupingField('tags', newTitles.tags)"
          >
            <div>
              {{ newTitles.tags }}
            </div>
            <div class="new-option-desc">
              ( create new )
            </div>
          </div>
          <div
            v-else
            class="multiselect-hint"
          >
            start typing
          </div>
        </template>
      </MultiselectCustom>
      <div class="error-container">
        <ErrorMessage :message="titleErrors.tags" />
      </div>
    </SectionCard>
    <SectionCard
      title="categories"
      position="left"
      text-style="caps"
      size="small"
    >
      <MultiselectCustom
        :value="categoriesTitles"
        :options="categoriesTitles"
        mode="tags"
        placeholder="start typing to add new category"
        :can-clear="false"
        :create-option="false"
        :show-options="!titleErrors.categories"
        :disabled="requestHandling.isRequestProcessing"
        :clear-search-trigger="clearSearch.categories"
        :append-option="appendOption.categories"
        :new-title="newTitles.categories"
        no-options-text=""
        no-results-text=""
        @deselect="title => deleteGroupingField('categories', title)"
        @search-change="title => checkGroupingFieldTitle('categories', title)"
        @finish-append-option="finishAppendOption('categories')"
      >
        <template #beforelist>
          <div
            v-if="newTitles.categories"
            class="create-option"
            @click="addGroupingField('categories', newTitles.categories)"
          >
            <div>
              {{ newTitles.categories }}
            </div>
            <div class="new-option-desc">
              ( create new )
            </div>
          </div>
          <div
            v-else
            class="multiselect-hint"
          >
            start typing
          </div>
        </template>
      </MultiselectCustom>
      <div class="error-container">
        <ErrorMessage :message="titleErrors.categories" />
      </div>
    </SectionCard>
    <TogglingBlock
      v-if="list?.referringItems?.length"
      title="referring items"
    >
      <div class="referring-units-container">
        <CustomLink
          v-for="item in list.referringItems"
          :key="item.id"
          :to="{ name: 'item', params: { id: item.id || item }, query: { item: item.id } }"
          :title="item.title || 'untitled'"
          class="referring-unit"
          :class="{ 'untitled-item': !item.title}"
          target="_blank"
        />
      </div>
    </TogglingBlock>
    <div 
      v-if="list?.createdAt"
      class="stats"
    >
      <div>
        total items: {{ list.items.length }}
      </div>
      <PopupBox
        button-style-type="info"
        stop-propagation
      >
        <div>
          created at: {{ getFormattedDate(list.createdAt) }}
        </div>
        <div>
          updated at: {{ getFormattedDate(list.updatedAt) }}
        </div>
      </PopupBox>
    </div>
    <div class="error-container">
      <ErrorMessage :message="requestHandling.errorMessage" />
    </div>
    <footer class="footer">
      <div>
        <ButtonText
          class="modal-button"
          :text="list.id ? 'save' : 'add'"
          type="submit"
          :size="isMobileScreen ? 'small' : ''"
          :disabled="requestHandling.isRequestProcessing"
        />
        <ButtonText
          text="cancel"
          :size="isMobileScreen ? 'small' : ''"
          :disabled="requestHandling.isRequestProcessing"
          @click="closeListModal"
        />
      </div>
      <ButtonText
        v-if="list.id"
        text="delete list"
        style-type="underline"
        :size="isMobileScreen ? 'small' : ''"
        :disabled="requestHandling.isRequestProcessing"
        @click="deleteList"
      />
    </footer>
  </form>
</template>

<style lang="scss" scoped>
  .list-form {
    .private-option {
      padding: 8px 0 25px;
    }

    .referring-units-container {
      display: grid;
      gap: 10px;
    }

    .referring-unit,
    .public-view-link  {
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
    }

    .public-view-link  {
      padding: 5px 10px 0 0;
    }

    .multiselect-hint {
      padding: 10px;
      font-size: 14px;
      font-weight: bold;
      font-variant: small-caps;
      letter-spacing: 0.9px;
      color: map-get($colors, 'gray-dark');
      cursor: default;
    }

    .create-option {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      font-size: 16px;
      cursor: pointer;

      &:hover {
        background-color: var(--ms-option-bg-pointed, #f3f4f6);
      }
    }

    .new-option-desc {
      font-size: 14px;
      font-variant: small-caps;
      color: map-get($colors, 'gray-dark');
    }

    .untitled-item {
      color: map-get($colors, 'gray-light');
    }

    .title-error-container {
      height: 30px;
      padding-bottom: 10px;
    }

    .error-container {
      height: 20px;
      padding-top: 10px;
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

    &.inverted-theme {
      .referring-unit,
      .public-view-link {
        color: map-get($colors, 'gray-light');
      }

      .untitled-item,
      .stats {
        color: map-get($colors, 'gray-dark');
      }

      .create-option {
        color: map-get($colors, 'white');

        &:hover {
          background: map-get($colors, 'gray-dark');
        }
      }

      .new-option-desc,
      .multiselect-hint {
        color: map-get($colors, 'gray-light');
      }
    }
  }

  @media #{breakpoints.$s-media} {
    .list-form {
      .referring-units-container {
        grid-template-columns: 1fr;
      }

      .error-container {
        height: 60px;
      }
    }
  }
</style>
