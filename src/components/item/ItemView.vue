<script>
import SectionCard from '@/components/wrappers/SectionCard.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';
import RelatedUnits from '@/components/item/RelatedUnits.vue';
import { mapGetters, mapMutations } from 'vuex';
import { deleteFromQuery } from '@/router/utils';

export default {
  components: {
    SectionCard,
    CustomLink,
    RelatedUnits,
  },
  computed: {
    ...mapGetters('lists', [
      'currentListTags',
      'currentListCategories',
    ]),
    ...mapGetters('items', [
      'currentItemObj',
    ]),
    ...mapGetters('settings', [
      'isItemFormInSidebar',
    ]),
    currentItemCategory() {
      return this.currentListCategories.find(
        category => category.id === this.currentItemObj.category,
      );
    },
    currentItemTags() {
      return this.currentListTags.filter(
        listTag => this.currentItemObj.tags.includes(listTag.id),
      );
    },
  },
  unmounted() {
    this.setCurrentItemObj(null);
    this.setEdittingItemIndex(null); 

    deleteFromQuery(this.isItemFormInSidebar ? ['item', 'sidebar'] : 'item');
  },
  methods: {
    ...mapMutations('items', [
      'setEdittingItemIndex',
      'setCurrentItemObj',
    ]),
    closeItemModal() {
      this.$vfm.hide('itemModal');
    },
  },
};
</script>

<template>
  <div
    v-if="currentItemObj"
    class="item-view"
  >
    <div class="text-fields">
      <div class="title">
        {{ currentItemObj.title }}
      </div>
      <div 
        v-if="currentItemObj.details"
        class="details"
      > 
        {{ currentItemObj.details }}
      </div>
    </div>
    <div class="item-filters">
      <SectionCard
        v-if="currentItemTags.length"
        title="tags"
        size="small"
        text-style="caps"
        position="left"
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
        size="small"
        text-style="caps"
        position="left"
      >
        <div class="filter-container">
          <div class="category">
            {{ currentItemCategory.title }}
          </div>
        </div>
      </SectionCard>
    </div>
    <RelatedUnits position="left" />
    <div
      v-if="$route.name !== 'item'"
      class="single-item-link"
    >
      <CustomLink
        :to="{ name: 'item', params: { id: currentItemObj.id } }"
        title="open item separately"
        size="small"
        new-tab
      />
    </div>
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
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: 7px;
    }

    .tag,
    .category {
      color: map-get($colors, 'gray-dark');
      font-size: 14px;
      text-align: center;
    }

    .single-item-link {
      padding: 15px 0;
      text-align: right;
    }
  }
</style>
