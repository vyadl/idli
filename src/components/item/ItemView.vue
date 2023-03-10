<script>
import SectionCard from '@/components/wrappers/SectionCard.vue';
import RelatedUnits from '@/components/item/RelatedUnits.vue';
import ItemActionsMenu from '@/components/item/ItemActionsMenu.vue';
import { mapGetters } from 'vuex';
import { deleteFromQuery } from '@/router/utils';
import routerQueue from '@/router/routerQueue';

export default {
  components: {
    SectionCard,
    RelatedUnits,
    ItemActionsMenu,
  },
  props: {
    item: Object,
    isQueryNeedDeleting: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['finish-view'],
  computed: {
    ...mapGetters('items', [
      'isItemSavingAllowed',
    ]),
    ...mapGetters('lists', [
      'lists',
    ]),
    ...mapGetters('settings', [
      'isItemFormInSidebar',
    ]),
    parentList() {
      return this.lists.find(list => list.id === this.item.listId);
    },
    itemCategory() {
      return this.parentList?.categories.find(
        category => category.id === this.item.category,
      );
    },
    itemTags() {
      return this.parentList?.tags.filter(
        listTag => this.item.tags.includes(listTag.id),
      );
    },
  },
  unmounted() {
    if (this.isQueryNeedDeleting) {
      const args = this.isItemFormInSidebar
        ? ['item', 'sidebar']
        : 'item';

      routerQueue.add({
        method: deleteFromQuery,
        args,
      });
    }

    this.$emit('finish-view');
  },
  methods: {
    closeItemModal() {
      this.$vfm.hide('itemModal');
    },
  },
};
</script>

<template>
  <div
    v-if="item"
    class="item-view"
  >
    <ItemActionsMenu v-if="isItemSavingAllowed" />
    <div class="text-fields">
      <div
        class="title"
        :class="{ untitled: !item.title }"
      >
        {{ item.title || 'Untitled' }}
      </div>
      <div 
        v-if="item.details"
        class="details"
      > 
        {{ item.details }}
      </div>
    </div>
    <div class="item-filters">
      <SectionCard
        v-if="itemTags?.length"
        title="tags"
        size="small"
        text-style="caps"
        position="left"
      >
        <div class="filters-container">
          <span
            v-for="(tag, index) in itemTags"
            :key="tag.id"
            class="tag"
          >
            {{ tag.title }}<span v-if="index !== itemTags?.length - 1">, </span>
          </span>
        </div>
      </SectionCard>
      <SectionCard
        v-if="itemCategory"
        title="category"
        size="small"
        text-style="caps"
        position="left"
      >
        <div class="filter-container">
          <div class="category">
            {{ itemCategory.title }}
          </div>
        </div>
      </SectionCard>
    </div>
    <RelatedUnits
      :item-to-show="item"
      :editable="false"
    />
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

      &.untitled {
        opacity: 0.5;
      }
    }

    .details {
      font-size: 18px;
    }

    .title,
    .details {
      overflow-wrap: anywhere;
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
    }
  }
</style>
