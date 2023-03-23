<!-- eslint-disable no-param-reassign -->
<script>
import { mapGetters, mapActions } from 'vuex';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import TextareaCustom from '@/components/formElements/TextareaCustom.vue';
import InputCustom from '@/components/formElements/InputCustom.vue';
import RadioCustom from '@/components/formElements/RadioCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ItemTags from '@/components/item/ItemTags.vue';
import ItemCategories from '@/components/item/ItemCategories.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import { Item } from '@/models/models';
import {
  LIST_ITEMS_MAX_COUNT,
  BULK_ITEMS_MAX_COUNT,
  BULK_ITEMS_MAX_TOTAL_LENGTH,
  ITEM_TITLE_MAX_LENGTH,
} from '@/store/config';

export default {
  components: {
    SectionCard,
    TextareaCustom,
    InputCustom,
    RadioCustom,
    ButtonText,
    ItemTags,
    ItemCategories,
    ErrorMessage,
  },
  BULK_ITEMS_MAX_COUNT,
  BULK_ITEMS_MAX_TOTAL_LENGTH,
  ITEM_TITLE_MAX_LENGTH,
  LIST_ITEMS_MAX_COUNT,
  BULK_ITEMS_COUNT_ERROR_MESSAGE: 'you may add up to 200 items only',
  ITEM_TITLE_ERROR_MESSAGE: 'each item title should not be more than 500 symbols length',
  LIST_ITEMS_COUNT_ERROR_MESSAGE: 'you cannot add so many items in this list, limit exceeded',
  GROUPING_FIELD_ERROR_MESSAGE: 'tags and categories should not have repeated titles',
  data() {
    return {
      bulkItemsString: '',
      delimiter: '\n',
      delimiterOptions: {
        lineBreak: {
          title: 'line break',
          value: '\n',
        },
        comma: {
          title: 'comma',
          value: ',',
        },
      },
      isCustomDelimiterFieldShown: false,
      trimFiguresFrom: {
        start: null,
        end: null,
      },
      category: null,
      tags: [],
      groupingFieldErrorMessage: '',
      titlesErrorMessage: '',
    };
  },
  computed: {
    ...mapGetters('lists', [
      'currentListId',
      'currentListObj',
    ]),
  },
  methods: {
    ...mapActions('items', [
      '_addBulkItemsOnServer',
    ]),
    addItems() {
      this.clearTitlesErrorMessage();

      const trimItemTitle = itemTitle => {
        if (this.trimFiguresFrom.start) {
          itemTitle = itemTitle.slice(this.trimFiguresFrom.start);
        }

        if (this.trimFiguresFrom.end) {
          itemTitle = itemTitle.slice(0, itemTitle.length - this.trimFiguresFrom.end);
        }

        if (itemTitle.length > this.$options.ITEM_TITLE_MAX_LENGTH) {
          this.titlesErrorMessage = this.$options.ITEM_TITLE_ERROR_MESSAGE;

          return null;
        }

        return itemTitle;
      };

      const makeItemObj = itemTitle => {
        return new Item({
          title: itemTitle,
          tags: this.tags,
          category: this.category,
        });
      };

      let items = this.delimiter
        ? this.bulkItemsString.split(this.delimiter)
        : [this.bulkItemsString];

      items = items.map(item => makeItemObj(trimItemTitle(item)));

      if (items.length > this.$options.BULK_ITEMS_MAX_COUNT) {
        this.titlesErrorMessage = this.titlesErrorMessage
          ? `${this.titlesErrorMessage}; also, ${this.$options.BULK_ITEMS_COUNT_ERROR_MESSAGE}`
          : this.$options.BULK_ITEMS_COUNT_ERROR_MESSAGE;
      }

      if (this.currentListObj.items.length + items.length > this.$options.LIST_ITEMS_MAX_COUNT) {
        this.titlesErrorMessage = this.$options.LIST_ITEMS_COUNT_ERROR_MESSAGE;
      }

      if (!this.titlesErrorMessage) {
        this._addBulkItemsOnServer({
          items,
          listId: this.currentListId,
        })
          .then(() => {
            this.$vfm.hide('bulkItemsModal');
          });
      }
    },
    setIsCustomDelimiterFieldShown(value) {
      this.isCustomDelimiterFieldShown = value;

      if (value) {
        this.delimiter = '';
      }
    },
    updateItemsField(field, value) {
      if (field === 'tags' && !Array.isArray(value)) {
        this[field].push(value);
      } else {
        this[field] = value;
      }
    },
    showGroupingFieldErrorMessage() {
      this.groupingFieldErrorMessage = this.$options.GROUPING_FIELD_ERROR_MESSAGE;
    },
    clearGroupingFieldErrorMessage() {
      this.groupingFieldErrorMessage = '';
    },
    clearTitlesErrorMessage() {
      this.titlesErrorMessage = '';
    },
  },
};
</script>

