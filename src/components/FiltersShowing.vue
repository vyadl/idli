<template>
  <div>
    <div class="filters__tags">
      <div class="g-setting-title g-setting-title--small">
        tags
      </div>
      <label 
        class="g-label"
        :class="{'g-label--active': tag.value}"
        v-for="tag in localFilters.tags"
        :key="tag.id"
      >
        {{ tag.name }}
        <input 
          type="checkbox"
          class="filters__input"
          :true-value="1"
          :false-value="0"
          v-model="tag.value"
          @change="changeFilter"
        >
      </label>
    </div>
    <div class="filters__types">
      <div class="g-setting-title g-setting-title--small">
        types
      </div>
      <label 
        v-for="type in localFilters.types"
        :key="type.id"
        class="g-label"
        :class="{'g-label--active': type.value}"
      >
        {{ type.name }}
        <input 
          type="checkbox"
          class="filters__input"
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
import { mapGetters, mapActions, mapState } from 'vuex';


export default {
  name: 'FiltersShowing',

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
.filters {
  &__inner {
    user-select: none;
    min-height: 100px;
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
    transition: .2s opacity;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }

    &::before {
      content: '...';
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