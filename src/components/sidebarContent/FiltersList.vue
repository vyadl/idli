<template>
  <SidebarCard
    class="filters-list"
    title="filters"
  >
    <h1 class="filters-title">tags</h1>
    <div class="filters-container">
      <CheckboxCustom
        v-for="tag in currentListTags"
        :key="tag.id"
        :value="tag.id"
        :label="tag.name"
        v-model="checkedTags"
        @change="filterList"
      />
    </div>
    <h1 class="filters-title">categories</h1>
    <div class="filters-container">
      <CheckboxCustom
        v-for="category in currentListCategories"
        :key="category.id"
        :value="category.id"
        :label="category.name"
        v-model="checkedCategories"
        @change="filterList"
      />
    </div>
    <ButtonText
      text="reset filters"
      @click="resetFilters"
    />
    <div>{{ filteredListLength }}</div>
  </SidebarCard>
</template>

<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarCard,
    CheckboxCustom,
    ButtonText,
  },
  data: () => ({
    checkedTags: [],
    checkedCategories: [],
  }),
  computed: {
    ...mapGetters({
      currentListTags: 'currentListTags',
      currentListCategories: 'currentListCategories',
      filteredListLength: 'filteredListLength',
    }),
  },
  methods: {
    ...mapActions({
      _filterList: '_filterList',
    }),
    filterList() {
      this._filterList({
        tags: this.checkedTags,
        categories: this.checkedCategories,
      });
    },
    resetFilters() {
      this.checkedTags = [];
      this.checkedCategories = [];
      this.filterList();
    },
  },
};
</script>

<style lang="scss">
  .filters-list {
    .filters-title {
      font-size: 17px;
    }
  }
</style>
