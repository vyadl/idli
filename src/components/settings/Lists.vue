<template>
  <div class="lists">
    <div class="inner">
      <div class="g-setting-title main">lists</div>
      <label class="g-label lists-edit" :class="{ 'active': isEditing }">
        edit
        <input type="checkbox" class="g-hidden" v-model="isEditing" />
      </label>
      <lists-editing v-if="isEditing"></lists-editing>
      <lists-showing v-else></lists-showing>
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
  .lists {
    .inner {
      user-select: none;
    }

    // &__count {
    //   position: absolute;
    //   top: 5px;
    //   left: 5px;
    //   color: #bbb;
    //   font-size: 11px;
    // }

    // &__trigger {
    //   position: fixed;
    //   top: 60px;
    //   right: 17px;
    //   width: 20px;
    //   height: 20px;
    //   cursor: pointer;
    //   z-index: 2;
    //   transition: 0.2s opacity;
    //   opacity: 0.7;
    //   &:hover {
    //     opacity: 1;
    //   }

    //   &::before {
    //     content: "...";
    //     font-size: 16px;
    //     text-align: center;
    //   }
    // }

    .lists-edit {
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

    // &__types {
    //   padding-top: 20px;
    // }
  }
</style>