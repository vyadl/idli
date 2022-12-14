<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ButtonSign from '@/components/formElements/ButtonSign.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import PopupBox from '@/components/wrappers/PopupBox.vue';
import TogglingBlock from '@/components/wrappers/TogglingBlock.vue';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';
import { isConfirmed } from '@/settings/confirmationPromise';
import { List } from '@/models/models';
import { mapActions, mapGetters } from 'vuex';
import { getFormattedDate } from '@/utils/misc';
import { handleRequestStatuses } from '@/utils/misc';

export default {
  components: {
    InputCustom,
    CheckboxCustom,
    ButtonText,
    ButtonSign,
    ErrorMessage,
    PopupBox,
    TogglingBlock,
    SectionCard,
    CustomLink,
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
    deleteGroupingField(groupingFieldType, index) {
      this.list[groupingFieldType].splice(index, 1);
    },
    addGroupingField(groupingFieldType) {
      this.list[groupingFieldType].push({
        title: null,
        id: null,
      });
      this.$nextTick(() => {
        const groupingFieldsRefs = this.$refs[`${groupingFieldType}Input`];

        groupingFieldsRefs[groupingFieldsRefs.length - 1].focus();
      });
    },
    validateListTitle() {
      return !this.lists.some(storeList => {
        return storeList.title === this.list.title
          && storeList.id !== this.list.id;
      });
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

        const request = this._updateList(this.list);

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
    @submit.prevent="edittingListObj ? updateList() : addList()"
  >
    <InputCustom
      v-model="list.title"
      label="title"
      :is-focus="!edittingListObj"
      :disabled="requestHandling.isRequestProcessing"
      required
    />
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
    <div class="grouping-fields-container">
      <div class="tags">
        <SectionCard
          title="tags"
          :size="isMobileScreen ? 'small' : ''"
        >
          <div
            v-for="(tag, index) in list.tags"
            :key="index"
            class="grouping-field"
          >
            <InputCustom
              ref="tagsInput"
              v-model="tag.title"
              required
              :disabled="requestHandling.isRequestProcessing"
            />
            <ButtonSign
              class="delete-grouping-field-button"
              style-type="cross"
              title="delete tag"
              :disabled="requestHandling.isRequestProcessing"
              @click="deleteGroupingField('tags', index)"
            />
          </div>
          <ButtonSign
            style-type="plus"
            title="add tag"
            :disabled="requestHandling.isRequestProcessing"
            @click="addGroupingField('tags')"
          />
        </SectionCard>
      </div>
      <div class="categories">
        <SectionCard
          title="categories"
          :size="isMobileScreen ? 'small' : ''"
        >
          <div
            v-for="(category, index) in list.categories"
            :key="index"
            class="grouping-field"
          >
            <InputCustom
              ref="categoriesInput"
              v-model="category.title"
              required
              :disabled="requestHandling.isRequestProcessing"
            />
            <ButtonSign
              class="delete-grouping-field-button"
              style-type="cross"
              title="delete category"
              :disabled="requestHandling.isRequestProcessing"
              @click="deleteGroupingField('categories', index)"
            />
          </div>
          <ButtonSign
            style-type="plus"
            title="add category"
            :disabled="requestHandling.isRequestProcessing"
            @click="addGroupingField('categories')"
          />
        </SectionCard>
      </div>
    </div>
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

    .public-view-link {
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
    }

    .grouping-fields-container {
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

    .grouping-field {
      display: flex;
      align-items: center;
    }

    .delete-grouping-field-button {
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
  }

  @media #{breakpoints.$s-media} {
    .list-form {
      .grouping-field {
        font-size: 12px;
      }

      .tags,
      .categories {
        border: none;
        padding: 10px;
      }

      .referring-units-container {
        grid-template-columns: 1fr;
      }

      .error-container {
        height: 60px;
      }
    }
  }
</style>
