<template>
  <div class="filters-editting">
    <div class="tags">
      <div class="g-setting-title small">tags</div>
      <div
        v-for="tag in localTags"
        :key="tag.id"
      >
        <input
          type="text"
          v-model="tag.name"
          @change="changeFilter('tags', tag.name, tag.id)"
        />
        <button
          type="button"
          class="g-button"
          @click.stop.prevent="removeFilter('tags', tag.id)"
        >remove tag</button>
      </div>
      <input
        type="text"
        v-model="newTag"
      />
      <button
        type="button"
        class="g-button"
        @click.stop.prevent="addFilter('tags', newTag)"
      >add tag</button>
    </div>
    <div class="categories">
      <div class="g-setting-title small">categories</div>
      <div
        v-for="category in localFilters.categories"
        :key="category.id"
      >
        <input
          type="text"
          v-model="category.name"
          @change="changeFilter('categories', category.name, category.id)"
        />
        <button
          type="button"
          class="g-button"
          @click.stop.prevent="removeFilter('categories', category.id)"
        >remove category</button>
      </div>
      <input
        type="text"
        v-model="newCategory"
      />
      <button
        type="button"
        class="g-button"
        @click.stop.prevent="addFilter('categories', newCategory)"
      >add category</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    localTags: [],
    localCategories: [],
    newTag: '',
    newCategory: '',
  }),
  computed: {
    ...mapGetters({
      currentListTags: 'currentListTags',
      currentListCategories: 'currentListCategories',
    }),
  },
  watch: {
    currentListTags: function currentListTagsHandler() {
      this.setLocalFilters();
    },
    currentListCategories: function currentListCategoriesHandler() {
      this.setLocalFilters();
    },
  },
  created() {
    this.setLocalFilters();
  },
  methods: {
    ...mapActions([
      '_addFilter',
      '_removeFilter',
      '_changeFilter',
    ]),
    setLocalFilters() {
      this.localTags = [...this.currentListTags];
      this.localCategories = [...this.currentListCategories];
    },
    removeFilter(type, id) {
      this._removeFilter({ type, id });
    },
    addFilter(type, name) {
      this._addFilter({ type, name });
      this[type === 'tags' ? 'newTag' : 'newCategory'] = '';
    },
    changeFilter(type, name, id) {
      this._changeFilter({ type, name, id });
    },
  },
};
</script>

<style lang="scss">
  .filters-editting {
    .categories {
      padding-top: 20px;
    }
  }
</style>
