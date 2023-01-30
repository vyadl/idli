<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';
import PopupBox from '@/components/wrappers/PopupBox.vue';
import RelatedUnits from '@/components/item/RelatedUnits.vue';
import { mapGetters, mapMutations } from 'vuex';
import { deleteFromQuery } from '@/router/utils';

export default {
  components: {
    ButtonText,
    SectionCard,
    CustomLink,
    PopupBox,
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
    openSingleItemInNewTab() {
      window.open(`${window.location.origin}/item/${this.currentItemObj.id}`, '_blank');
    },
    copySingleItemLink() {
      navigator.clipboard.writeText(`${window.location.origin}/item/${this.currentItemObj.id}`);
    },
  },
};
</script>

<template>
  <div
    v-if="currentItemObj"
    class="item-view"
  >
    <div class="menu-button-container">
      <PopupBox
        button-style-type="dots"
        stop-propagation
        position="left"
        content-type="functional"
      >
        <ButtonText
          text="copy item link"
          style-type="brick"
          size="small"
          @click="copySingleItemLink"
        />
        <ButtonText
          text="open item in new tab"
          style-type="brick"
          size="small"
          @click="openSingleItemInNewTab"
        />
      </PopupBox>
    </div>
    <div class="text-fields">
      <div
        class="title"
        :class="{ untitled: !currentItemObj.title }"
      >
        {{ currentItemObj.title || 'Untitled' }}
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
    <RelatedUnits />
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
    .menu-button-container {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      padding-top: 10px;
    }
    
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
    }

    .single-item-link {
      padding: 15px 0;
      text-align: right;
    }
  }
</style>
