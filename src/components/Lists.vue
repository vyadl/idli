<template>
  <div class="filters">
    <div class="filters__inner">
      <div class="g-setting-title g-setting-title--main">lists</div>
      <label class="g-label filters__edit" :class="{'filters__edit--active': isEditing}">
        edit
        <input type="checkbox" class="filters__input" v-model="isEditing" />
      </label>
      <lists-editing v-if="isEditing"></lists-editing>
      <lists-showing v-else></lists-showing>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ListsShowing from './ListsShowing';
import ListsEditing from './ListsEditing';


export default {
  name: 'Lists',
  components: {
    ListsShowing,
    ListsEditing
  },

  data: function() {
    return {
      isEditing: false,
      localFilters: {
        isDone: false,
        isLongterm: false,
        types: [],
      }
    }
  },

  computed: {
    ...mapGetters(['filters']),
  },

  created() {
    this.localFilters = this.filters;
  },

  methods: {
    ...mapActions(['_setActiveItem', '_filterList']),

    changeFilter() {
      this._filterList(this.localFilters);
    },

    switchEditing() {
      this.isEditing = !this.isEditing;
    },
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