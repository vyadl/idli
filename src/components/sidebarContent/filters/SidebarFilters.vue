<script>
import SearchField from '@/components/sidebarContent/filters/SearchField.vue';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SearchField,
    SectionCard,
    CheckboxCustom,
    ButtonText,
    InfoMessage,
  },
  computed: {
    ...mapGetters('filters', [
      'checkedTags',
      'checkedCategories',
      'currentSearchValue',
      'filteredListLength',
    ]),
    ...mapGetters('lists', [
      'currentListObj',
      'currentListTags',
      'currentListCategories',
    ]),
    tagsInfoMessage() {
      return !this.currentListTags?.length ? 'no tags in this list' : '';
    },
    categoriesInfoMessage() {
      return !this.currentListCategories?.length ? 'no categories in this list' : '';
    },
  },
  methods: {
    ...mapActions('filters', [
      '_resetFilters',
      '_setCategories',
      '_setTags',
    ]),
  },
};
</script>

<template>
  <div class="sidebar-filters">
    <div v-if="currentListObj">
      <SectionCard
        title="search in list"
        centered
      >
        <SearchField />
      </SectionCard>
      <SectionCard
        :class="`${globalTheme}-theme`"
        title="filters"
        centered
      >
        <SectionCard
          class="filters-title"
          title="tags"
          small
        >
          <InfoMessage
            v-if="tagsInfoMessage"
            :message="tagsInfoMessage"
          />
          <div class="filters-container">
            <CheckboxCustom
              v-for="tag in currentListTags"
              :key="tag.id"
              :label="tag.title"
              :value="tag.id"
              :model-value="checkedTags"
              @update:model-value="newValue => _setTags(newValue)"
            />
          </div>
        </SectionCard>
        <SectionCard
          class="filters-title"
          title="categories"
          small
        >
          <InfoMessage
            v-if="categoriesInfoMessage"
            :message="categoriesInfoMessage"
          />
          <div class="filters-container">
            <CheckboxCustom
              v-for="category in currentListCategories"
              :key="category.id"
              :label="category.title"
              :value="category.id"
              :model-value="checkedCategories"
              @update:model-value="newValue => _setCategories(newValue)"
            />
          </div>
        </SectionCard>
        <footer class="footer">
          <div class="items-count">
            selected: {{ filteredListLength }}
          </div>
          <ButtonText
            v-if="checkedTags.length || checkedCategories.length || currentSearchValue"
            text="reset filters"
            style-type="underline"
            @click="_resetFilters"
          />
        </footer>
      </SectionCard>
    </div>
    <div v-else>
      <InfoMessage message="to manage filters you should choose or create list" />
    </div>
  </div>
</template>

<style lang="scss">
  .sidebar-filters {
    .filters-title {
      margin-bottom: 10px;
    }

    .filters-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 15px;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding-top: 15px;
    }

    .items-count {
      padding: 5px 0;
      line-height: 1.5;
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
    }

    &.inverted-theme {
      .items-count {
        color: map-get($colors, 'gray-light');
      }
    }
  }
</style>
