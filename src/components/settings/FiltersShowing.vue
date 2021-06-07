<template>
  <div class="filters-showing">
    <div class="tags">
      <div class="g-setting-title small">
        tags
      </div>
      <label 
        class="g-label"
        :class="{'active': tag.value}"
        v-for="tag in localFilters.tags"
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
    <div class="types">
      <div class="g-setting-title small">
        types
      </div>
      <label 
        v-for="type in localFilters.types"
        :key="type.id"
        class="g-label"
        :class="{'active': type.value}"
      >
        {{ type.name }}
        <input 
          type="checkbox"
          class="g-hidden"
          :true-value="1"
          :false-value="0"
          v-model="type.value"
          @change="changeFilter"
        >
      </label>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data: function() {
    return {
      localFilters: {
        tags: [],
        types: [],
      }
    }
  },

  computed: {
    ...mapGetters(['filters', 'listLength', 'checkedFilters']),
  },

  created() {
    this.localFilters = this.filters;
  },

  methods: {
    ...mapActions(['_setActiveItem', '_filterList']),

    changeFilter() {
      const filters = {
        tags: this.localFilters.tags.filter(item => item.value).map((item) => item.id),
        types: this.localFilters.types.filter(item => item.value).map((item) => item.id),
      }
      
      this._filterList(filters);
    },
  },
}
</script>

<style lang="scss">
  .filters-showing {
    .types {
      padding-top: 20px;
    }
  }
</style>
