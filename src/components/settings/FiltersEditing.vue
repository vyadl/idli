<template>
  <div class="filters-editting">
    <div class="tags">
      <div class="g-setting-title small">tags</div>
      <div
        v-for="tag in localFilters.tags"
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
    localFilters: {
      tags: [],
      categories: [],
    },
    newTag: '',
    newCategory: '',
  }),
  computed: {
    ...mapGetters(['currentListFilters']),
  },
  watch: {
    currentListFilters: {
      handler() {
        this.localFilters = JSON.parse(JSON.stringify(this.currentListFilters));
      },
      deep: true,
    },
  },
  created() {
    this.localFilters = JSON.parse(JSON.stringify(this.currentListFilters));
  },
  methods: {
    ...mapActions([
      '_addFilter',
      '_removeFilter',
      '_changeFilter',
    ]),
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
