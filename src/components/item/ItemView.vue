<script>
import SectionCard from '@/components/wrappers/SectionCard.vue';
import RelatedUnits from '@/components/item/RelatedUnits.vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    SectionCard,
    RelatedUnits,
  },
  computed: {
    ...mapGetters('lists', [
      'currentListTags',
      'currentListCategories',
    ]),
    ...mapGetters('items', [
      'edittingItemObj',
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
    ...mapMutations('items', [
      'setEdittingItemIndex',
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
      <SectionCard
        v-if="currentItemTags.length"
        title="tags"
        small
        centered
        caps
      >
        <div class="filters-container">
          <span
            v-for="(tag, index) in currentItemTags"
            :key="tag.id"
            class="tag"
          >
            {{ tag.title }}<span v-if="index !== currentItemTags.length - 1">, </span>
          </span>
        </div>
      </SectionCard>
      <SectionCard
        v-if="currentItemCategory"
        title="category"
        small
        centered
        caps
      >
        <div class="filter-container">
          <div class="category">
            {{ currentItemCategory.title }}
          </div>
        </div>
      </SectionCard>
    </div>
    <RelatedUnits />
  </div>
</template>

<style lang="scss" scoped>
  .item-view {
    .text-fields {
      margin-bottom: 40px;
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

    .filters-container {
      display: flex;
      align-items: baseline;
      justify-content: center;
      flex-wrap: wrap;
      gap: 7px;
    }

    .tag,
    .category {
      color: map-get($colors, 'gray-dark');
      font-size: 14px;
      text-align: center;
    }
  }
</style>
