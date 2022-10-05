<script>
import { 
  mapGetters,
  mapActions,
  mapState,
  mapMutations,
} from 'vuex';

export default {
  computed: {
    ...mapState([
      'edittingItemIndex',
    ]),
    ...mapGetters([
      'currentListTags',
      'currentListCategories',
      'edittingItemObj',
      'isItemFormInSidebar',
      'isOwnerView',
    ]),
    currentItemTags() {
      return this.currentListTags.filter(
        listTag => this.edittingItemObj.tags.includes(listTag.id),
      );
    },
    currentItemCategory() {
      return this.currentListCategories.find(
        category => category.id === this.edittingItemObj.category,
      );
    },
  },
  unmounted() {
    this.setEdittingItemIndex(null); 
  },
  methods: {
    ...mapMutations([
      'setEdittingItemIndex',
    ]),
    ...mapActions([
      '_closeSidebar',
    ]),
    closeItemModal() {
      this.$vfm.hide('itemModal');
    },
  },
};
</script>

<template>
  <div
    v-if="edittingItemObj"
    class="item-view"
  >
    <div class="text-fields">
      <div class="title">
        {{ edittingItemObj.title }}
      </div>
      <div 
        v-if="edittingItemObj.details"
        class="details"
      > 
        {{ edittingItemObj.details }}
      </div>
    </div>
    <div class="item-filters">
      <div
        v-if="currentItemTags.length"
        class="filters-container"
      >
        <h1 class="filters-title">
          tags:
        </h1>
        <span
          v-for="(tag, index) in currentItemTags"
          :key="tag.id"
          class="tag"
        >
          {{ tag.title }}<span v-if="index !== currentItemTags.length - 1">, </span>
        </span>
      </div>
      <div
        v-if="currentItemCategory"
        class="filters-container"
      >
        <h1 class="filters-title">
          category:
        </h1>
        <div class="category">
          {{ currentItemCategory.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .item-view {
    .text-fields {
      margin-bottom: 50px;
    }

    .title {
      font-size: 22px;
      margin-bottom: 20px;
    }

    .details {
      font-size: 18px;
    }

    .title,
    .details {
      overflow-wrap: break-word;
    }

    .item-filters {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .filters-container {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 7px;
    }

    .tag,
    .category {
      color: map-get($colors, 'gray-dark');
      font-size: 14px;
    }
  }
</style>
