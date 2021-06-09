<template>
  <div class="filters-editting">
    <div class="tags">
      <div class="g-setting-title small">tags</div>
      <div v-for="tag in localFilters.tags" :key="tag.id">
        <input type="text" v-model="tag.name" @change="changeFilter('tags', tag.name, tag.id)" />
        <button
          type="button"
          class="g-button"
          @click.stop.prevent="removeFilter('tags', tag.id)"
        >remove tag</button>
      </div>
      <input type="text" v-model="newTag" />
      <button
        type="button"
        class="g-button"
        @click.stop.prevent="addFilter('tags', newTag)"
      >add tag</button>
    </div>
    <div class="types">
      <div class="g-setting-title small">types</div>
      <div v-for="type in localFilters.types" :key="type.id">
        <input
          type="text"
          v-model="type.name"
          @change="changeFilter('types', type.name, type.id)"
        />
        <button
          type="button"
          class="g-button"
          @click.stop.prevent="removeFilter('types', type.id)"
        >remove type</button>
      </div>
      <input type="text" v-model="newType" />
      <button
        type="button"
        class="g-button"
        @click.stop.prevent="addFilter('types', newType)"
      >add type</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    localFilters: {
      tags: [],
      types: [],
    },
    newTag: '',
    newType: '',
  }),
  computed: {
    ...mapGetters(['filters']),
  },
  watch: {
    filters: {
      handler() {
        this.localFilters = JSON.parse(JSON.stringify(this.filters));
      },
      deep: true,
    },
  },
  created() {
    this.localFilters = JSON.parse(JSON.stringify(this.filters));
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
      this[type === 'tags' ? 'newTag' : 'newType'] = '';
    },
    changeFilter(type, name, id) {
      this._changeFilter({ type, name, id });
    },
  },
};
</script>

<style lang="scss">
  .filters-editting {
    .types {
      padding-top: 20px;
    }
  }
</style>
