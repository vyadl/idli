<template>
  <div class="lists">
    <div class="inner">
      <div class="g-setting-title main">lists</div>
      <label class="g-label edit" :class="{ 'active': isEditing }">
        edit
        <input type="checkbox" class="g-hidden" v-model="isEditing" />
      </label>
      <ListsEditing v-if="isEditing" />
      <ListsShowing v-else />
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
      isDone: false,
      isLongterm: false,
      types: [],
    },
  }),
  computed: {
    ...mapGetters(['filters']),
  },
  created() {
    this.localFilters = this.filters;
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
    .inner {
      user-select: none;
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
  }
</style>
