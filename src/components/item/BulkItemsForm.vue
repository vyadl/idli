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
    };
  },
  computed: {
    ...mapGetters('lists', [
      'currentListId',
    ]),
  },
  methods: {
    ...mapActions('items', [
      '_addBulkItemsOnServer',
    ]),
    addItems() {
      const trimItemTitle = itemTitle => {
        if (this.trimFiguresFrom.start) {
          itemTitle = itemTitle.slice(this.trimFiguresFrom.start);
        }

        if (this.trimFiguresFrom.end) {
          itemTitle = itemTitle.slice(0, itemTitle.length - this.trimFiguresFrom.end);
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

      const items = this.delimiter
        ? this.bulkItemsString.split(this.delimiter)
        : [this.bulkItemsString];

      this._addBulkItemsOnServer({
        items: items.map(item => makeItemObj(trimItemTitle(item))),
        listId: this.currentListId,
      })
        .then(() => {
          this.$vfm.hide('bulkItemsModal');
        });
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
    showErrorMessage() {
      this.groupingFieldErrorMessage = this.$options.GROUPING_FIELD_ERROR_MESSAGE;
    },
    clearErrorMessage() {
      this.groupingFieldErrorMessage = '';
    },
  },
};
</script>

<template>
  <div class="bulk-items-form">
    <TextareaCustom
      v-model="bulkItemsString"
      label="type items titles"
      :rows="6"
      :is-focus="true"
    />
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
          @throw-error="showErrorMessage"
          @clear-error="clearErrorMessage"
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
          @throw-error="showErrorMessage"
          @clear-error="clearErrorMessage"
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
