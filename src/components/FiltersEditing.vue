<template>
  <div>
    <div class="filters__tags">
      <div class="g-setting-title g-setting-title--small">tags</div>
      <div v-for="tag in localFilters.tags" :key="tag.id">
        <input type="text" v-model="tag.name" @change="changeFilter('tags', tag.name, tag.id)" />
        <button
          type="button"
          class="g-button"
          @click.stop.prevent="removeFilter('tags', tag.id)"
        >remove tag</button>
      </div>
      <input type="text" v-model="newTag" />
      <button type="button" class="g-button" @click.stop.prevent="addFilter('tags', newTag)">add tag</button>
    </div>
    <div class="filters__types">
      <div class="g-setting-title g-setting-title--small">types</div>
      <div v-for="type in localFilters.types" :key="type.id">
        <input type="text" v-model="type.name" @change="changeFilter('types', type.name, type.id)" />
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
import { mapGetters, mapActions, mapState } from 'vuex';


export default {
  name: 'FiltersShowing',
  data: function() {
    return {
      localFilters: {
        tags: [],
        types: [],
      },
      newTag: '',
      newType: '',
    }
  },

  computed: {
    ...mapGetters(['filters', 'listLength']),
  },

  created() {
    this.localFilters = JSON.parse(JSON.stringify(this.filters));
  },

  watch: {
    filters: {
      handler(value) {
        this.localFilters = JSON.parse(JSON.stringify(this.filters));
      },
      deep: true,
    }
  },

  methods: {
    ...mapActions(['_setActiveItem', '_filterList', '_addFilter', '_removeFilter', '_changeFilter']),

    saveFilters() {
      this._saveFilters(this.localFilters);
    },

    removeFilter(type, id) {
      this._removeFilter({ type, id });
    },

    addFilter(type, name) {
      this._addFilter({ type, name });

      this[type === 'tags' ? 'newTag' : 'newType'] = '';
    },

    changeFilter(type, name, id) {
      this._changeFilter({ type, name, id });
    }
  },
}
</script>

<style lang="scss">
.filters {
  &__inner {
    user-select: none;
  }

  &__count {
    position: absolute;
    top: 5px;
    left: 5px;
    color: #bbb;
    font-size: 11px;
  }

  &__trigger {
    position: fixed;
    top: 60px;
    right: 17px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    z-index: 2;
    transition: 0.2s opacity;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }

    &::before {
      content: "...";
      font-size: 16px;
      text-align: center;
    }
  }

  &__edit {
    position: absolute;
    color: #bbb;
    top: auto;
    left: -35px;
    bottom: 7px;
    transform: rotate(-90deg);
    &--active {
      background-color: #333;
    }
  }

  &__types {
    padding-top: 20px;
  }

  &__input {
    display: none;
  }
}
</style>