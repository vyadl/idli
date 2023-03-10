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
      bulkItems: '',
      items: [],
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
        custom: {
          title: 'custom',
          value: '',
        },
      },
      customDelimiter: '',
      trim: {
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
      this.items = this.bulkItems
        .split(this.delimiter || this.customDelimiter)
        .map(itemTitle => {
          if (this.trim.start) {
            // eslint-disable-next-line no-param-reassign
            itemTitle = itemTitle.slice(this.trim.start);
          }

          if (this.trim.end) {
            // eslint-disable-next-line no-param-reassign
            itemTitle = itemTitle.slice(0, itemTitle.length - this.trim.end);
          }

          // eslint-disable-next-line no-param-reassign
          return new Item({
            title: itemTitle,
            tags: this.tags,
            category: this.category,
          });
        });

      this._addBulkItemsOnServer({
        items: this.items,
        listId: this.currentListId,
      })
        .then(() => {
          this.$vfm.hide('bulkItemsModal');
        });
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
      v-model="bulkItems"
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
        />
      </div>
      <TextareaCustom
        v-if="delimiter === delimiterOptions.custom.value"
        v-model="customDelimiter"
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
          v-model="trim[edge]"
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
    gap: 10px;
    padding-top: 10px;
  }
}
</style>
