<template>
  <div class="filters">
    <div class="inner">
      <div class="items-count">
        {{ filteredListLength }}
      </div>
      <div class="g-setting-title main">
        filters
      </div>
      <label
        class="g-label edit"
        :class="{'active': isEditing}"
      >
        edit
        <input
          type="checkbox"
          class="input"
          v-model="isEditing"
        >
      </label>
      <FiltersEditing v-if="isEditing" />
      <FiltersShowing v-else />
    </div>
  </div>
</template>

<script>
import FiltersShowing from '@/components/settings/FiltersShowing.vue';
import FiltersEditing from '@/components/settings/FiltersEditing.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    FiltersShowing,
    FiltersEditing,
  },
  data: () => ({
    isEditing: false,
    localFilters: {
      categories: [],
    },
  }),
  computed: {
    ...mapGetters([
      'currentListFilters',
      'filteredListLength',
    ]),
  },
  created() {
    this.localFilters = this.currentListFilters;
  },
  methods: {
    ...mapActions(['_filterList']),
    changeFilter() {
      this._filterList(this.localFilters);
    },
    switchEditing() {
      this.isEditing = !this.isEditing;
    },
  },
};
</script>

<style lang="scss">
  .filters {
    .inner {
      user-select: none;
    }

    .items-count {
      position: absolute;
      top: 5px;
      left: 5px;
      color: #bbb;
      font-size: 11px;
    }

    .edit {
      position: absolute;
      color: #bbb;
      top: auto;
      left: -35px;
      bottom: 7px;
      transform: rotate(-90deg);

      &.active {
        background-color: #333;
      }
    }

    .input {
      display: none;
    }
  }
</style>
