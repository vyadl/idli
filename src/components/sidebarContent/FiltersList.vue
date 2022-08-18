<script>
import SearchField from '@/components/sidebarContent/SearchField.vue';
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  components: {
    SearchField,
    SidebarCard,
    CheckboxCustom,
    ButtonText,
    InfoMessage,
  },
  data: () => ({
    localCheckedTags: [],
    localCheckedCategories: [],
  }),
  computed: {
    ...mapState({
      currentSearchValue: 'currentSearchValue',
    }),
    ...mapGetters({
      currentListObj: 'currentListObj',
      currentListTags: 'currentListTags',
      currentListCategories: 'currentListCategories',
      checkedTags: 'checkedTags',
      checkedCategories: 'checkedCategories',
      filteredListLength: 'filteredListLength',
    }),
    tagsInfoMessage() {
      return !this.currentListTags?.length ? 'no tags in this list' : '';
    },
    categoriesInfoMessage() {
      return !this.currentListCategories?.length ? 'no categories in this list' : '';
    },
  },
  watch: {
    checkedTags(tags) {
      this.localCheckedTags = tags;
    },
    checkedCategories(categories) {
      this.localCheckedCategories = categories;
    },
  },
  methods: {
    ...mapActions({
      _filterList: '_filterList',
      _resetFilters: '_resetFilters',
    }),
    filterList() {
      this._filterList({
        tags: this.localCheckedTags,
        categories: this.localCheckedCategories,
      });
    },
    resetFilters() {
      this.localCheckedTags = [];
      this.localCheckedCategories = [];
      this._resetFilters();
    },
  },
};
</script>

<template>
<div class="filters-list">
  <div v-if="currentListObj">
    <SidebarCard title="search">
      <SearchField />
    </SidebarCard>
    <SidebarCard
      :class="`${globalTheme}-theme`"
      title="filters"
    >
      <h1 class="filters-title">tags</h1>
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
          v-model="localCheckedTags"
          @change="filterList"
        />
      </div>
      <h1 class="filters-title">categories</h1>
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
          v-model="localCheckedCategories"
          @change="filterList"
        />
      </div>
      <div class="bottom">
        <div class="items-count">selected: {{ filteredListLength }}</div>
        <ButtonText
          v-if="localCheckedTags.length || localCheckedCategories.length || currentSearchValue"
          text="reset filters"
          style-type="underline"
          @click="resetFilters"
        />
      </div>
    </SidebarCard>
  </div>
  <div v-else>
    <InfoMessage message="to manage filters you should choose or create list" />
  </div>
</div>
</template>

<style lang="scss">
  .filters-list {
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

    .bottom {
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
