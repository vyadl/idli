<template>
  <div class="lists">
    <div class="inner">
      <div class="g-setting-title main">lists</div>
      <ListsEditing v-if="isEditing" />
      <ListsShowing v-else />
      <label class="g-label edit" :class="{ 'active': isEditing }">
        edit
        <input type="checkbox" class="g-hidden" v-model="isEditing" />
      </label>
    </div>
  </div>
</template>

<script>
import ListsShowing from '@/components/settings/ListsShowing.vue';
import ListsEditing from '@/components/settings/ListsEditing.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ListsShowing,
    ListsEditing,
  },
  data: () => ({
    isEditing: false,
    localFilters: {
      categories: [],
    },
  }),
  computed: {
    ...mapGetters(['currentListFilters']),
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
  .lists {
    margin-bottom: 50px;

    .inner {
      user-select: none;
    }

    .edit {
      color: #333;

      &.active {
        background-color: #333;
      }
    }
  }
</style>
