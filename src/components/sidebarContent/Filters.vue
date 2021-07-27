<template>
  <div class="filters">
    <div class="inner">
      <div class="items-count">
        {{ filteredListLength }}
      </div>
      <div class="g-setting-title main">
        filters
      </div>
      <FiltersEditing v-if="isEditing" />
      <FiltersShowing v-else />
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
    </div>
  </div>
</template>

<script>
import FiltersShowing from '@/components/sidebarContent/FiltersShowing.vue';
import FiltersEditing from '@/components/sidebarContent/FiltersEditing.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    FiltersShowing,
    FiltersEditing,
  },
  data: () => ({
    isEditing: false,
  }),
  computed: {
    ...mapGetters(['filteredListLength']),
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
      color: #333;

      &.active {
        background-color: #333;
      }
    }

    .input {
      display: none;
    }
  }
</style>
