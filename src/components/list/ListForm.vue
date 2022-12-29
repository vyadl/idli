<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import PopupBox from '@/components/wrappers/PopupBox.vue';
import TogglingBlock from '@/components/wrappers/TogglingBlock.vue';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';
import ListTags from '@/components/list/ListTags.vue';
import ListCategories from '@/components/list/ListCategories.vue';
import { isConfirmed } from '@/settings/confirmationPromise';
import { List } from '@/models/models';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import { getFormattedDate } from '@/utils/misc';
import { handleRequestStatuses } from '@/utils/misc';

export default {
  components: {
    InputCustom,
    CheckboxCustom,
    ButtonText,
    ErrorMessage,
    PopupBox,
    TogglingBlock,
    SectionCard,
    CustomLink,
    ListTags,
    ListCategories,
  },
  GROUPING_FIELD_TITLE_ERROR: 'tags and categories should not have repeated titles',
  LIST_TITLE_ERROR: 'you already have a list with this title',
  data: () => ({
    list: null,
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
      return this.edittingListObj && !this.edittingListObj.isPrivate;
    },
  },
  created() {
    if (!this.edittingListObj) {
      this._setListForEditting(new List());
    }
  },
  unmounted() {
    this.resetData();
  },
  methods: {
    ...mapMutations('lists', [
      'updateListFieldLocally',
    ]),
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
      this.requestHandling.errorMessage = '';
    },
    composeErrorMessage({ isListTitleUnique, areGroupingFieldsTitlesValid }) {
      if (!isListTitleUnique && !areGroupingFieldsTitlesValid) {
        return `${this.$options.GROUPING_FIELD_TITLE_ERROR}; also, 
        ${this.$options.LIST_TITLE_ERROR}`;
      }

      return !isListTitleUnique
        ? this.$options.LIST_TITLE_ERROR
        : this.$options.GROUPING_FIELD_TITLE_ERROR;
    },
    validateListTitle() {
      return !this.lists.some(storeList => {
        return storeList.title === this.edittingListObj.title
          && storeList.id !== this.edittingListObj.id;
      });
    },
    checkGroupingFieldsTitlesIntersections(groupingFieldType, groupingFieldsTitles) {
      return this.edittingListObj[groupingFieldType]
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
    updateListField(field, value) {
      this.updateListFieldLocally({ field, value });
    },
    addList() {
      const areGroupingFieldsTitlesValid = this.validateGroupingFieldsTitles();
      const isListTitleUnique = this.validateListTitle();

      if (isListTitleUnique && areGroupingFieldsTitlesValid) {
        this.requestHandling.isRequestProcessing = true;

        const request = this._addList(this.edittingListObj);

        handleRequestStatuses(request, this.requestHandling)
          .then(() => {
            this.closeListModal();
          });
      } else {
        this.requestHandling.errorMessage = this.composeErrorMessage({ 
          isListTitleUnique,
          areGroupingFieldsTitlesValid,
        });
      } 
    },
    updateList() {
      const areGroupingFieldsTitlesValid = this.validateGroupingFieldsTitles();
      const isListTitleUnique = this.validateListTitle();
      
      if (isListTitleUnique && areGroupingFieldsTitlesValid) {
        this.closeListModal();
        this.requestHandling.isRequestProcessing = true;

        const request = this._updateList(this.edittingListObj);

        handleRequestStatuses(request, this.requestHandling, { onlyFinally: true });
      } else {
        this.requestHandling.errorMessage = this.composeErrorMessage({ 
          isListTitleUnique,
          areGroupingFieldsTitlesValid,
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

      this.requestHandling.isRequestProcessing = true;

      const request = this._deleteList(this.edittingListObj.id);

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
    @submit.prevent="edittingListObj.id ? updateList() : addList()"
  >
    <InputCustom
      :model-value="edittingListObj.title"
      label="title"
      :is-focus="true"
      :disabled="requestHandling.isRequestProcessing"
      required
      @update:model-value="value => updateListField('title', value)"
    />
    <div class="private-option">
      <CheckboxCustom
        :model-value="edittingListObj.isPrivate"
        label="private"
        style-type="initial"
        :disabled="requestHandling.isRequestProcessing"
        @update:model-value="value => updateListField('isPrivate', value)"
      />
      <CustomLink
        v-if="isPublicViewLinkShown"
        class="public-view-link"
        :to="{ 
          name: 'list',
          params: { id: edittingListObj.id },
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
      <ListTags :disabled="requestHandling.isRequestProcessing" />
    </SectionCard>
    <SectionCard
      title="categories"
      position="left"
      text-style="caps"
      size="small"
    >
      <ListCategories :disabled="requestHandling.isRequestProcessing" />
    </SectionCard>
    <TogglingBlock
      v-if="edittingListObj?.referringItems?.length"
      title="referring items"
    >
      <div class="referring-units-container">
        <CustomLink
          v-for="item in edittingListObj.referringItems"
          :key="item.id"
          :to="{ name: 'item', params: { id: item.id || item } }"
          :title="item.title || 'untitled'"
          class="referring-unit"
          :class="{ 'untitled-item': !item.title}"
          target="_blank"
        />
      </div>
    </TogglingBlock>
    <div 
      v-if="edittingListObj?.createdAt"
      class="stats"
    >
      <div>
        total items: {{ edittingListObj.items.length }}
      </div>
      <PopupBox
        button-style-type="info"
        stop-propagation
      >
        <div>
          created at: {{ getFormattedDate(edittingListObj.createdAt) }}
        </div>
        <div>
          updated at: {{ getFormattedDate(edittingListObj.updatedAt) }}
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
          :text="edittingListObj ? 'save' : 'add'"
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
        v-if="edittingListObj"
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
      padding: 8px 0 15px;
    }

    .referring-units-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 5px;
    }

    .referring-unit,
    .public-view-link  {
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
    }

    .public-view-link  {
      padding: 5px 10px 0 0;
    }

    .untitled-item {
      color: map-get($colors, 'gray-light');
    }

    .error-container {
      height: 50px;
      padding-top: 10px;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 10px;
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