<template>
  <div class="bulk-items-form">
    <div>
      <TextareaCustom
        v-model="bulkItemsString"
        label="type items titles"
        :rows="6"
        :max-length="$options.BULK_ITEMS_TOTAL_MAX_LENGTH"
        :is-focus="true"
        @update:model-value="clearTitlesErrorMessage"
      />
      <div class="error-section">
        <ErrorMessage
          v-if="titlesErrorMessage"
          :message="titlesErrorMessage"
        />
      </div>
    </div>
    <SectionCard
      title="choose delimiter"
      position="left"
    >
      <div class="delimiter-options">
        <RadioCustom
          v-for="option in delimiterOptions"
          :key="option.title"
          v-model="delimiter"
          class="delimiter"
          :label="option.title"
          :value="option.value"
          name="delimiter"
          @click="setIsCustomDelimiterFieldShown(false)"
        />
        <div class="custom-delimiter-button">
          <ButtonText
            text="custom"
            size="small"
            :active="isCustomDelimiterFieldShown"
            @click="setIsCustomDelimiterFieldShown(true)"
          />
        </div>
      </div>
      <TextareaCustom
        v-if="isCustomDelimiterFieldShown"
        v-model="delimiter"
        class="custom-delimiter"
        label="type your delimiter"
        :rows="2"
        :width="50"
        :is-focus="true"
      />
    </SectionCard>
    <SectionCard
      title="remove number of symbols"
      position="left"
    >
      <div class="trim-options">
        <InputCustom
          v-for="edge in ['start', 'end']"
          :key="edge"
          v-model="trimFiguresFrom[edge]"
          type="number"
          :label="`from ${edge}`"
          :width="70"
        />
      </div>
    </SectionCard>
    <SectionCard
      title="add tags or category for all items"
      position="left"
    >
      <SectionCard
        title="category"
        position="left"
        text-style="caps"
        size="small"
      >
        <ItemCategories
          :category-for-bulk-items="category"
          @throw-error="showGroupingFieldErrorMessage"
          @clear-error="clearGroupingFieldErrorMessage"
          @save-item="updateItemsField"
        />
      </SectionCard>
      <SectionCard
        title="tags"
        position="left"
        text-style="caps"
        size="small"
      >
        <ItemTags
          :tags-for-bulk-items="tags"
          @throw-error="showGroupingFieldErrorMessage"
          @clear-error="clearGroupingFieldErrorMessage"
          @save-item="updateItemsField"
        />
      </SectionCard>
      <ErrorMessage
        v-if="groupingFieldErrorMessage"
        :message="groupingFieldErrorMessage"
      />
    </SectionCard>
    <div>
      <ButtonText
        text="add items"
        @click="addItems"
      />
    </div>
  </div>
</template>

<style lang="scss">
.bulk-items-form {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .error-section {
    height: 30px;
  }

  .delimiter-options,
  .trim-options {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding-top: 10px;
  }

  .custom-delimiter-button {
    padding-left: 10px;
  }
}
</style>
