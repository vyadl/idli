<template>
  <div class="filters-showing">
    <div class="tags">
      <div class="g-setting-title small">
        tags
      </div>
      <label
        class="g-label"
        :class="{'active': tag.value}"
        v-for="tag in localTags"
        :key="tag.id"
      >
        {{ tag.name }}
        <input
          type="checkbox"
          class="g-hidden"
          :true-value="1"
          :false-value="0"
          v-model="tag.value"
          @change="changeFilter"
        >
      </label>
    </div>
    <div class="categories">
      <div class="g-setting-title small">
        categories
      </div>
      <label
        v-for="category in localCategories"
        :key="category.id"
        class="g-label"
        :class="{'active': category.value}"
      >
        {{ category.name }}
        <input
          type="checkbox"
          class="g-hidden"
          :true-value="1"
          :false-value="0"
          v-model="category.value"
          @change="changeFilter"
        >
      </label>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    localTags: [],
    localCategories: [],
  }),
  computed: {
    ...mapGetters({
      currentListTags: 'currentListTags',
      currentListCategories: 'currentListCategories',
    }),
  },
  created() {
    this.localTags = [...this.currentListTags];
    this.localCategories = [...this.currentListCategories];
  },
  methods: {
    ...mapActions(['_filterList']),
    // changeFilter() {
    //   const tags = this.localTags.filter(tag => tag.value).map(tag => tag.id);
    //   const categories = this.localFilters.categories
    //     .filter(category => category.value).map(category => category.id);

    //   this._filterList({ tags, categories });
    // },
  },
};
</script>

<style lang="scss">
  .filters-showing {
    .categories {
      padding-top: 20px;
    }
  }
</style>
